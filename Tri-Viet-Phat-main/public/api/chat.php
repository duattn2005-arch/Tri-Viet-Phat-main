<?php
/**
 * AI chat for the website (the chat bubble), answered by Google Gemini.
 *
 * The assistant only knows what ai-knowledge.json holds: the product catalogue and company details,
 * regenerated from the CMS content on every build. The API key lives in ai-config.php (not in git,
 * see ai-config.example.php). Without a key, or when Gemini fails, the reply is looked up in the
 * catalogue directly, so visitors always get a useful answer.
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

$data = json_decode((string)file_get_contents('php://input', false, null, 0, 20000), true);
$message = trim((string)($data['message'] ?? ''));
if ($message === '' || mb_strlen($message) > 1000) {
    reply(400, ['error' => 'Nội dung tin nhắn không hợp lệ.']);
}

$knowledge = json_decode((string)@file_get_contents(__DIR__ . '/ai-knowledge.json'), true) ?: ['company' => [], 'products' => [], 'brands' => []];
$company = $knowledge['company'] ?? [];
$hotline = $company['hotline'] ?? '';

// Rate limit per IP: 20 messages per 10 minutes keeps the Gemini quota safe
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/tvp-chat-' . md5($ip);
$now = time();
$hits = array_filter(
    is_file($rateFile) ? (array)json_decode((string)file_get_contents($rateFile), true) : [],
    fn($t) => is_int($t) && $t > $now - 600
);
if (count($hits) >= 20) {
    reply(200, ['reply' => "Quý khách đã gửi nhiều câu hỏi liên tiếp. Để được tư vấn nhanh nhất, vui lòng gọi **Hotline {$hotline}** hoặc để lại số điện thoại ở mục Liên hệ ạ."]);
}
$hits[] = $now;
@file_put_contents($rateFile, json_encode(array_values($hits)));

/** True when $needle is non-empty and occurs in $haystack (works on PHP 7.4 too). */
function has(string $haystack, string $needle): bool
{
    return $needle !== '' && mb_strpos($haystack, $needle) !== false;
}

/** Catalogue-based answer used when the AI is not configured or does not respond. */
function catalogue_reply(string $message, array $knowledge, string $hotline): string
{
    $q = mb_strtolower($message);
    // Join model codes however they are typed ("cs-t240", "cs t240" → "cst240"), keep word breaks elsewhere
    $qPlain = preg_replace('/([a-z]{1,5})[\s-]+(?=[a-z]?\d)/u', '$1', $q);
    // A model code the customer typed (cs-t240, h-500, ac9803…) beats a brand or category match
    $byModel = [];
    $byTopic = [];
    foreach ($knowledge['products'] ?? [] as $p) {
        $name = mb_strtolower($p['name']);
        preg_match_all('/[a-z]{1,5}[\s-]?[a-z]?\d{2,5}[a-z]?/u', $name, $codes);
        foreach ($codes[0] as $code) {
            $plain = str_replace([' ', '-'], '', $code);
            // whole code only: "cs-t240" must not match "cs-t2400"
            if ($plain !== '' && preg_match('/(^|[^a-z0-9])' . preg_quote($plain, '/') . '($|[^a-z0-9])/u', $qPlain)) {
                $byModel[] = $p;
                continue 2;
            }
        }
        if (has($q, mb_strtolower((string)($p['brand'] ?? ''))) || has($q, mb_strtolower((string)($p['category'] ?? '')))) {
            $byTopic[] = $p;
        }
    }
    $matches = $byModel ?: $byTopic;

    if (count($matches) === 1) {
        $p = $matches[0];
        $specs = array_slice($p['specs'] ?? [], 0, 8);
        return "**{$p['name']}** ({$p['brand']}" . (!empty($p['origin']) ? ", {$p['origin']}" : '') . ")\n"
            . ($p['summary'] ?? '') . "\n\n"
            . ($specs ? "**Thông số chính:**\n- " . implode("\n- ", $specs) . "\n\n" : '')
            . "Xem chi tiết: {$p['url']}\nNhận báo giá: gọi **Hotline {$hotline}**.";
    }
    if (count($matches) > 1) {
        $lines = array_map(fn($p) => "- **{$p['name']}** – {$p['url']}", array_slice($matches, 0, 8));
        return "Trí Việt Phát đang phân phối các sản phẩm phù hợp:\n" . implode("\n", $lines)
            . "\n\nQuý khách cần tư vấn model nào, vui lòng gọi **Hotline {$hotline}** ạ.";
    }
    if (preg_match('/giá|báo giá|bao nhiêu|chi phí/u', $q)) {
        return "Để nhận báo giá chi tiết và chiết khấu tốt nhất, Quý khách vui lòng gọi **Hotline {$hotline}** hoặc để lại số điện thoại ở mục Liên hệ, kỹ sư Trí Việt Phát sẽ gọi lại ngay ạ.";
    }
    $c = $knowledge['company'] ?? [];
    return "Xin chào Quý khách! **Trí Việt Phát** phân phối chính hãng máy xét nghiệm Dirui (sinh hóa, nước tiểu, huyết học), máy điện giải, HbA1c, miễn dịch, đông máu và hóa chất xét nghiệm.\n"
        . "- Hotline: **{$hotline}**\n- Email: " . ($c['email'] ?? '') . "\n- Địa chỉ: " . ($c['address'] ?? '')
        . "\n\nQuý khách cho biết model hoặc loại máy đang quan tâm để được tư vấn chi tiết ạ.";
}

