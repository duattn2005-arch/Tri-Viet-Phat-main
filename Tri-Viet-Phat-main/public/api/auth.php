<?php
/**
 * Login popup for the Decap CMS admin (/admin), username + password.
 *
 * On a correct login it hands Decap the GitHub token from cms-config.php (a fine-grained personal access
 * token limited to this repository, "Contents: Read and write"), so editors never need a GitHub account.
 * cms-config.php is written by the deploy workflow from GitHub secrets and is not in git
 * (see cms-config.example.php).
 */

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function page(string $body, int $status = 200): void
{
    http_response_code($status);
    echo <<<HTML
<!doctype html><html lang="vi"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex" />
<title>Đăng nhập quản trị</title>
<style>
  body { font-family: system-ui, sans-serif; background: #f3f7fb; color: #111; margin: 0;
         display: flex; min-height: 100vh; align-items: center; justify-content: center; padding: 16px; }
  form { background: #fff; border: 1px solid #e3ebf3; border-radius: 12px; padding: 28px; width: 100%; max-width: 340px;
         box-shadow: 0 8px 24px rgba(10,37,64,.08); }
  h1 { font-size: 18px; margin: 0 0 4px; } p { font-size: 13px; color: #555; margin: 0 0 18px; }
  input { width: 100%; box-sizing: border-box; padding: 11px 12px; font-size: 15px; border: 1px solid #cfd8e3;
          border-radius: 8px; margin-bottom: 12px; }
  button { width: 100%; padding: 11px; font-size: 15px; font-weight: 600; color: #fff; background: #0a2540;
           border: 0; border-radius: 8px; cursor: pointer; }
  .error { color: #b91c1c; font-size: 13px; margin: -4px 0 12px; }
</style></head><body>{$body}</body></html>
HTML;
    exit;
}

function form(string $error = ''): void
{
    $err = $error !== '' ? '<div class="error">' . htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '</div>' : '';
    page(<<<HTML
<form method="post" action="/api/auth.php">
  <h1>Quản trị nội dung</h1>
  <p>Trí Việt Phát — đăng nhập để chỉnh sửa nội dung website.</p>
  <input type="text" name="username" placeholder="Tên đăng nhập" autocomplete="username" autofocus required />
  <input type="password" name="password" placeholder="Mật khẩu" autocomplete="current-password" required />
  {$err}
  <button type="submit">Đăng nhập</button>
</form>
HTML);
}

$configFile = __DIR__ . '/cms-config.php';
$config = is_file($configFile) ? require $configFile : [];
$user = trim((string)($config['admin_username'] ?? ''));
$pass = (string)($config['admin_password'] ?? '');
$token = trim((string)($config['github_token'] ?? ''));
if ($user === '' || $pass === '' || $token === '') {
    page('<p style="text-align:center">Chưa cấu hình đăng nhập quản trị (thiếu cms-config.php).</p>', 500);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    form();
}

// Basic brute-force guard: at most 10 failed attempts per IP per 15 minutes
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lockFile = sys_get_temp_dir() . '/tvp-cms-login-' . md5($ip);
$now = time();
$fails = array_filter(
    is_file($lockFile) ? (array)json_decode((string)file_get_contents($lockFile), true) : [],
    fn($t) => is_int($t) && $t > $now - 900
);
if (count($fails) >= 10) {
    form('Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.');
}

$givenUser = mb_strtolower(trim((string)($_POST['username'] ?? '')));
$givenPass = (string)($_POST['password'] ?? '');
// Compare hashes so both checks take the same time whatever the input
$userOk = hash_equals(hash('sha256', mb_strtolower($user)), hash('sha256', $givenUser));
$passOk = hash_equals(hash('sha256', $pass), hash('sha256', $givenPass));

if (!$userOk || !$passOk) {
    $fails[] = $now;
    @file_put_contents($lockFile, json_encode(array_values($fails)));
    usleep(1500000);
    form('Sai tên đăng nhập hoặc mật khẩu.');
}
@unlink($lockFile);

// Hand the token to the admin window with the postMessage handshake Decap's GitHub backend expects
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https' ? 'https' : 'http';
$origin = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? '');
$message = 'authorization:github:success:' . json_encode(['provider' => 'github', 'token' => $token]);
$js = json_encode($message, JSON_HEX_TAG | JSON_HEX_AMP | JSON_UNESCAPED_SLASHES);
$jsOrigin = json_encode($origin, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
page(<<<HTML
<p style="text-align:center">Đăng nhập thành công, đang quay lại trang quản trị…</p><script>
  (function () {
    var message = {$js};
    var origin = {$jsOrigin};
    function receive(e) {
      if (e.origin !== origin) return;
      window.removeEventListener('message', receive);
      window.opener.postMessage(message, origin);
    }
    window.addEventListener('message', receive);
    window.opener.postMessage('authorizing:github', origin);
  })();
</script>
HTML);
