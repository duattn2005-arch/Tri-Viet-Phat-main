<?php
/**
 * Backup & export page for the site owner, in the spirit of WordPress's All-in-One WP Migration:
 * /admin/sao-luu (rewritten here by .htaccess).
 *
 * Everything the site is made of (products, articles, uploaded images, page texts, company settings
 * and the code) lives in the GitHub repository, and every CMS save is a commit there. So a backup is
 * simply a ZIP of the repository at a given version: "Xuất ra tệp" downloads the current one, and the
 * "Các bản sao lưu" list offers every earlier version. GitHub builds the ZIP; this script checks the
 * admin login (same account as /admin, from cms-config.php) and streams it through with a readable name.
 */

date_default_timezone_set('Asia/Ho_Chi_Minh');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
header('X-Frame-Options: DENY');

$configFile = __DIR__ . '/cms-config.php';
$config = is_file($configFile) ? require $configFile : [];
$adminUser = trim((string)($config['admin_username'] ?? ''));
$adminPass = (string)($config['admin_password'] ?? '');
$token = trim((string)($config['github_token'] ?? ''));
$repo = trim((string)($config['github_repo'] ?? 'duattn2005-arch/Tri-Viet-Phat-main'));

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
session_name('td_backup');
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
session_start();

const IDLE_LIMIT = 7200; // signed out after 2 hours without activity

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function page(string $title, string $body, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    $t = h($title);
    echo <<<HTML
<!doctype html><html lang="vi"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex" />
<title>{$t} · Trí Đức</title>
<link rel="icon" type="image/png" href="/favicon-tri-duc.png" />
<style>
  :root { --navy: #0a2540; --blue: #0a94dc; --red: #e11d2a; --line: #e3ebf3; --muted: #5b6b7c; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #f3f7fb; color: #111; }
  a { color: var(--blue); }
  .top { background: #fff; border-bottom: 1px solid var(--line); }
  .top-in, main { max-width: 960px; margin: 0 auto; padding: 0 16px; }
  .top-in { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .top img { height: 40px; }
  .top nav { display: flex; gap: 16px; font-size: 14px; }
  .top nav a { text-decoration: none; color: var(--navy); font-weight: 600; }
  main { padding-top: 28px; padding-bottom: 48px; }
  h1 { font-size: 24px; margin: 0 0 6px; color: var(--navy); }
  .lead { margin: 0 0 24px; color: var(--muted); font-size: 15px; }
  .card { background: #fff; border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 8px 24px -14px rgba(10,37,64,.25); margin-bottom: 20px; overflow: hidden; }
  .card h2 { margin: 0; padding: 16px 20px; font-size: 17px; color: var(--navy); border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 10px; }
  .card .in { padding: 20px; }
  .export { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
  .export p { margin: 0; font-size: 14px; color: #333; line-height: 1.6; max-width: 540px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 10px; cursor: pointer; font-weight: 700; text-decoration: none; font-size: 15px; }
  .btn-big { height: 56px; padding: 0 28px; color: #fff; background: linear-gradient(90deg, var(--navy), #0b3a66); box-shadow: 0 12px 28px -12px rgba(10,37,64,.8); letter-spacing: .03em; text-transform: uppercase; }
  .btn-big:hover { background: linear-gradient(90deg, var(--blue), var(--red)); }
  .btn-sm { height: 34px; padding: 0 14px; font-size: 13px; color: var(--navy); background: #eef4fa; }
  .btn-sm:hover { background: var(--navy); color: #fff; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); padding: 10px 20px; background: #f7fafd; border-bottom: 1px solid var(--line); }
  td { padding: 12px 20px; border-bottom: 1px solid var(--line); vertical-align: middle; }
  tr:last-child td { border-bottom: 0; }
  td.when { white-space: nowrap; color: var(--navy); font-weight: 600; }
  td.when small { display: block; font-weight: 400; color: var(--muted); }
  td.act, td.who { text-align: right; white-space: nowrap; }
  td.who { text-align: left; color: var(--muted); }
  .tag { display: inline-block; margin-left: 6px; padding: 2px 8px; border-radius: 99px; background: #e7f6ee; color: #0f7a3d; font-size: 11px; font-weight: 700; }
  .notes { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px; line-height: 1.6; }
  .notes h3 { margin: 0 0 6px; font-size: 14px; color: var(--navy); }
  .notes ul { margin: 0; padding-left: 18px; color: #333; }
  .error { background: #fdecec; color: #9b1c1c; border-radius: 10px; padding: 12px 14px; font-size: 14px; margin-bottom: 16px; }
  .login { max-width: 360px; margin: 10vh auto; }
  .login input { width: 100%; padding: 11px 12px; font-size: 15px; border: 1px solid #cfd8e3; border-radius: 8px; margin-bottom: 12px; }
  .login .btn { width: 100%; height: 46px; color: #fff; background: var(--navy); }
  /* Progress dialog while the file is being packed and downloaded */
  .modal { position: fixed; inset: 0; background: rgba(10,37,64,.55); display: none; align-items: center; justify-content: center; padding: 16px; z-index: 10; }
  .modal.open { display: flex; }
  .box { background: #fff; border-radius: 16px; width: 100%; max-width: 420px; padding: 26px; text-align: center; box-shadow: 0 24px 60px -20px rgba(0,0,0,.5); }
  .box h3 { margin: 0 0 6px; color: var(--navy); font-size: 18px; }
  .box p { margin: 0 0 18px; color: var(--muted); font-size: 14px; }
  .bar { height: 10px; border-radius: 99px; background: #e8eef5; overflow: hidden; }
  .bar i { display: block; height: 100%; width: 30%; border-radius: 99px; background: linear-gradient(90deg, var(--blue), var(--red)); animation: slide 1.2s ease-in-out infinite; }
  .bar.known i { animation: none; transition: width .2s; }
  @keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(340%); } }
  .box .size { margin-top: 10px; font-size: 13px; color: var(--navy); font-weight: 600; }
  .box .btn-sm { margin-top: 16px; }
  @media (max-width: 640px) {
    .notes { grid-template-columns: 1fr; }
    th:nth-child(3), td:nth-child(3) { display: none; }
    td, th { padding-left: 14px; padding-right: 14px; }
    .btn-big { width: 100%; }
  }
</style></head><body>{$body}</body></html>
HTML;
    exit;
}

function login_form(string $error = ''): void
{
    $err = $error !== '' ? '<div class="error">' . h($error) . '</div>' : '';
    page('Sao lưu', <<<HTML
<form class="card login" method="post" action="">
  <div class="in">
    <h1>Sao lưu &amp; xuất dữ liệu</h1>
    <p class="lead">Đăng nhập bằng tài khoản quản trị (giống trang /admin).</p>
    {$err}
    <input type="text" name="username" placeholder="Tên đăng nhập" autocomplete="username" autofocus required />
    <input type="password" name="password" placeholder="Mật khẩu" autocomplete="current-password" required />
    <button class="btn" type="submit">Đăng nhập</button>
  </div>
</form>
HTML);
}

/** GET a GitHub API path with the CMS token; returns [status, decoded JSON]. */
function github(string $path, string $token): array
{
    $ch = curl_init('https://api.github.com' . $path);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $token,
            'Accept: application/vnd.github+json',
            'X-GitHub-Api-Version: 2022-11-28',
            'User-Agent: tri-duc-backup',
        ],
    ]);
    $body = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    return [$status, is_string($body) ? json_decode($body, true) : null];
}

/** Stream the repository ZIP at `$sha` to the browser as `$filename`. */
function stream_zip(string $repo, string $sha, string $token, string $filename): void
{
    // The API answers with a redirect to a short-lived download link on codeload.github.com
    $ch = curl_init("https://api.github.com/repos/{$repo}/zipball/{$sha}");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'User-Agent: tri-duc-backup'],
    ]);
    curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $link = (string)curl_getinfo($ch, CURLINFO_REDIRECT_URL);
    curl_close($ch);
    if ($status !== 302 || $link === '') {
        http_response_code(502);
        header('Content-Type: text/plain; charset=utf-8');
        exit('GitHub chưa tạo được tệp sao lưu, vui lòng thử lại sau ít phút.');
    }

    @set_time_limit(0);
    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    // Send our own headers only once GitHub starts answering 200, so a failure can still show a message
    $length = null;
    $started = false;
    $ch = curl_init($link);
    curl_setopt_array($ch, [
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 3,
        CURLOPT_CONNECTTIMEOUT => 20,
        CURLOPT_HTTPHEADER => ['User-Agent: tri-duc-backup'],
        CURLOPT_HEADERFUNCTION => function ($ch, $line) use (&$length) {
            if (stripos($line, 'content-length:') === 0) {
                $length = (int)trim(substr($line, 15));
            }
            return strlen($line);
        },
        CURLOPT_WRITEFUNCTION => function ($ch, $data) use (&$started, &$length, $filename) {
            if (!$started) {
                if ((int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE) !== 200) {
                    return 0; // abort: not the file
                }
                header('Content-Type: application/zip');
                header('Content-Disposition: attachment; filename="' . $filename . '"');
                header('X-Content-Type-Options: nosniff');
                if ($length) {
                    header('Content-Length: ' . $length);
                }
                $started = true;
            }
            echo $data;
            flush();
            return strlen($data);
        },
    ]);
    curl_exec($ch);
    curl_close($ch);

    if (!$started) {
        http_response_code(502);
        header('Content-Type: text/plain; charset=utf-8');
        exit('Không tải được tệp sao lưu từ GitHub, vui lòng thử lại.');
    }
    exit;
}

/** Commit message as a short, friendly line ("cms: sửa news …" → "Sửa news …"). */
function describe(string $message): string
{
    $line = trim(strtok($message, "\n"));
    $line = preg_replace('/^(cms|feat|fix|chore|content|docs|style|refactor|ci|build|perf|test)(\([^)]*\))?:\s*/i', '', $line);
    return mb_strtoupper(mb_substr($line, 0, 1)) . mb_substr($line, 1);
}

if ($adminUser === '' || $adminPass === '' || $token === '') {
    page('Sao lưu', '<main><div class="error">Chưa cấu hình tài khoản quản trị (thiếu cms-config.php).</div></main>', 500);
}

// ---- Sign in / out ------------------------------------------------------

if (isset($_GET['dang-xuat'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: ?');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username'])) {
    // Same brute-force guard (and counter) as the /admin login: 10 failures per IP per 15 minutes
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $lockFile = sys_get_temp_dir() . '/tvp-cms-login-' . md5($ip);
    $now = time();
    $fails = array_filter(
        is_file($lockFile) ? (array)json_decode((string)file_get_contents($lockFile), true) : [],
        fn($t) => is_int($t) && $t > $now - 900
    );
    if (count($fails) >= 10) {
        login_form('Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.');
    }
    $userOk = hash_equals(hash('sha256', mb_strtolower($adminUser)), hash('sha256', mb_strtolower(trim((string)$_POST['username']))));
    $passOk = hash_equals(hash('sha256', $adminPass), hash('sha256', (string)($_POST['password'] ?? '')));
    if (!$userOk || !$passOk) {
        $fails[] = $now;
        @file_put_contents($lockFile, json_encode(array_values($fails)));
        usleep(1500000);
        login_form('Sai tên đăng nhập hoặc mật khẩu.');
    }
    @unlink($lockFile);
    session_regenerate_id(true);
    $_SESSION['ok'] = true;
    $_SESSION['seen'] = $now;
    header('Location: ?');
    exit;
}

if (empty($_SESSION['ok']) || time() - (int)($_SESSION['seen'] ?? 0) > IDLE_LIMIT) {
    $_SESSION = [];
    if (isset($_GET['tai'])) {
        http_response_code(401);
        header('Content-Type: text/plain; charset=utf-8');
        exit('Phiên đăng nhập đã hết, vui lòng tải lại trang và đăng nhập.');
    }
    login_form();
}
$_SESSION['seen'] = time();
session_write_close(); // a long download must not lock the session

// ---- Download one version ----------------------------------------------

if (isset($_GET['tai'])) {
    $ref = (string)$_GET['tai'];
    if ($ref !== 'main' && !preg_match('/^[0-9a-f]{7,40}$/', $ref)) {
        http_response_code(400);
        exit('Phiên bản không hợp lệ.');
    }
    [$status, $commit] = github("/repos/{$repo}/commits/{$ref}", $token);
    if ($status !== 200 || empty($commit['sha'])) {
        http_response_code(404);
        header('Content-Type: text/plain; charset=utf-8');
        exit('Không tìm thấy phiên bản này trên GitHub.');
    }
    $when = strtotime((string)($commit['commit']['committer']['date'] ?? 'now'));
    $filename = 'tri-duc-sao-luu-' . date('Ymd-Hi', $when) . '-' . substr($commit['sha'], 0, 7) . '.zip';
    stream_zip($repo, $commit['sha'], $token, $filename);
}

// ---- Page ---------------------------------------------------------------

[$status, $commits] = github("/repos/{$repo}/commits?sha=main&per_page=30", $token);
$rows = '';
if ($status === 200 && is_array($commits)) {
    foreach ($commits as $i => $c) {
        $sha = (string)($c['sha'] ?? '');
        if (!preg_match('/^[0-9a-f]{40}$/', $sha)) {
            continue;
        }
        $ts = strtotime((string)($c['commit']['committer']['date'] ?? ''));
        $latest = $i === 0 ? '<span class="tag">Mới nhất</span>' : '';
        $rows .= '<tr>'
            . '<td class="when">' . date('d/m/Y', $ts) . '<small>' . date('H:i', $ts) . '</small></td>'
            . '<td>' . h(describe((string)($c['commit']['message'] ?? ''))) . $latest . '</td>'
            . '<td class="who">' . h((string)($c['commit']['author']['name'] ?? '')) . '</td>'
            . '<td class="act"><a class="btn btn-sm" data-download href="?tai=' . $sha . '">⬇ Tải về</a></td>'
            . '</tr>';
    }
}
$list = $rows !== ''
    ? "<table><thead><tr><th>Thời điểm</th><th>Thay đổi</th><th>Người sửa</th><th></th></tr></thead><tbody>{$rows}</tbody></table>"
    : '<div class="in"><div class="error">Không đọc được danh sách phiên bản từ GitHub, vui lòng tải lại trang.</div></div>';

page('Sao lưu', <<<HTML
<header class="top"><div class="top-in">
  <a href="/admin/"><img src="/logo-tri-duc.png" alt="Trí Đức" /></a>
  <nav><a href="/admin/">← Trang quản trị</a><a href="?dang-xuat=1">Đăng xuất</a></nav>
</div></header>
<main>
  <h1>Sao lưu &amp; xuất dữ liệu</h1>
  <p class="lead">Đóng gói toàn bộ website thành một tệp .zip để cất giữ hoặc chuyển đi, như All-in-One WP Migration trên WordPress.</p>

  <section class="card">
    <h2>📦 Xuất trang web</h2>
    <div class="in export">
      <p>Tệp gồm <b>tất cả sản phẩm, bài viết, tài liệu, tuyển dụng, ảnh đã tải lên, nội dung các trang, thông tin công ty</b> và mã nguồn website, ở phiên bản mới nhất.</p>
      <a class="btn btn-big" data-download href="?tai=main">⬇ Xuất ra tệp</a>
    </div>
  </section>

  <section class="card">
    <h2>🗂️ Các bản sao lưu</h2>
    <p class="lead" style="margin:14px 20px 4px;font-size:14px">Mỗi lần bấm "Xuất bản" trong trang quản trị, hệ thống tự lưu một bản. Tải về bản bất kỳ, kể cả trước khi sửa nhầm.</p>
    {$list}
  </section>

  <section class="card">
    <h2>ℹ️ Lưu ý</h2>
    <div class="in notes">
      <div>
        <h3>Không nằm trong tệp</h3>
        <ul>
          <li>Mật khẩu quản trị, bot Telegram, khóa trợ lý AI, mật khẩu FTP (lưu riêng trong GitHub Secrets).</li>
          <li>Yêu cầu báo giá của khách (được gửi thẳng về Telegram và email).</li>
          <li>Hộp thư email trên hosting (sao lưu trong cPanel → Backup).</li>
        </ul>
      </div>
      <div>
        <h3>Khôi phục hoặc chuyển hosting</h3>
        <ul>
          <li>Giải nén tệp và đưa lên lại kho GitHub; web tự build và tải lên hosting sau 2–4 phút.</li>
          <li>Chuyển hosting: đổi thông tin FTP trong GitHub Secrets, không cần bước nhập như WordPress.</li>
        </ul>
      </div>
    </div>
  </section>
</main>

<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
  <div class="box">
    <h3 id="m-title">Đang xuất trang web…</h3>
    <p id="m-text">GitHub đang đóng gói dữ liệu, vui lòng không đóng trang.</p>
    <div class="bar" id="m-bar"><i></i></div>
    <div class="size" id="m-size"></div>
    <button class="btn btn-sm" id="m-close" type="button" hidden>Đóng</button>
  </div>
</div>

<script>
(function () {
  var modal = document.getElementById('modal'), title = document.getElementById('m-title'),
      text = document.getElementById('m-text'), bar = document.getElementById('m-bar'),
      size = document.getElementById('m-size'), close = document.getElementById('m-close'), busy = false;
  var mb = function (n) { return (n / 1048576).toFixed(1).replace('.', ',') + ' MB'; };
  close.onclick = function () { modal.classList.remove('open'); };

  function show(t, p) { title.textContent = t; text.textContent = p; }

  document.querySelectorAll('[data-download]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      // Without streaming support the plain link still downloads the file
      if (!window.fetch || !window.ReadableStream) return;
      e.preventDefault();
      if (busy) return;
      busy = true;
      close.hidden = true; bar.className = 'bar'; bar.firstChild.style.width = ''; size.textContent = '';
      show('Đang xuất trang web…', 'GitHub đang đóng gói dữ liệu, vui lòng không đóng trang.');
      modal.classList.add('open');

      fetch(link.getAttribute('href'), { credentials: 'same-origin' }).then(function (res) {
        var type = res.headers.get('Content-Type') || '';
        if (!res.ok || type.indexOf('zip') === -1) {
          return res.text().then(function (msg) { throw new Error(msg || 'Không tải được tệp.'); });
        }
        var total = +res.headers.get('Content-Length') || 0;
        var name = ((res.headers.get('Content-Disposition') || '').match(/filename="([^"]+)"/) || [])[1] || 'tri-duc-sao-luu.zip';
        if (total) bar.className = 'bar known';
        show('Đang tải về…', name);
        var reader = res.body.getReader(), chunks = [], got = 0;
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) return;
            chunks.push(r.value); got += r.value.length;
            size.textContent = total ? mb(got) + ' / ' + mb(total) : 'Đã tải ' + mb(got);
            if (total) bar.firstChild.style.width = Math.min(100, got / total * 100) + '%';
            return pump();
          });
        }
        return pump().then(function () {
          var url = URL.createObjectURL(new Blob(chunks, { type: 'application/zip' }));
          var a = document.createElement('a');
          a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
          bar.className = 'bar known'; bar.firstChild.style.width = '100%';
          show('✅ Xuất thành công!', name);
          size.textContent = mb(got);
          close.hidden = false;
        });
      }).catch(function (err) {
        bar.className = 'bar known'; bar.firstChild.style.width = '0';
        show('Không xuất được tệp', err.message);
        close.hidden = false;
      }).then(function () { busy = false; });
    });
  });
})();
</script>
HTML);
