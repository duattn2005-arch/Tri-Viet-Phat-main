<?php
/**
 * Nhận yêu cầu từ các form trên website và gửi về Telegram.
 *
 * Chạy trên hosting PHP (cPanel/DirectAdmin...). Bot token và chat ID đặt trong
 * telegram-config.php cùng thư mục (copy từ telegram-config.example.php) —
 * file đó không được commit lên git.
 */

date_default_timezone_set('Asia/Ho_Chi_Minh');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function reply(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply(405, ['error' => 'Phương thức không được hỗ trợ.']);
}

$configFile = __DIR__ . '/telegram-config.php';
if (!is_file($configFile)) {
    reply(503, ['error' => 'Hệ thống nhận yêu cầu chưa được cấu hình. Vui lòng gọi hotline để được hỗ trợ.']);
}
$config = require $configFile;
$botToken = trim((string)($config['bot_token'] ?? ''));
$chatIds = array_filter(array_map('trim', (array)($config['chat_ids'] ?? [])));
if ($botToken === '' || !$chatIds) {
    reply(503, ['error' => 'Hệ thống nhận yêu cầu chưa được cấu hình. Vui lòng gọi hotline để được hỗ trợ.']);
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$data = json_decode((string)$raw, true);
if (!is_array($data)) {
    reply(400, ['error' => 'Dữ liệu không hợp lệ.']);
}

// Honeypot: bots fill every input, people never see this one
if (!empty($data['website'])) {
    reply(200, ['ok' => true]);
}

$titles = [
    'lien-he' => '📩 LIÊN HỆ MỚI',
    'tu-van' => '💬 YÊU CẦU TƯ VẤN / BÁO GIÁ',
    'bao-gia' => '🧾 ĐĂNG KÝ HỢP TÁC / BÁO GIÁ',
    'sua-chua' => '🛠 YÊU CẦU BẢO TRÌ / SỬA CHỮA',
    'san-pham' => '🛒 BÁO GIÁ SẢN PHẨM',
    'ung-tuyen' => '👔 HỒ SƠ ỨNG TUYỂN',
    'dang-ky-tin' => '📰 ĐĂNG KÝ NHẬN TIN',
];
$kind = (string)($data['kind'] ?? '');
if (!isset($titles[$kind])) {
    reply(400, ['error' => 'Loại yêu cầu không hợp lệ.']);
}

$fields = $data['fields'] ?? null;
if (!is_array($fields) || count($fields) > 20) {
    reply(400, ['error' => 'Dữ liệu không hợp lệ.']);
}

$phone = '';
$contact = '';
$lines = [];
foreach ($fields as $field) {
    if (!is_array($field)) continue;
    $label = mb_substr(trim((string)($field['label'] ?? '')), 0, 60);
    $value = mb_substr(trim((string)($field['value'] ?? '')), 0, 2000);
    if ($label === '' || $value === '') continue;
    if ($label === 'Số điện thoại') $phone = $value;
    if ($label === 'Email' || $label === 'Email / SĐT') $contact = $value;
    $lines[] = '<b>' . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . ':</b> '
        . htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

// Every form needs a way to call back: a valid phone, or an email / phone in the newsletter box
$validPhone = (bool)preg_match('/^[0-9 +().-]{8,20}$/', $phone);
if (($phone !== '' && !$validPhone) || ($phone === '' && $contact === '')) {
    reply(400, ['error' => 'Vui lòng nhập số điện thoại hoặc email hợp lệ.']);
}

// Basic rate limit: at most 5 requests per IP per 10 minutes
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/tvp-lead-' . md5($ip);
$now = time();
$hits = array_filter(
    is_file($rateFile) ? (array)json_decode((string)file_get_contents($rateFile), true) : [],
    fn($t) => is_int($t) && $t > $now - 600
);
if (count($hits) >= 5) {
    reply(429, ['error' => 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút hoặc gọi hotline.']);
}
$hits[] = $now;
@file_put_contents($rateFile, json_encode(array_values($hits)));

$page = mb_substr(trim((string)($data['page'] ?? '')), 0, 300);
$text = '<b>' . $titles[$kind] . "</b>\n\n" . implode("\n", $lines)
    . "\n\n🕒 " . date('H:i d/m/Y')
    . ($page !== '' ? "\n🔗 " . htmlspecialchars($page, ENT_QUOTES, 'UTF-8') : '');

function sendTelegram(string $token, string $chatId, string $text): bool
{
    $payload = http_build_query([
        'chat_id' => $chatId,
        'text' => $text,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => 'true',
    ]);
    $url = 'https://api.telegram.org/bot' . $token . '/sendMessage';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
        ]);
        $res = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $res !== false && $code === 200;
    }

    $ctx = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => $payload,
        'timeout' => 10,
    ]]);
    return @file_get_contents($url, false, $ctx) !== false;
}

$sent = false;
foreach ($chatIds as $chatId) {
    $sent = sendTelegram($botToken, (string)$chatId, $text) || $sent;
}

if (!$sent) {
    reply(502, ['error' => 'Không gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline.']);
}
reply(200, ['ok' => true]);
