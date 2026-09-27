<?php
/**
 * JSON API of the WordPress-style admin at /admin/ (src/admin/).
 *
 * The website is built from the JSON files under src/content/ in the GitHub repository. This API lists,
 * reads and saves those files through the GitHub API with the CMS token (every save is a commit, which the
 * deploy workflow turns into a new build of the site), keeps each file's commit history as its revisions,
 * manages the images under public/, and shows the form submissions stored by lien-he.php.
 * Which files may be edited, and their fields, come from the Decap config (public/admin/decap/config.yml),
 * converted to admin-schema.json at build time.
 *
 * Calls: /api/admin.php?a=<action>&c=<collection>&s=<entry>. Writes are POST with the X-TD-Admin header,
 * which a form on another site cannot send; the session is a signed, HttpOnly, SameSite=Strict cookie.
 */

require __DIR__ . '/td-common.php';

date_default_timezone_set('Asia/Ho_Chi_Minh');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
header('X-Content-Type-Options: nosniff');

const APP_DIR = 'Tri-Viet-Phat-main/';
const CONTENT_PREFIX = APP_DIR . 'src/content/';
const PUBLIC_PREFIX = APP_DIR . 'public/';
const COOKIE = 'td_admin';
const SESSION_TTL = 7 * 86400;
const MEDIA_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg', 'pdf'];
const UPLOAD_TYPES = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif', 'avif' => 'image/avif', 'pdf' => 'application/pdf'];
const UPLOAD_MAX = 15 * 1024 * 1024;

function out($body, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400): void
{
    out(['error' => $message], $status);
}

$cfg = td_cms_config();
$local = $cfg['local_root'] !== '';
if ($cfg['user'] === '' || $cfg['pass'] === '' || (!$local && $cfg['token'] === '')) {
    fail('Chưa cấu hình tài khoản quản trị (thiếu cms-config.php trên hosting).', 500);
}

// ---- Session ----------------------------------------------------------------------------------

/** Changing the admin password or the token signs everyone out. */
function session_key(array $cfg): string
{
    return hash('sha256', 'td-admin|' . $cfg['user'] . '|' . $cfg['pass'] . '|' . $cfg['token'], true);
}

function b64url(string $s): string
{
    return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
}

function signed_in(array $cfg): bool
{
    $parts = explode('.', (string)($_COOKIE[COOKIE] ?? ''));
    if (count($parts) !== 2 || !hash_equals(b64url(hash_hmac('sha256', $parts[0], session_key($cfg), true)), $parts[1])) {
        return false;
    }
    $data = json_decode((string)base64_decode(strtr($parts[0], '-_', '+/')), true);
    return is_array($data) && (int)($data['exp'] ?? 0) > time();
}

