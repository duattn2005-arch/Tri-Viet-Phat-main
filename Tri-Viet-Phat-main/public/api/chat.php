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

// ---------------------------------------------------------------------------------------------
// Site search (ai-docs.json, built from every page of the website by ai-index.ts). Keep tokenize()
// in step with tokenize() in ai-index.ts.
const STOPWORDS = ['và', 'của', 'là', 'có', 'các', 'cho', 'được', 'trong', 'với', 'những', 'một', 'này', 'để', 'khi',
    'từ', 'không', 'thì', 'đã', 'như', 'về', 'nên', 'sẽ', 'cũng', 'đến', 'bạn', 'ra', 'tại', 'theo', 'hay', 'hoặc', 'mà',
    'nhiều', 'vào', 'rất', 'bị', 'còn', 'do', 'lên', 'nhất', 'ạ', 'ơi', 'gì', 'nào', 'đó', 'đây', 'nếu', 'vì', 'trên',
    'dưới', 'sau', 'trước', 'giữa', 'cùng', 'hơn', 'chỉ', 'the', 'and', 'of', 'to', 'in', 'for', 'is', 'on'];

function tokenize(string $text): array
{
    $words = preg_split('/[^\p{L}\p{N}]+/u', mb_strtolower($text), -1, PREG_SPLIT_NO_EMPTY) ?: [];
    return array_values(array_filter($words, fn($w) => !in_array($w, STOPWORDS, true)));
}

/** Unigrams plus adjacent-word bigrams, like terms() in ai-index.ts. */
function query_terms(string $text): array
{
    $words = tokenize($text);
    $out = $words;
    for ($i = 0; $i + 1 < count($words); $i++) {
        $out[] = $words[$i] . ' ' . $words[$i + 1];
    }
    return array_values(array_unique($out));
}

/** Best-matching passages of the website for a question (BM25), at most two per page. */
function search_site(string $question, int $limit = 5): array
{
    static $index = null;
    if ($index === null) {
        $index = json_decode((string)@file_get_contents(__DIR__ . '/ai-docs.json'), true) ?: ['n' => 0];
    }
    if (empty($index['n'])) {
        return [];
    }
    $n = $index['n'];
    $avg = max(1, $index['avg']);
    $k1 = 1.2;
    $b = 0.75;
    $scores = [];
    foreach (query_terms($question) as $term) {
        $postings = $index['idx'][$term] ?? null;
        if (!$postings) continue;
        $df = count($postings) / 2;
        $idf = log(1 + ($n - $df + 0.5) / ($df + 0.5)) * (strpos($term, ' ') !== false ? 1.5 : 1.0);
        for ($j = 0; $j < count($postings); $j += 2) {
            $doc = $postings[$j];
            $tf = $postings[$j + 1];
            $norm = $tf + $k1 * (1 - $b + $b * $index['len'][$doc] / $avg);
            $scores[$doc] = ($scores[$doc] ?? 0) + $idf * $tf * ($k1 + 1) / $norm;
        }
    }
    arsort($scores);
    $picked = [];
    $perPage = [];
    foreach ($scores as $doc => $score) {
        $d = $index['docs'][$doc];
        if (($perPage[$d['u']] ?? 0) >= 2) continue;
        $perPage[$d['u']] = ($perPage[$d['u']] ?? 0) + 1;
        $picked[] = $d + ['score' => $score];
        if (count($picked) >= $limit) break;
    }
    return $picked;
}

/**
 * Whether a passage really answers the question: every content word of the question appears in it.
 * Keyword scores alone let off-topic questions ("thời tiết hôm nay") through on shared common words.
 */
