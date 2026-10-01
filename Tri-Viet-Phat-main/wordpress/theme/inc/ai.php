<?php
/**
 * What the AI chat knows (api/chat.php): the catalogue and company details (td_ai_knowledge) and every
 * page of the website split into passages with a BM25 keyword index (td_ai_docs). A PHP copy of the
 * project's seo-plugin.ts / ai-index.ts, built from the WordPress content and cached until it changes.
 * tokenize() must stay in step with tokenize() in api/chat.php.
 */

defined('ABSPATH') || exit;

function td_ai_knowledge(): array
{
    $c = td_company();
    $labels = td_category_labels('san-pham');
    $products = [];
    foreach (td_products() as $p) {
        $brand = td_brand_of($p['brand'] ?? '');
        $products[] = [
            'name' => td_product_title($p),
            'brand' => $brand ? $brand['name'] : ($p['brand'] ?? ''),
            'category' => $labels[$p['category']] ?? '',
            'origin' => $p['origin'] ?? '',
            'url' => home_url(td_route_path(['tab' => 'san-pham', 'productId' => $p['id']])),
            'summary' => $p['shortDesc'] ?? '',
            'specs' => array_map(function ($s) {
                return ($s['label'] ?? '') . ': ' . ($s['value'] ?? '');
            }, array_slice($p['specs'] ?? [], 0, 15)),
        ];
    }
    $brands = array_map(function ($b) {
        return ['name' => $b['name'], 'page' => home_url('/thuong-hieu/' . $b['slug']), 'about' => $b['intro']];
    }, td_brands());
    return [
        'company' => array_filter([
            'name' => $c['name'] ?? '',
            'hotline' => $c['hotline'] ?? '',
            'hotline2' => $c['hotline2'] ?? '',
            'email' => $c['email'] ?? '',
            'address' => $c['address'] ?? '',
            'website' => untrailingslashit(home_url()),
        ]),
        'products' => $products,
        'brands' => $brands,
    ];
}

const TD_AI_STOPWORDS = ['và', 'của', 'là', 'có', 'các', 'cho', 'được', 'trong', 'với', 'những', 'một', 'này', 'để', 'khi',
    'từ', 'không', 'thì', 'đã', 'như', 'về', 'nên', 'sẽ', 'cũng', 'đến', 'bạn', 'ra', 'tại', 'theo', 'hay', 'hoặc', 'mà',
    'nhiều', 'vào', 'rất', 'bị', 'còn', 'do', 'lên', 'nhất', 'ạ', 'ơi', 'gì', 'nào', 'đó', 'đây', 'nếu', 'vì', 'trên',
    'dưới', 'sau', 'trước', 'giữa', 'cùng', 'hơn', 'chỉ', 'the', 'and', 'of', 'to', 'in', 'for', 'is', 'on'];

function td_ai_terms(string $text): array
{
    if (class_exists('Normalizer')) {
        $text = (string) Normalizer::normalize($text, Normalizer::FORM_C);
    }
    $stop = array_flip(TD_AI_STOPWORDS);
    $words = array_values(array_filter(
        preg_split('/[^\p{L}\p{N}]+/u', mb_strtolower($text), -1, PREG_SPLIT_NO_EMPTY) ?: [],
        function ($w) use ($stop) {
            return !isset($stop[$w]);
        }
    ));
    $out = $words;
    for ($i = 0; $i + 1 < count($words); $i++) {
        $out[] = $words[$i] . ' ' . $words[$i + 1];
    }
    return $out;
}

function td_ai_text(string $html): string
{
    $html = preg_replace('~<(script|style)[\s\S]*?</\1>~i', ' ', $html);
    $html = preg_replace('~</(p|h[1-6]|li|tr|div)>~i', "\n", $html);
    $text = html_entity_decode(strip_tags(strip_shortcodes($html)), ENT_QUOTES, 'UTF-8');
    $text = preg_replace('/[ \t\x{00A0}]+/u', ' ', $text);
    return trim(preg_replace('/\n\s*\n+/u', "\n", $text));
}

/** ~900-character passages on paragraph/sentence boundaries. */
function td_ai_split(string $text, int $size = 900): array
{
    $parts = [];
    foreach (preg_split('/\n+/u', $text) as $p) {
        if (mb_strlen($p) > $size) {
            array_push($parts, ...preg_split('/(?<=[.!?])\s+/u', $p));
        } else {
            $parts[] = $p;
        }
    }
    $chunks = [];
    $cur = '';
    foreach ($parts as $p) {
        if ($cur !== '' && mb_strlen($cur) + mb_strlen($p) + 1 > $size) {
            $chunks[] = trim($cur);
            $cur = '';
        }
        $cur .= ($cur !== '' ? "\n" : '') . $p;
    }
    if (trim($cur) !== '') {
        $chunks[] = trim($cur);
    }
    return $chunks;
}