function set_session_cookie(string $value, int $expires): void
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
    setcookie(COOKIE, $value, ['expires' => $expires, 'path' => '/api/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
}

$action = (string)($_GET['a'] ?? '');
$method = $_SERVER['REQUEST_METHOD'];

/** JSON body of a POST, decoded to objects so that {} stays {} when written back. */
function body()
{
    static $body = false;
    if ($body === false) {
        $body = json_decode((string)file_get_contents('php://input'));
    }
    return $body;
}

if ($method === 'POST' && ($_SERVER['HTTP_X_TD_ADMIN'] ?? '') !== '1') {
    fail('Yêu cầu không hợp lệ.', 403);
}

if ($action === 'login') {
    if ($method !== 'POST') {
        fail('Phương thức không hợp lệ.', 405);
    }
    if (td_login_blocked()) {
        fail('Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.', 429);
    }
    $user = mb_strtolower(trim((string)(body()->username ?? '')));
    $pass = (string)(body()->password ?? '');
    $userOk = hash_equals(hash('sha256', mb_strtolower($cfg['user'])), hash('sha256', $user));
    $passOk = hash_equals(hash('sha256', $cfg['pass']), hash('sha256', $pass));
    if (!$userOk || !$passOk) {
        td_login_failed();
        usleep(1500000);
        fail('Sai tên đăng nhập hoặc mật khẩu.', 401);
    }
    td_login_succeeded();
    $expires = time() + SESSION_TTL;
    $payload = b64url(json_encode(['u' => $cfg['user'], 'exp' => $expires]));
    set_session_cookie($payload . '.' . b64url(hash_hmac('sha256', $payload, session_key($cfg), true)), $expires);
    out(['user' => $cfg['user']]);
}

if ($action === 'logout') {
    set_session_cookie('', time() - 3600);
    out(['ok' => true]);
}

if (!signed_in($cfg)) {
    fail('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.', 401);
}

if ($action === 'me') {
    out(['user' => $cfg['user'], 'local' => $local]);
}

// ---- Collections (from the Decap config) ------------------------------------------------------

function schema(): array
{
    static $schema = null;
    if ($schema === null) {
        $file = __DIR__ . '/admin-schema.json';
        $schema = is_file($file) ? json_decode((string)file_get_contents($file), true) : null;
        if (!is_array($schema)) {
            fail('Thiếu admin-schema.json (tạo ra khi build website).', 500);
        }
    }
    return $schema;
}

function collection(string $name): array
{
    foreach (schema()['collections'] ?? [] as $c) {
        if (($c['name'] ?? '') === $name) {
            return $c;
        }
    }
    fail('Không có mục nội dung này.', 404);
}

/** The repository path of one entry's JSON file; only files under src/content/ can be touched. */
function entry_path(array $c, string $slug): string
{
    if (!empty($c['folder'])) {
        if (!preg_match('/^[a-z0-9][a-z0-9-]{0,150}$/', $slug)) {
            fail('Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang.');
        }
        $path = rtrim($c['folder'], '/') . '/' . $slug . '.json';
    } else {
        $path = '';
        foreach ($c['files'] ?? [] as $f) {
            if (($f['name'] ?? '') === $slug) {
                $path = (string)$f['file'];
            }
        }
    }
    if ($path === '' || strpos($path, CONTENT_PREFIX) !== 0 || substr($path, -5) !== '.json' || strpos($path, '..') !== false) {
        fail('Không tìm thấy nội dung này.', 404);
    }
    return $path;
}

/** A list row keeps the short fields only: long texts (article bodies) stay out of the list. */
function light($data)
{
    if (!is_object($data)) {
        return $data;
    }
    $row = new stdClass();
    foreach ($data as $k => $v) {
        if (is_string($v) && mb_strlen($v) > 400) {
            continue;
        }
        $row->$k = $v;
    }
    return $row;
}

/** Git's blob hash, the same "sha" GitHub reports for a file. */
function git_sha(string $bytes): string
{
    return sha1('blob ' . strlen($bytes) . "\0" . $bytes);
}

function json_bytes($data): string
{
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    // Two-space indentation, like the files Decap writes
    return preg_replace_callback('/^( {4})+/m', fn($m) => str_repeat('  ', strlen($m[0]) / 4), $json) . "\n";
}

function cache_dir(): string
{
    $dir = sys_get_temp_dir() . '/td-admin-cache';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    return $dir;
}

class Conflict extends Exception
{
}

// ---- Storage: GitHub, or a local checkout (development) ---------------------------------------

function gh(string $method, string $path, $body = null, int $timeout = 30): array
{
    global $cfg;
    return td_github($method, $path, $body, $cfg['token'], $timeout);
}

function gh_fail(int $status): void
{
    if ($status === 0) {
        fail('Không kết nối được tới GitHub. Vui lòng thử lại.', 502);
    }
    if ($status === 401 || $status === 403) {
        fail("GitHub từ chối quyền truy cập ($status). Kiểm tra lại CMS_GITHUB_TOKEN.", 502);
    }
    fail("GitHub báo lỗi $status. Vui lòng thử lại.", 502);
}

function url_path(string $path): string
{
    return implode('/', array_map('rawurlencode', explode('/', $path)));
}

/** File texts by blob sha, from the on-disk cache or GitHub (GraphQL in batches, REST as a fallback). */
function blob_texts(array $shas): array
{
    $texts = [];
    $missing = [];
    foreach (array_unique($shas) as $sha) {
        $file = cache_dir() . "/blob-$sha";
        if (is_file($file)) {
            $texts[$sha] = (string)file_get_contents($file);
        } else {
            $missing[] = $sha;
        }
    }
    if ($missing) {
        // The first listing of a big folder (300 articles) reads every file once; later ones come from the cache
        @set_time_limit(180);
    }
    [$owner, $name] = explode('/', TD_REPO);
    foreach (array_chunk($missing, 100) as $chunk) {
        $parts = [];
        foreach ($chunk as $i => $sha) {
            $parts[] = "b$i: object(oid: \"$sha\") { ... on Blob { text } }";
        }
        $query = 'query($o: String!, $n: String!) { repository(owner: $o, name: $n) { ' . implode(' ', $parts) . ' } }';
        [$status, $res] = gh('POST', 'graphql', ['query' => $query, 'variables' => ['o' => $owner, 'n' => $name]], 60);
        $repo = $status === 200 ? ($res->data->repository ?? null) : null;
        foreach ($chunk as $i => $sha) {
            $text = $repo->{"b$i"}->text ?? null;
            if (!is_string($text)) {
                [$s, $blob] = gh('GET', 'repos/' . TD_REPO . "/git/blobs/$sha");
                if ($s !== 200) {
                    gh_fail($s);
                }
                $text = (string)base64_decode((string)$blob->content);
            }
            $texts[$sha] = $text;
            @file_put_contents(cache_dir() . "/blob-$sha", $text);
        }
    }
    return $texts;
}

/** [[name, sha], …] of the .json files in a folder. */
function st_list_files(string $dir): array
{
    global $local, $cfg;
    if ($local) {
        $abs = $cfg['local_root'] . '/' . $dir;
        $files = [];
        foreach (is_dir($abs) ? scandir($abs) : [] as $n) {
            if (substr($n, -5) === '.json') {
                $files[] = [$n, git_sha((string)file_get_contents("$abs/$n"))];
            }
        }
        return $files;
    }
    [$status, $items] = gh('GET', 'repos/' . TD_REPO . '/contents/' . url_path($dir) . '?ref=' . TD_BRANCH);
    if ($status === 404) {
        return [];
    }
    if ($status !== 200 || !is_array($items)) {
        gh_fail($status);
    }
    $files = [];
    foreach ($items as $it) {
        if (($it->type ?? '') === 'file' && substr($it->name, -5) === '.json') {
            $files[] = [$it->name, $it->sha];
        }
    }
    return $files;
}

/** [sha, text] of a file, or null if it does not exist. */
function st_read(string $path): ?array
{
    global $local, $cfg;
    if ($local) {
        $abs = $cfg['local_root'] . '/' . $path;
        if (!is_file($abs)) {
            return null;
        }
        $bytes = (string)file_get_contents($abs);
        return [git_sha($bytes), $bytes];
    }
    [$status, $item] = gh('GET', 'repos/' . TD_REPO . '/contents/' . url_path($path) . '?ref=' . TD_BRANCH);
    if ($status === 404) {
        return null;
    }
    if ($status !== 200 || !isset($item->sha)) {
        gh_fail($status);
    }
    // Files over 1 MB come without content: read them as a blob
    $text = ($item->encoding ?? '') === 'base64' ? (string)base64_decode((string)$item->content) : (blob_texts([$item->sha])[$item->sha] ?? '');
    return [$item->sha, $text];
}

/** Writes a file; $sha is the version being replaced (null = the file must not exist yet). Returns the new sha. */
function st_write(string $path, string $bytes, ?string $sha, string $message): string
{
    global $local, $cfg;
    if ($local) {
        $abs = $cfg['local_root'] . '/' . $path;
        $current = is_file($abs) ? git_sha((string)file_get_contents($abs)) : null;
        if ($current !== $sha) {
            throw new Conflict();
        }
        if (!is_dir(dirname($abs))) {
            mkdir(dirname($abs), 0775, true);
        }
        file_put_contents($abs, $bytes);
        return git_sha($bytes);
    }
    $req = ['message' => $message, 'content' => base64_encode($bytes), 'branch' => TD_BRANCH];
    if ($sha !== null) {
        $req['sha'] = $sha;
    }
    [$status, $res] = gh('PUT', 'repos/' . TD_REPO . '/contents/' . url_path($path), $req, 120);
    if ($status === 409 || $status === 422) {
        throw new Conflict();
    }
    if (($status !== 200 && $status !== 201) || !isset($res->content->sha)) {
        gh_fail($status);
    }
    return $res->content->sha;
}

function st_delete(string $path, string $sha, string $message): void
{
    global $local, $cfg;
    if ($local) {
        $abs = $cfg['local_root'] . '/' . $path;
        if (!is_file($abs) || git_sha((string)file_get_contents($abs)) !== $sha) {
            throw new Conflict();
        }
        unlink($abs);
        return;
    }
    [$status] = gh('DELETE', 'repos/' . TD_REPO . '/contents/' . url_path($path), ['message' => $message, 'sha' => $sha, 'branch' => TD_BRANCH]);
    if ($status === 409 || $status === 422 || $status === 404) {
        throw new Conflict();
    }
    if ($status !== 200) {
        gh_fail($status);
    }
}

function commit_message(array $c, string $verb, string $slug, $data): string
{
    $label = mb_strtolower((string)($c['label_singular'] ?? $c['label'] ?? $c['name']));
    $title = '';
    foreach ([$c['identifier_field'] ?? 'title', 'title', 'name'] as $f) {
        if (is_object($data) && isset($data->$f) && is_string($data->$f) && trim($data->$f) !== '') {
            $title = trim($data->$f);
            break;
        }
    }
    if (empty($c['folder'])) {
        foreach ($c['files'] ?? [] as $f) {
            if (($f['name'] ?? '') === $slug) {
                return "$verb: " . $f['label'];
            }
        }
    }
    return "$verb $label: " . ($title !== '' ? mb_substr($title, 0, 80) : $slug);
}

try {
    switch ($action) {
        case 'schema':
            out(schema());

        case 'list':
            $c = collection((string)($_GET['c'] ?? ''));
            if (empty($c['folder'])) {
                out(array_map(fn($f) => ['slug' => $f['name'], 'label' => $f['label']], $c['files'] ?? []));
            }
            $files = st_list_files(rtrim($c['folder'], '/'));
            $texts = $local ? [] : blob_texts(array_column($files, 1));
            $rows = [];
            foreach ($files as [$name, $sha]) {
                $text = $local ? (string)file_get_contents($cfg['local_root'] . '/' . rtrim($c['folder'], '/') . "/$name") : ($texts[$sha] ?? '');
                $rows[] = ['slug' => substr($name, 0, -5), 'sha' => $sha, 'data' => light(json_decode($text) ?? new stdClass())];
            }
            out($rows);

        case 'get':
            $c = collection((string)($_GET['c'] ?? ''));
            $slug = (string)($_GET['s'] ?? '');
            $file = st_read(entry_path($c, $slug));
            if ($file === null) {
                if (empty($c['folder'])) {
                    out(['slug' => $slug, 'sha' => null, 'data' => new stdClass()]);
                }
                fail('Không tìm thấy nội dung này (có thể đã bị xóa).', 404);
            }
            out(['slug' => $slug, 'sha' => $file[0], 'data' => json_decode($file[1]) ?? new stdClass()]);

        case 'save':
            if ($method !== 'POST') {
                fail('Phương thức không hợp lệ.', 405);
            }
            $c = collection((string)($_GET['c'] ?? ''));
            $slug = (string)($_GET['s'] ?? '');
            $path = entry_path($c, $slug);
            $data = body()->data ?? null;
            $sha = isset(body()->sha) && is_string(body()->sha) ? body()->sha : null;
            if (!($data instanceof stdClass)) {
                fail('Dữ liệu không hợp lệ.');
            }
            if ($sha === null && !empty($c['folder']) && ($c['create'] ?? true) === false) {
                fail('Mục này không cho thêm mới.', 403);
            }
            $newSha = st_write($path, json_bytes($data), $sha, commit_message($c, $sha === null ? 'Thêm' : 'Sửa', $slug, $data));
            out(['slug' => $slug, 'sha' => $newSha]);

        case 'delete':
            if ($method !== 'POST') {
                fail('Phương thức không hợp lệ.', 405);
            }
            $c = collection((string)($_GET['c'] ?? ''));
            $slug = (string)($_GET['s'] ?? '');
            $sha = body()->sha ?? null;
            if (empty($c['folder']) || ($c['delete'] ?? true) === false || !is_string($sha)) {
                fail('Không xóa được mục này.');
            }
            $title = is_string(body()->title ?? null) ? (object)['title' => body()->title] : null;
            st_delete(entry_path($c, $slug), $sha, commit_message($c, 'Xóa', $slug, $title));
            out(['ok' => true]);

        case 'history':
            $c = collection((string)($_GET['c'] ?? ''));
            $path = entry_path($c, (string)($_GET['s'] ?? ''));
            if ($local) {
                out([]);
            }
            [$status, $commits] = gh('GET', 'repos/' . TD_REPO . '/commits?sha=' . TD_BRANCH . '&per_page=50&path=' . rawurlencode($path));
            if ($status !== 200 || !is_array($commits)) {
                gh_fail($status);
            }
            out(array_map(fn($x) => [
                'sha' => $x->sha,
                'date' => $x->commit->author->date ?? '',
                'author' => $x->commit->author->name ?? '',
                'message' => strtok((string)($x->commit->message ?? ''), "\n"),
            ], $commits));

        case 'version':
            $c = collection((string)($_GET['c'] ?? ''));
            $path = entry_path($c, (string)($_GET['s'] ?? ''));
            $ref = (string)($_GET['ref'] ?? '');
            if (!preg_match('/^[0-9a-f]{40}$/', $ref) || $local) {
                fail('Không có phiên bản này.');
            }
            [$status, $item] = gh('GET', 'repos/' . TD_REPO . '/contents/' . url_path($path) . '?ref=' . $ref);
            if ($status === 404) {
                out(['data' => new stdClass(), 'missing' => true]);
            }
            if ($status !== 200 || !isset($item->sha)) {
                gh_fail($status);
            }
            $text = ($item->encoding ?? '') === 'base64' ? (string)base64_decode((string)$item->content) : (blob_texts([$item->sha])[$item->sha] ?? '');
            out(['data' => json_decode($text) ?? new stdClass()]);

        case 'media':
            out(media_list(isset($_GET['fresh'])));

        case 'upload':
            if ($method !== 'POST') {
                fail('Phương thức không hợp lệ.', 405);
            }
            out(upload());

        case 'activity':
            if ($local) {
                out([]);
            }
            [$status, $commits] = gh('GET', 'repos/' . TD_REPO . '/commits?sha=' . TD_BRANCH . '&per_page=12');
            if ($status !== 200 || !is_array($commits)) {
                gh_fail($status);
            }
            out(array_map(fn($x) => [
                'sha' => $x->sha,
                'date' => $x->commit->author->date ?? '',
                'author' => $x->commit->author->name ?? '',
                'message' => strtok((string)($x->commit->message ?? ''), "\n"),
            ], $commits));

        case 'deploy':
            if ($local) {
                out(['status' => 'none']);
            }
            $runsPath = 'repos/' . TD_REPO . '/actions/runs?branch=' . TD_BRANCH . '&per_page=1';
            [$status, $runs] = gh('GET', $runsPath, null, 15);
            if ($status === 403 || $status === 404) {
                // A token limited to "Contents" may not read Actions; the runs of a public repository are public
                [$status, $runs] = td_github('GET', $runsPath, null, '', 15);
            }
            $run = $status === 200 ? ($runs->workflow_runs[0] ?? null) : null;
            if (!$run) {
                out(['status' => 'unknown']);
            }
            out([
                'status' => $run->status === 'completed' ? ($run->conclusion === 'success' ? 'success' : 'failure') : 'running',
                'started' => $run->run_started_at ?? $run->created_at,
                'updated' => $run->updated_at,
                'message' => strtok((string)($run->head_commit->message ?? ''), "\n"),
            ]);

        case 'leads':
            out(td_leads_all());

        case 'leads-update':
            if ($method !== 'POST') {
                fail('Phương thức không hợp lệ.', 405);
            }
            $ids = array_values(array_filter((array)(body()->ids ?? []), 'is_string'));
            $op = (string)(body()->op ?? '');
            if (!in_array($op, ['read', 'unread', 'delete'], true)) {
                fail('Thao tác không hợp lệ.');
            }
            $n = td_leads_change($ids, function ($lead) use ($op) {
                if ($op === 'delete') {
                    return null;
                }
                $lead['read'] = $op === 'read';
                return $lead;
            });
            out(['changed' => $n]);

        default:
            fail('Không có chức năng này.', 404);
    }
} catch (Conflict $e) {
    fail('Nội dung này vừa được sửa ở nơi khác (hoặc đường dẫn đã có). Hãy tải lại trang rồi sửa lại.', 409);
}

// ---- Media library ----------------------------------------------------------------------------

/** Every image and PDF under public/ (the site's own pictures and the uploads), newest uploads first. */
function media_list(bool $fresh): array
{
    global $local, $cfg;
    $cacheFile = cache_dir() . '/media.json';
    if (!$fresh && !$local && is_file($cacheFile) && filemtime($cacheFile) > time() - 60) {
        return json_decode((string)file_get_contents($cacheFile), true) ?: [];
    }
    $items = [];
    $add = function (string $rel, int $size) use (&$items) {
        $ext = strtolower(pathinfo($rel, PATHINFO_EXTENSION));
        if (!in_array($ext, MEDIA_TYPES, true) || preg_match('#^(admin|api)/#', $rel)) {
            return;
        }
        $items[] = ['url' => '/' . $rel, 'size' => $size, 'type' => $ext === 'pdf' ? 'pdf' : 'image'];
    };
    if ($local) {
        $root = $cfg['local_root'] . '/' . PUBLIC_PREFIX;
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
        foreach ($it as $f) {
            $add(str_replace('\\', '/', substr($f->getPathname(), strlen($root))), $f->getSize());
        }
    } else {
        [$status, $tree] = gh('GET', 'repos/' . TD_REPO . '/git/trees/' . TD_BRANCH . '?recursive=1', null, 60);
        if ($status !== 200 || !isset($tree->tree)) {
            gh_fail($status);
        }
        foreach ($tree->tree as $e) {
            if ($e->type === 'blob' && strpos($e->path, PUBLIC_PREFIX) === 0) {
                $add(substr($e->path, strlen(PUBLIC_PREFIX)), (int)($e->size ?? 0));
            }
        }
    }
    // Uploads (dated folders) newest first, then the site's built-in pictures
    usort($items, function ($a, $b) {
        $ua = strpos($a['url'], '/uploads/') === 0;
        $ub = strpos($b['url'], '/uploads/') === 0;
        return $ua !== $ub ? ($ua ? -1 : 1) : strcmp($b['url'], $a['url']);
    });
    if (!$local) {
        @file_put_contents($cacheFile, json_encode($items, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }
    return $items;
}

/** Stores an uploaded image/PDF in public/uploads/<year>/<month>/ and returns its URL. */
function upload(): array
{
    global $local, $cfg;
    $f = $_FILES['file'] ?? null;
    if (!$f || !is_array($f) || ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        $err = (int)($f['error'] ?? UPLOAD_ERR_NO_FILE);
        fail($err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE ? 'File quá lớn so với giới hạn của hosting.' : 'Không nhận được file tải lên.');
    }
    $ext = strtolower(pathinfo((string)$f['name'], PATHINFO_EXTENSION));
    if (!isset(UPLOAD_TYPES[$ext])) {
        fail('Chỉ tải lên được ảnh (JPG, PNG, WebP, GIF, AVIF) hoặc file PDF.');
    }
    if ($f['size'] > UPLOAD_MAX) {
        fail('File lớn hơn 15 MB.');
    }
    $bytes = (string)file_get_contents($f['tmp_name']);
    if (function_exists('finfo_open')) {
        $mime = finfo_buffer(finfo_open(FILEINFO_MIME_TYPE), $bytes);
        $ok = $ext === 'pdf' ? $mime === 'application/pdf' : strpos((string)$mime, 'image/') === 0;
        if (!$ok) {
            fail('Nội dung file không đúng định dạng ảnh/PDF.');
        }
    }
    // The browser sends an accent-free name; keep only safe characters
    $base = preg_replace('/[^a-z0-9-]+/', '-', strtolower((string)($_POST['name'] ?? pathinfo((string)$f['name'], PATHINFO_FILENAME))));
    $base = trim(substr(trim($base, '-'), 0, 60), '-') ?: 'tep';
    $folder = 'uploads/' . date('Y/m');
    $name = $base . '-' . base_convert((string)time(), 10, 36) . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
    $rel = "$folder/$name";

    st_write(PUBLIC_PREFIX . $rel, $bytes, null, "Tải lên: /$rel");
    // Copy it into the live site right away; the next deploy uploads the same file
    if (!$local) {
        $liveDir = dirname(__DIR__) . '/' . $folder;
        if (is_dir($liveDir) || @mkdir($liveDir, 0755, true)) {
            @file_put_contents("$liveDir/$name", $bytes);
        }
        @unlink(cache_dir() . '/media.json');
    }
    return ['url' => "/$rel", 'size' => strlen($bytes), 'type' => $ext === 'pdf' ? 'pdf' : 'image'];
}