/** Gemini sometimes writes ions in LaTeX ($Na^+$); show them as plain Unicode. */
function clean_reply(string $text): string
{
    $map = ['^{++}' => '²⁺', '^{2+}' => '²⁺', '^{+}' => '⁺', '^{-}' => '⁻', '^+' => '⁺', '^-' => '⁻', '^2' => '²', '^3' => '³'];
    return preg_replace_callback('/\$([^$\n]{1,40})\$/u', fn($m) => str_replace(['{', '}'], '', strtr($m[1], $map)), $text);
}

$configFile = __DIR__ . '/ai-config.php';
$config = is_file($configFile) ? require $configFile : [];
$apiKey = trim((string)($config['gemini_api_key'] ?? ''));
$models = array_values(array_filter((array)($config['models'] ?? ['gemini-flash-latest', 'gemini-flash-lite-latest'])));

if ($apiKey === '') {
    reply(200, ['reply' => catalogue_reply($message, $knowledge, $hotline)]);
}

$system = "Bạn là \"Trợ lý AI Trí Việt Phát\", tư vấn viên kỹ thuật của " . ($company['name'] ?? 'Trí Việt Phát')
    . ", nhà phân phối thiết bị và hóa chất xét nghiệm y khoa tại Hà Nội.\n\n"
    . "THÔNG TIN CÔNG TY (chỉ dùng đúng các thông tin này):\n" . json_encode($company, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n\n"
    . "DANH MỤC SẢN PHẨM ĐANG BÁN (nguồn sự thật duy nhất về sản phẩm, hãng và thông số):\n"
    . json_encode($knowledge['products'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n\n"
    . "THƯƠNG HIỆU:\n" . json_encode($knowledge['brands'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n\n"
    . "QUY TẮC:\n"
    . "- Trả lời bằng tiếng Việt, lịch sự, ngắn gọn (tối đa khoảng 150 từ), chuyên nghiệp.\n"
    . "- Chỉ nêu thông số, hãng, xuất xứ có trong danh mục trên. Nếu không có dữ liệu, nói rõ là cần kỹ sư xác nhận và mời gọi hotline; TUYỆT ĐỐI không bịa số liệu, giá, chứng nhận hay thời gian bảo hành.\n"
    . "- Không báo giá cụ thể. Khi khách hỏi giá hoặc muốn mua, mời gọi Hotline {$hotline} hoặc để lại số điện thoại.\n"
    . "- Khi nói về một sản phẩm, kèm đường link (url) của sản phẩm đó.\n"
    . "- Không tư vấn chẩn đoán hay điều trị bệnh cho cá nhân; chỉ giải thích chung về xét nghiệm và thiết bị.\n"
    . "- Định dạng: in đậm bằng **...**, liệt kê bằng dòng bắt đầu '- '. Không dùng LaTeX hay ký hiệu \$; viết ion dạng Na⁺, K⁺, Cl⁻, Ca²⁺.";

// Recent turns as Gemini contents (it expects the conversation to start with the user)
$contents = [];
foreach (array_slice((array)($data['history'] ?? []), -8) as $h) {
    $text = trim(mb_substr((string)($h['text'] ?? ''), 0, 1500));
    if ($text === '') continue;
    $role = ($h['sender'] ?? '') === 'user' ? 'user' : 'model';
    if (!$contents && $role === 'model') continue;
    $contents[] = ['role' => $role, 'parts' => [['text' => $text]]];
}
$contents[] = ['role' => 'user', 'parts' => [['text' => $message]]];

$payload = json_encode([
    'systemInstruction' => ['parts' => [['text' => $system]]],
    'contents' => $contents,
    'generationConfig' => ['temperature' => 0.4, 'maxOutputTokens' => 700],
], JSON_UNESCAPED_UNICODE);

foreach ($models as $model) {
    $ch = curl_init('https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'x-goog-api-key: ' . $apiKey],
    ]);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($res === false || $code !== 200) {
        continue; // overloaded, rate-limited or unknown model: try the next one
    }
    $out = json_decode($res, true);
    $text = '';
    foreach ($out['candidates'][0]['content']['parts'] ?? [] as $part) {
        $text .= $part['text'] ?? '';
    }
    if (trim($text) !== '') {
        reply(200, ['reply' => clean_reply(trim($text))]);
    }
}

reply(200, ['reply' => catalogue_reply($message, $knowledge, $hotline)]);