function td_ai_build_index(array $pages): array
{
    $docs = [];
    foreach ($pages as $page) {
        foreach (td_ai_split($page['text']) as $chunk) {
            if (mb_strlen($chunk) >= 40) {
                $docs[] = ['t' => $page['title'], 'u' => $page['url'], 'x' => $chunk];
            }
        }
    }
    $lens = [];
    $postings = [];
    foreach ($docs as $i => $d) {
        $all = td_ai_terms($d['t'] . ' ' . $d['t'] . ' ' . $d['x']);
        $lens[] = count($all);
        foreach (array_count_values($all) as $term => $tf) {
            $postings[(string) $term][] = $i;
            $postings[(string) $term][] = $tf;
        }
    }
    $idx = [];
    $n = count($docs);
    foreach ($postings as $term => $list) {
        $df = count($list) / 2;
        if ($df > $n * 0.4 || (strpos($term, ' ') !== false && $df < 2)) {
            continue;
        }
        $idx[$term] = $list;
    }
    return ['n' => $n, 'avg' => (int) round(array_sum($lens) / max(1, count($lens))), 'len' => $lens, 'docs' => $docs, 'idx' => $idx];
}

/** Every page of the website as text, like the pages list in seo-plugin.ts. */
function td_ai_pages(): array
{
    $c = td_company();
    $abs = function (array $route) {
        return home_url(td_route_path($route));
    };
    $qa = function (array $faq) {
        return implode("\n", array_map(function ($f) {
            return $f['q'] . "\n" . $f['a'];
        }, $faq));
    };
    $about = td_content('about');
    $pages = [[
        'title' => 'Giới thiệu ' . ($c['name'] ?? ''),
        'url' => $abs(['tab' => 'gioi-thieu']),
        'text' => implode("\n", array_merge([
            ($c['name'] ?? '') . ', giấy phép kinh doanh số ' . ($c['licenseNo'] ?? '') . ' do ' . ($c['licensedBy'] ?? '') . ' cấp, hơn ' . ($c['yearsOfExperience'] ?? '') . ' năm kinh nghiệm phân phối thiết bị và hóa chất xét nghiệm.',
            'Địa chỉ: ' . ($c['address'] ?? '') . '. Hotline: ' . ($c['hotline'] ?? '') . '. Email: ' . ($c['email'] ?? '') . '.',
        ], array_map(function ($a) {
            return $a['title'] . ': ' . $a['desc'];
        }, $about['businessAreas'] ?? []))),
    ]];
    foreach (td_products() as $p) {
        $pages[] = [
            'title' => td_product_title($p),
            'url' => $abs(['tab' => 'san-pham', 'productId' => $p['id']]),
            'text' => implode("\n", array_filter(array_merge(
                [$p['shortDesc'] ?? '', $p['fullDesc'] ?? ''],
                array_map(function ($s) {
                    return ($s['label'] ?? '') . ': ' . ($s['value'] ?? '');
                }, $p['specs'] ?? []),
                $p['features'] ?? [],
                [($p['origin'] ?? '') !== '' ? 'Xuất xứ: ' . $p['origin'] : '']
            ))),
        ];
    }
    foreach (td_site()['guides'] ?? [] as $cat => $guide) {
        $pages[] = [
            'title' => $guide['heading'],
            'url' => $cat === 'all' ? $abs(['tab' => 'san-pham']) : $abs(['tab' => 'san-pham', 'cat' => $cat]),
            'text' => implode("\n", array_merge($guide['intro'], [$qa(td_guide_faq_for($cat))])),
        ];
    }
    foreach (td_brands() as $b) {
        $items = td_brand_products($b);
        $pages[] = [
            'title' => $b['heading'],
            'url' => $abs(['tab' => 'san-pham', 'brand' => $b['slug']]),
            'text' => $b['intro'] . "\n" . $qa(td_brand_faq_for($b, $items)),
        ];
    }
    foreach (td_query('post') as $post) {
        $pages[] = ['title' => $post->post_title, 'url' => $abs(['tab' => 'tin-tuc', 'articleId' => $post->post_name]), 'text' => td_ai_text($post->post_content)];
    }
    foreach (td_query('td_document') as $post) {
        $pages[] = ['title' => $post->post_title, 'url' => $abs(['tab' => 'tai-lieu']), 'text' => td_ai_text($post->post_content)];
    }
    foreach (td_query('td_job') as $post) {
        $location = (string) td_meta($post, 'location');
        $quantity = (string) td_meta($post, 'quantity');
        $pages[] = [
            'title' => 'Tuyển dụng: ' . $post->post_title,
            'url' => $abs(['tab' => 'tuyen-dung']),
            'text' => implode("\n", array_filter([
                $location !== '' ? 'Nơi làm việc: ' . $location : '',
                $quantity !== '' ? 'Số lượng: ' . $quantity : '',
                td_ai_text($post->post_content),
            ])),
        ];
    }
    return $pages;
}

/** The passage index, cached in wp-content/uploads/tri-duc-cache until the content changes. */
function td_ai_docs(): array
{
    $version = td_data_version();
    $dir = wp_upload_dir(null, false)['basedir'] . '/tri-duc-cache';
    $file = $dir . '/ai-docs-' . md5($version . home_url()) . '.json';
    if (is_file($file)) {
        $index = json_decode((string) file_get_contents($file), true);
        if (is_array($index)) {
            return $index;
        }
    }
    @set_time_limit(60);
    $index = td_ai_build_index(td_ai_pages());
    if (wp_mkdir_p($dir)) {
        if (!is_file($dir . '/index.html')) {
            @file_put_contents($dir . '/index.html', '');
        }
        foreach (glob($dir . '/ai-docs-*.json') ?: [] as $old) {
            @unlink($old);
        }
        @file_put_contents($file, wp_json_encode($index, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }
    return $index;
}