function covers(array $passage, string $question): bool
{
    $chatter = ['em', 'anh', 'chị', 'mình', 'tôi', 'hỏi', 'muốn', 'biết', 'xin', 'vui', 'lòng', 'giúp', 'cần', 'tìm',
        'hiểu', 'thế', 'sao', 'ai', 'đâu', 'bao', 'nhiêu', 'khác', 'nhau', 'giải', 'thích', 'shop', 'ad', 'admin'];
    $words = array_unique(array_diff(tokenize($question), $chatter));
    if (!$words) {
        return false;
    }
    $have = array_flip(tokenize($passage['t'] . ' ' . $passage['x']));
    foreach ($words as $w) {
        if (!isset($have[$w])) {
            return false;
        }
    }
    return true;
}

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
    // A named model wins; otherwise answer the common questions before listing products by topic
    if (!$byModel) {
        $intent = intent_reply($q, $knowledge, $hotline);
        if ($intent !== null) {
            return $intent;
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
    if (preg_match('/giá|chi phí|bao nhiêu tiền|bao nhiêu triệu/u', $q)) {
        return "Để nhận báo giá chi tiết và chiết khấu tốt nhất, Quý khách vui lòng gọi **Hotline {$hotline}** hoặc để lại số điện thoại ở mục Liên hệ, kỹ sư Trí Việt Phát sẽ gọi lại ngay ạ.";
    }
    // Anything else the website covers (news, guides, documents…): quote the best passage and link the pages
    $passages = search_site($message, 4);
    if ($passages && covers($passages[0], $message)) {
        $best = $passages[0];
        $excerpt = mb_substr(preg_replace('/\s+/u', ' ', $best['x']), 0, 420);
        $links = [];
        foreach ($passages as $p) {
            $links[$p['u']] = "- [{$p['t']}]({$p['u']})";
        }
        return "Theo bài **{$best['t']}** trên website Trí Việt Phát:\n\n> {$excerpt}…\n\n**Xem thêm:**\n"
            . implode("\n", array_slice(array_values($links), 0, 3))
            . "\n\nCần tư vấn cụ thể, Quý khách gọi **Hotline {$hotline}** ạ.";
    }
    if (preg_match('/^(xin )?(chào|chao|hello|hi|alo)\b|^(xin chào|chào bạn|chào em|chào shop)/u', trim($q))) {
        return "Xin chào Quý khách! **Trí Việt Phát** phân phối chính hãng máy xét nghiệm Dirui (sinh hóa, nước tiểu, huyết học), máy điện giải, HbA1c, miễn dịch, đông máu và hóa chất xét nghiệm.\n\n"
            . "Quý khách cho biết model hoặc loại máy đang quan tâm (ví dụ: *máy sinh hóa CS-T240*, *máy nước tiểu H-500*) để được tư vấn chi tiết ạ.";
    }
    return "Dạ, câu hỏi này em chưa có thông tin chính xác để trả lời. Để được kỹ sư tư vấn đúng nhất, Quý khách vui lòng gọi **Hotline {$hotline}** hoặc để lại số điện thoại ở mục Liên hệ, bên em sẽ gọi lại ngay ạ.\n\n"
        . "Quý khách cũng có thể hỏi em về một model cụ thể (ví dụ: *CS-600B*, *BCC-3900*, *AC9803*) để xem thông số.";
}

/** "Website có 28 sản phẩm: 10 Máy xét nghiệm sinh hóa (Dirui CS-T180, …); …; theo hãng: Dirui 17, …" */
function catalogue_summary(array $knowledge): string
{
    $products = $knowledge['products'] ?? [];
    $byCategory = [];
    $byBrand = [];
    foreach ($products as $p) {
        $byCategory[$p['category'] ?? 'Khác'][] = $p['name'];
        $byBrand[$p['brand'] ?? 'Khác'] = ($byBrand[$p['brand'] ?? 'Khác'] ?? 0) + 1;
    }
    arsort($byBrand);
    $lines = ['Website đang giới thiệu tổng cộng ' . count($products) . ' sản phẩm (máy xét nghiệm, hóa chất, thiết bị phụ trợ):'];
    foreach ($byCategory as $category => $names) {
        $lines[] = '- ' . $category . ': ' . count($names) . ' (' . implode('; ', $names) . ')';
    }
    $brands = [];
    foreach ($byBrand as $brand => $n) {
        $brands[] = "{$brand} {$n}";
    }
    $lines[] = 'Theo hãng: ' . implode(', ', $brands) . '.';
    return implode("\n", $lines);
}

/** Answers to the questions visitors ask most, or null when the message is about something else. */
function intent_reply(string $q, array $knowledge, string $hotline): ?string
{
    $c = $knowledge['company'] ?? [];
    $site = rtrim($c['website'] ?? '', '/');
    $is = fn(string $pattern) => (bool)preg_match('/' . $pattern . '/u', $q);

    if ($is('bảo hành|bao hanh|bảo trì|bảo dưỡng|sửa chữa|sua chua|hỏng|lỗi máy|kỹ thuật viên|kỹ sư')) {
        return "**Bảo hành & bảo trì tại Trí Việt Phát:**\n"
            . "- Máy chính hãng được **bảo hành 12 tháng**.\n"
            . "- Kỹ sư lắp đặt tận nơi, chạy mẫu, hướng dẫn sử dụng; sau bảo hành vẫn hỗ trợ bảo trì định kỳ và sửa chữa.\n"
            . "- Cần sửa máy: gọi **Hotline {$hotline}** hoặc gửi yêu cầu tại {$site}/lien-he, kỹ sư sẽ liên hệ lại ngay.";
    }
    if ($is('địa chỉ|dia chi|ở đâu|văn phòng|trụ sở|showroom|liên hệ|lien he|số điện thoại|sđt|hotline|email|zalo')) {
        return "**Thông tin liên hệ Trí Việt Phát:**\n"
            . "- Địa chỉ: " . ($c['address'] ?? '') . "\n"
            . "- Hotline: **{$hotline}**\n"
            . "- Email: " . ($c['email'] ?? '') . "\n"
            . "- Website: {$site}";
    }
    if ($is('giao hàng|vận chuyển|ship|tỉnh|toàn quốc|lắp đặt|lap dat|cài đặt|đào tạo|hướng dẫn sử dụng')) {
        return "Trí Việt Phát **giao hàng và lắp đặt trên toàn quốc**. Kỹ sư lắp đặt tận nơi, chạy mẫu kiểm tra và hướng dẫn kỹ thuật viên sử dụng máy.\n\n"
            . "Quý khách cho biết địa điểm và model cần lắp, hoặc gọi **Hotline {$hotline}** để được sắp lịch ạ.";
    }
    if ($is('co\/cq|co cq|chính hãng|chinh hang|nguồn gốc|xuất xứ|giấy tờ|chứng nhận')) {
        return "Toàn bộ máy và hóa chất Trí Việt Phát cung cấp là **hàng chính hãng, có đầy đủ CO/CQ**. Xuất xứ của từng model ghi trong trang sản phẩm.\n\n"
            . "Quý khách cần bộ hồ sơ kỹ thuật cho model nào, vui lòng gọi **Hotline {$hotline}** ạ.";
    }
    if ($is('bao nhiêu (máy|sản phẩm|loại|dòng|model|thiết bị)|có (những|các) (máy|sản phẩm|loại|dòng)|danh sách (máy|sản phẩm)|bán (những )?(máy|sản phẩm) (gì|nào)')) {
        return catalogue_summary($knowledge) . "\n\nXem toàn bộ tại {$site}/san-pham. Quý khách quan tâm loại máy nào để em tư vấn chi tiết ạ?";
    }
    if ($is('tuyển dụng|tuyen dung|việc làm|ứng tuyển|nộp hồ sơ|cv')) {
        return "Các vị trí đang tuyển của Trí Việt Phát có tại {$site}/tuyen-dung. Quý khách có thể nộp hồ sơ trực tuyến ngay trên trang đó ạ.";
    }
    if ($is('hóa chất|hoa chat|thuốc thử|thuoc thu|que thử|vật tư')) {
        $chem = array_filter($knowledge['products'] ?? [], fn($p) => has(mb_strtolower((string)($p['category'] ?? '')), 'hóa chất'));
        $lines = array_map(fn($p) => "- **{$p['name']}** – {$p['url']}", array_slice(array_values($chem), 0, 5));
        return "Trí Việt Phát cung cấp hóa chất, thuốc thử và vật tư xét nghiệm chính hãng, sẵn kho tại Hà Nội"
            . ($lines ? ":\n" . implode("\n", $lines) : '.')
            . "\n\nQuý khách cho biết đang dùng máy nào để được tư vấn hóa chất tương thích, hoặc gọi **Hotline {$hotline}** ạ.";
    }
    return null;
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
$models = array_slice(array_values(array_filter((array)($config['models'] ?? ['gemini-flash-lite-latest', 'gemini-3.8-flash', 'gemini-2.5-flash-lite']))), 0, 3);

if ($apiKey === '') {
    reply(200, ['reply' => catalogue_reply($message, $knowledge, $hotline)]);
}

// Passages of the website that match this question (and the previous one, for follow-ups like "còn máy kia?")
$lastUser = '';
foreach (array_reverse((array)($data['history'] ?? [])) as $h) {
    if (($h['sender'] ?? '') === 'user') {
        $lastUser = (string)($h['text'] ?? '');
        break;
    }
}
$siteContext = '';
foreach (search_site($message . ' ' . mb_substr($lastUser, 0, 200), 6) as $p) {
    $siteContext .= "- [{$p['t']}]({$p['u']}): " . preg_replace('/\s+/u', ' ', $p['x']) . "\n";
}
if ($siteContext === '') {
    $siteContext = "(không có trích đoạn phù hợp)\n";
}

$catalogueSummary = catalogue_summary($knowledge);

$system = "Bạn là \"Trợ lý AI Trí Việt Phát\", tư vấn viên kỹ thuật của " . ($company['name'] ?? 'Trí Việt Phát')
    . ", nhà phân phối thiết bị và hóa chất xét nghiệm y khoa tại Hà Nội.\n\n"
    . "THÔNG TIN CÔNG TY (chỉ dùng đúng các thông tin này):\n" . json_encode($company, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n\n"
    . "TỔNG QUAN DANH MỤC (dùng để trả lời các câu hỏi đếm, liệt kê):\n" . $catalogueSummary . "\n\n"
    . "DANH MỤC SẢN PHẨM ĐANG BÁN (nguồn sự thật duy nhất về sản phẩm, hãng và thông số):\n"
    . json_encode($knowledge['products'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n\n"
    . "THƯƠNG HIỆU:\n" . json_encode($knowledge['brands'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n\n"
    . "CHÍNH SÁCH ĐANG GHI TRÊN WEBSITE: hàng chính hãng có CO/CQ; bảo hành 12 tháng; giao hàng, lắp đặt, hướng dẫn sử dụng trên toàn quốc; bảo trì định kỳ và cung cấp hóa chất, vật tư.\n\n"
    . "TRÍCH ĐOẠN TỪ WEBSITE LIÊN QUAN ĐẾN CÂU HỎI (bài viết, tài liệu, hướng dẫn, tuyển dụng…):\n" . $siteContext . "\n\n"
    . "KỊCH BẢN TƯ VẤN:\n"
    . "0. Câu hỏi dữ kiện (có bao nhiêu, những loại nào, hãng nào, model nào, địa chỉ…): TRẢ LỜI THẲNG con số / danh sách ngay câu đầu, dựa trên TỔNG QUAN DANH MỤC, rồi mới gợi ý thêm.\n"
    . "1. Xưng \"em\", gọi khách là \"Quý khách\" hoặc \"anh/chị\". Mở đầu ngắn gọn, đi thẳng vào câu hỏi.\n"
    . "2. Khách hỏi chung chung (\"nên mua máy nào\", \"tư vấn máy xét nghiệm\"): hỏi lại 1–2 câu để hiểu nhu cầu — loại cơ sở (phòng khám, bệnh viện, trung tâm xét nghiệm), khoảng bao nhiêu mẫu mỗi ngày, cần làm xét nghiệm gì — rồi mới gợi ý.\n"
    . "3. Khi gợi ý: chọn 1–3 model PHÙ HỢP trong danh mục, nêu lý do bằng thông số có thật (công suất, số thông số, v.v.), kèm link [tên máy](url).\n"
    . "4. Khách hỏi về một model cụ thể: tóm tắt thông số chính của đúng model đó, kèm link.\n"
    . "5. Khách hỏi kiến thức (ý nghĩa một xét nghiệm, cách chạy QC, bảo quản hóa chất, quy định…): trả lời đầy đủ bằng kiến thức chuyên môn (mục B), ưu tiên dẫn bài viết của website nếu có.\n"
    . "6. Khách hỏi giá, muốn mua, muốn nhận báo giá hoặc catalogue: không nêu giá; mời để lại số điện thoại/tên cơ sở ngay trong khung chat hoặc gọi Hotline {$hotline} để kỹ sư gửi báo giá.\n"
    . "7. Khách hỏi bảo hành, lắp đặt, giao hàng, CO/CQ: trả lời theo CHÍNH SÁCH ĐANG GHI TRÊN WEBSITE.\n"
    . "8. Câu hỏi ngoài lĩnh vực thiết bị, hóa chất xét nghiệm và công ty: lịch sự từ chối và quay lại chủ đề.\n"
    . "9. Kết thúc câu trả lời tư vấn bằng một câu mời hành động ngắn (để lại số điện thoại, gọi hotline, hoặc xem trang sản phẩm).\n\n"
    . "HAI LOẠI KIẾN THỨC:\n"
    . "A. THÔNG TIN RIÊNG CỦA TRÍ VIỆT PHÁT (sản phẩm đang bán, model, thông số, hãng, xuất xứ, giá, tồn kho, chính sách bảo hành/giao hàng, thông tin liên hệ): CHỈ dùng dữ liệu ở trên. Không có trong dữ liệu thì nói cần kỹ sư xác nhận và mời gọi hotline; TUYỆT ĐỐI không bịa thông số, giá, chứng nhận hay chính sách.\n"
    . "B. KIẾN THỨC CHUYÊN MÔN CHUNG (ý nghĩa các xét nghiệm, chỉ số và khoảng tham chiếu thường dùng, bệnh học, nguyên lý các loại máy xét nghiệm, nội kiểm/ngoại kiểm QC, hiệu chuẩn, ISO 15189, vận hành phòng xét nghiệm, bảo quản mẫu và hóa chất, an toàn sinh học, quy định ngành y tế Việt Nam…): được dùng hiểu biết chuyên môn của bạn và tìm kiếm Google để trả lời đầy đủ, chính xác như một kỹ sư/chuyên viên xét nghiệm giàu kinh nghiệm. Nếu website có bài liên quan (trích đoạn ở trên) thì ưu tiên và kèm link bài.\n\n"
    . "QUY TẮC:\n"
    . "- Trả lời bằng tiếng Việt, lịch sự, chuyên nghiệp; câu hỏi đơn giản trả lời ngắn (khoảng 100–150 từ), câu hỏi chuyên môn có thể dài hơn (tối đa khoảng 300 từ), trình bày có ý rõ ràng.\n"
    . "- Khi dùng một trích đoạn website, kèm link bài đó dạng [tên bài](url). Khi nói về một sản phẩm đang bán, kèm link sản phẩm.\n"
    . "- Khi tìm kiếm Google: KHÔNG nêu tên, website hay giá của các công ty/cửa hàng bán thiết bị y tế khác; khi khách cần mua, luôn hướng về sản phẩm và hotline của Trí Việt Phát.\n"
    . "- Không báo giá cụ thể. Khi khách hỏi giá hoặc muốn mua, mời để lại số điện thoại hoặc gọi Hotline {$hotline}.\n"
    . "- Với câu hỏi về kết quả xét nghiệm hay bệnh của một người cụ thể: được giải thích ý nghĩa chung của chỉ số, nhưng không chẩn đoán, không kê thuốc và luôn khuyên trao đổi với bác sĩ.\n"
    . "- Chỉ từ chối các câu hỏi hoàn toàn ngoài lĩnh vực y tế, xét nghiệm và thiết bị (thể thao, giải trí…).\n"
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

$request = [
    'systemInstruction' => ['parts' => [['text' => $system]]],
    'contents' => $contents,
    'generationConfig' => ['temperature' => 0.4, 'maxOutputTokens' => 2048],
];
@set_time_limit(45);

// With 'google_search' => true in ai-config.php the main model first answers with Google Search grounding
// (current knowledge beyond the website). The free Gemini tier has no grounding quota (HTTP 429), so it is
// off by default. Whatever fails, every model is then tried once without search.
$attempts = [];
if (!empty($config['google_search'])) {
    $attempts[] = [$models[0], true, 12];
}
foreach ($models as $model) {
    $attempts[] = [$model, false, 8];
}

foreach ($attempts as [$model, $search, $timeout]) {
    $body = $request + ($search ? ['tools' => [['google_search' => (object)[]]]] : []);
    $ch = curl_init('https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'x-goog-api-key: ' . $apiKey],
    ]);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($res === false || $code !== 200) {
        // Overloaded (503), rate-limited (429) or unknown model: note it in the host's error_log, try the next one
        error_log('chat.php: ' . $model . ($search ? ' +search' : '') . ' -> HTTP ' . $code . ' ' . substr((string)$res, 0, 200));
        continue;
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
