<?php
/**
 * Addresses and SEO of the app's pages. A PHP copy of the project's src/seo/routes.ts (routePath, parseRoute,
 * seoFor), src/seo/head.ts (the <head> tags), src/seo/brands.ts and the plain-HTML page copy of
 * seo-plugin.ts, so each address answers with its own title, description, structured data and readable
 * content before the app starts. Keep the two in step.
 */

defined('ABSPATH') || exit;

function td_tab_paths(): array
{
    return td_site()['tabPaths'] ?? ['trang-chu' => '/'];
}

function td_category_labels(string $tab): array
{
    $site = td_site();
    $map = [
        'san-pham' => $site['productCategories'] ?? [],
        'tai-lieu' => $site['documentCategories'] ?? [],
        'tin-tuc' => $site['newsCategories'] ?? [],
    ];
    return $map[$tab] ?? [];
}

function td_brands(): array
{
    return td_site()['brands'] ?? [];
}

function td_brand_by_slug(string $slug): ?array
{
    foreach (td_brands() as $b) {
        if ($b['slug'] === $slug) {
            return $b;
        }
    }
    return null;
}

/** Brand of a product from its free-text `brand` field ("DIRUI INDUSTRIAL CO., LTD" → Dirui). */
function td_brand_of(string $raw): ?array
{
    foreach (td_brands() as $b) {
        $regex = '/' . str_replace('/', '\/', $b['pattern']['source']) . '/u' . (strpos($b['pattern']['flags'], 'i') !== false ? 'i' : '');
        if (@preg_match($regex, $raw)) {
            return $b;
        }
    }
    return null;
}

/** routePath(): the address of a route. */
function td_route_path(array $r): string
{
    if (!empty($r['productId'])) {
        return '/san-pham/chi-tiet/' . $r['productId'];
    }
    if (!empty($r['brand']) && td_brand_by_slug($r['brand'])) {
        return '/thuong-hieu/' . $r['brand'];
    }
    if ($r['tab'] === 'tin-tuc' && !empty($r['articleId'])) {
        return '/tin-tuc/bai-viet/' . $r['articleId'];
    }
    $base = td_tab_paths()[$r['tab']] ?? '/';
    $cat = $r['cat'] ?? '';
    return $cat !== '' && $cat !== 'all' && isset(td_category_labels($r['tab'])[$cat]) ? $base . '/' . $cat : $base;
}

/**
 * parseRoute(), stricter: the route of a path (no slashes at the ends), or null when the website has no such
 * page, so it answers 404 instead of showing the home page.
 */
function td_parse_route(string $path): ?array
{
    $path = preg_replace('/\.html$/', '', $path);
    $parts = array_values(array_filter(explode('/', $path), 'strlen'));
    if (!$parts || $parts === ['index']) {
        return ['tab' => 'trang-chu'];
    }
    $n = count($parts);
    if ($parts[0] === 'thuong-hieu') {
        return $n === 2 && td_brand_by_slug($parts[1]) ? ['tab' => 'san-pham', 'brand' => $parts[1]] : null;
    }
    $tab = array_search('/' . $parts[0], td_tab_paths(), true);
    if ($tab === false || $tab === 'trang-chu') {
        return null;
    }
    if ($n === 1) {
        return ['tab' => $tab];
    }
    if ($tab === 'san-pham' && $parts[1] === 'chi-tiet' && $n === 3) {
        return td_product($parts[2]) ? ['tab' => $tab, 'productId' => $parts[2]] : null;
    }
    if ($tab === 'tin-tuc' && $parts[1] === 'bai-viet' && $n === 3) {
        return td_news_post($parts[2]) ? ['tab' => $tab, 'articleId' => $parts[2]] : null;
    }
    if ($n === 2 && isset(td_category_labels($tab)[$parts[1]])) {
        return ['tab' => $tab, 'cat' => $parts[1]];
    }
    return null;
}

// ---------------------------------------------------------------------------------------------
// src/seo/brands.ts

/** productDisplayName(): the brand right before the model code ("… tự động Dirui CS-T240"). */
function td_product_display_name(string $name, string $raw_brand): string
{
    $clean = trim(preg_replace('/([A-Z])\s*[–-]\s*([A-Z0-9])/u', '$1-$2', preg_replace('/\s+/u', ' ', $name)));
    $brand = td_brand_of($raw_brand);
    if (!$brand || mb_stripos($clean, $brand['name']) !== false) {
        return $clean;
    }
    if (!preg_match('/(^|\s)((?:[A-Z]{2,5} )?[A-Z]{1,4}-?[A-Z]?\d{2,5}[A-Z]?)(?=\s|$)/u', $clean, $m, PREG_OFFSET_CAPTURE)) {
        return $clean . ' ' . $brand['name'];
    }
    $at = $m[0][1] + strlen($m[1][0]);
    return substr($clean, 0, $at) . $brand['name'] . ' ' . substr($clean, $at);
}

/** productKeySpec(): throughput first, otherwise the first spec. */
function td_product_key_spec(array $specs, string $fallback = ''): string
{
    $pick = null;
    foreach ($specs as $s) {
        if (preg_match('/tốc độ|công suất|test\/h|mẫu\/giờ/iu', ($s['label'] ?? '') . ' ' . ($s['value'] ?? ''))) {
            $pick = $s;
            break;
        }
    }
    $pick = $pick ?? ($specs[0] ?? null);
    return $pick ? preg_replace('/[\s.;,]+$/u', '', ($pick['label'] ?? '') . ': ' . ($pick['value'] ?? '')) : $fallback;
}

function td_lcfirst(string $s): string
{
    return mb_strtolower(mb_substr($s, 0, 1)) . mb_substr($s, 1);
}

function td_brand_subject(array $brand): string
{
    return td_lcfirst(preg_replace('/ chính hãng$/u', '', $brand['heading']));
}

function td_brand_faq(array $brand, array $by_category, string $hotline): array
{
    $lines = [];
    foreach ($by_category as $category => $models) {
        $lines[] = $category . ': ' . implode(', ', $models);
    }
    $machine = td_brand_subject($brand);
    return [
        ['q' => "Mua {$machine} chính hãng ở đâu?", 'a' => "Trí Đức (Hoàng Mai, Hà Nội) phân phối {$machine} chính hãng, đủ CO/CQ, giao hàng và lắp đặt trên toàn quốc. Gọi hotline {$hotline} để được tư vấn cấu hình phù hợp."],
        ['q' => "Trí Đức có những sản phẩm {$brand['name']} nào?", 'a' => implode('; ', $lines) . '. Mỗi sản phẩm có trang riêng với thông số kỹ thuật chi tiết.'],
        ['q' => "Giá {$machine} bao nhiêu?", 'a' => "Giá phụ thuộc model, cấu hình và hóa chất đi kèm. Vui lòng gọi hotline {$hotline} hoặc gửi yêu cầu báo giá trên website để nhận báo giá và chính sách chiết khấu."],
        ['q' => "Mua {$brand['name']} tại Trí Đức có được lắp đặt và bảo hành không?", 'a' => 'Có. Kỹ sư Trí Đức lắp đặt tận nơi, chạy mẫu, hướng dẫn sử dụng và bảo hành 12 tháng; sau đó hỗ trợ bảo trì định kỳ và cung cấp hóa chất, vật tư.'],
    ];
}

/** categoryFaq() of src/seo/guides.ts. */
function td_category_faq(string $label, array $models, string $hotline): array
{
    $subject = td_lcfirst($label);
    return [
        ['q' => "Trí Đức có những {$subject} nào?", 'a' => implode(', ', $models) . '. Mỗi sản phẩm có trang riêng với thông số kỹ thuật chi tiết.'],
        ['q' => "Giá {$subject} bao nhiêu?", 'a' => "Giá phụ thuộc model, cấu hình và hóa chất đi kèm. Vui lòng gọi hotline {$hotline} hoặc gửi yêu cầu báo giá trên website để nhận báo giá và chính sách chiết khấu."],
    ];
}

function td_product_title(array $p): string
{
    return td_product_display_name($p['name'], $p['brand'] ?? '');
}

function td_hotline(): string
{
    return (string) (td_company()['hotline'] ?? (td_site()['hotline'] ?? ''));
}

function td_brand_products(array $brand): array
{
    return array_values(array_filter(td_products(), function ($p) use ($brand) {
        $b = td_brand_of($p['brand'] ?? '');
        return $b && $b['slug'] === $brand['slug'];
    }));
}

/** Products of a brand grouped by category label. */
function td_brand_groups(array $items): array
{
    $labels = td_category_labels('san-pham');
    $groups = [];
    foreach ($items as $p) {
        $label = $labels[$p['category']] ?? (($p['categoryLabel'] ?? '') ?: 'Sản phẩm');
        $groups[$label][] = $p;
    }
    return $groups;
}

function td_brand_faq_for(array $brand, array $items): array
{
    $by_category = [];
    foreach (td_brand_groups($items) as $label => $list) {
        $by_category[$label] = array_map(function ($p) {
            return ($p['model'] ?? '') !== '' ? $p['model'] : $p['name'];
        }, $list);
    }
    return td_brand_faq($brand, $by_category, td_hotline());
}

/** The buying guide's own questions plus catalogue / price questions, as on the products page. */
function td_guide_faq_for(string $category): array
{
    $own = td_site()['guides'][$category]['faq'] ?? [];
    $label = td_category_labels('san-pham')[$category] ?? null;
    if (!$label) {
        return $own;
    }
    $models = [];
    foreach (td_products() as $p) {
        if ($p['category'] === $category) {
            $models[] = td_product_title($p);
        }
    }
    return $models ? array_merge($own, td_category_faq($label, $models, td_hotline())) : $own;
}

// ---------------------------------------------------------------------------------------------
// src/seo/routes.ts → seoFor()

/** Google shows about 60 title characters and 160 description characters. */
function td_clip(string $text, int $max): string
{
    $clean = trim(preg_replace('/\s+/u', ' ', $text));
    if (mb_strlen($clean) <= $max) {
        return $clean;
    }
    $cut = mb_substr($clean, 0, $max - 1);
    $space = mb_strrpos($cut, ' ');
    return mb_substr($cut, 0, (int) max($space === false ? -1 : $space, $max * 0.6)) . '…';
}

function td_with_brand(string $title): string
{
    $full = $title . ' | ' . (td_site()['siteName'] ?? 'Trí Đức');
    return mb_strlen($full) <= 60 ? $full : td_clip($title, 60);
}

/** "29/11/2024" → "2024-11-29" */
function td_iso_date(string $date): ?string
{
    return preg_match('~^(\d{1,2})/(\d{1,2})/(\d{4})$~', $date, $m) ? sprintf('%s-%02d-%02d', $m[3], $m[2], $m[1]) : null;
}

function td_default_image(): string
{
    return td_static_url(td_site()['defaultImage'] ?? '/images/hero-lab-analyzers.jpg');
}

/** Article fields used by the SEO, for a news slug. */
function td_article(string $id): ?array
{
    $post = td_news_post($id);
    if (!$post) {
        return null;
    }
    return [
        'post' => $post,
        'title' => $post->post_title,
        'excerpt' => td_excerpt($post),
        'image' => td_image($post),
        'date' => td_date($post),
    ] + td_seo_fields($post);
}

function td_seo_core(array $route): array
{
    $site = td_site();
    $path = td_route_path($route);

    if (!empty($route['productId']) && ($p = td_product($route['productId']))) {
        $title = td_product_title($p);
        $origin = ($p['origin'] ?? '') !== '' ? ' (' . $p['origin'] . ')' : '';
        $spec = td_product_key_spec($p['specs'] ?? []);
        $description = $title . ($spec !== '' ? ' – ' . $spec : '') . ". Chính hãng{$origin}, CO/CQ, bảo hành 12 tháng, lắp đặt tận nơi. Hotline " . td_hotline() . '.';
        return [
            'title' => !empty($p['seoTitle']) ? td_clip($p['seoTitle'], 70) : td_with_brand($title),
            'description' => td_clip(!empty($p['seoDescription']) ? $p['seoDescription'] : $description, 160),
            'path' => $path,
            'image' => ($p['image'] ?? '') ?: td_default_image(),
            'type' => 'product',
        ];
    }

    if (!empty($route['articleId']) && ($a = td_article($route['articleId']))) {
        return [
            'title' => !empty($a['seoTitle']) ? td_clip($a['seoTitle'], 70) : td_with_brand($a['title']),
            'description' => td_clip(!empty($a['seoDescription']) ? $a['seoDescription'] : $a['excerpt'], 160),
            'path' => $path,
            'image' => $a['image'] ?: td_default_image(),
            'type' => 'article',
            'published' => td_iso_date($a['date']),
        ];
    }

    $brand = !empty($route['brand']) ? td_brand_by_slug($route['brand']) : null;
    if ($brand) {
        return [
            'title' => td_with_brand($brand['heading'] . ', giá tốt'),
            'description' => td_clip($brand['intro'], 160),
            'path' => $path,
            'image' => td_default_image(),
            'type' => 'website',
        ];
    }

    $seo = td_content('seo')[$route['tab']] ?? [];
    $page = [
        'title' => $route['tab'] === 'trang-chu' ? (string) ($seo['title'] ?? '') : td_with_brand((string) ($seo['title'] ?? '')),
        'description' => td_clip(($seo['description'] ?? '') ?: ($site['defaultDescription'] ?? ''), 160),
    ];
    $cat_label = !empty($route['cat']) ? (td_category_labels($route['tab'])[$route['cat']] ?? null) : null;
    if ($cat_label) {
        $keyword = $route['tab'] === 'san-pham' ? $cat_label . ' chính hãng, giá tốt' : $cat_label;
        return [
            'title' => td_with_brand(mb_strlen($keyword) <= 44 ? $keyword : $cat_label),
            'description' => td_clip(
                $route['tab'] === 'san-pham'
                    ? "{$cat_label} chính hãng Dirui, DFI, Audicom… đủ CO/CQ. Báo giá tốt, lắp đặt, đào tạo và bảo hành tận nơi toàn quốc. Hotline " . td_hotline() . '.'
                    : $cat_label . ': ' . $page['description'],
                160
            ),
            'path' => $path,
            'image' => td_default_image(),
            'type' => 'website',
        ];
    }
    return $page + ['path' => $path, 'image' => td_default_image(), 'type' => 'website'];
}

function td_seo_for(array $route): array
{
    $meta = td_seo_core($route);
    if ($route['tab'] === 'trang-chu') {
        return $meta;
    }
    $labels = td_site()['tabLabels'] ?? [];
    $trail = [
        ['name' => $labels['trang-chu'] ?? 'Trang chủ', 'path' => '/'],
        ['name' => $labels[$route['tab']] ?? $route['tab'], 'path' => td_route_path(['tab' => $route['tab']])],
    ];
    $cat_label = !empty($route['cat']) ? (td_category_labels($route['tab'])[$route['cat']] ?? null) : null;
    $brand = !empty($route['brand']) ? td_brand_by_slug($route['brand']) : null;
    if (!empty($route['productId']) && ($p = td_product($route['productId']))) {
        $cat = $p['category'] ?? '';
        $product_labels = td_category_labels('san-pham');
        if (isset($product_labels[$cat])) {
            $trail[] = ['name' => $product_labels[$cat], 'path' => td_route_path(['tab' => 'san-pham', 'cat' => $cat])];
        }
        $trail[] = ['name' => $p['name'], 'path' => $meta['path']];
    } elseif ($brand) {
        $trail[] = ['name' => $brand['heading'], 'path' => $meta['path']];
    } elseif ($cat_label) {
        $trail[] = ['name' => $cat_label, 'path' => $meta['path']];
    } elseif (!empty($route['articleId']) && ($a = td_article($route['articleId']))) {
        $trail[] = ['name' => $a['title'], 'path' => $meta['path']];
    }
    return $meta + ['breadcrumbs' => $trail];
}

// ---------------------------------------------------------------------------------------------
// src/seo/head.ts → headTagsHtml()

function td_absolute(string $path_or_url): string
{
    return preg_match('~^https?://~', $path_or_url) ? $path_or_url : untrailingslashit(home_url()) . $path_or_url;
}

function td_ld(array $data, string $id = ''): string
{
    $json = wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG);
    return '<script type="application/ld+json"' . ($id !== '' ? ' id="' . esc_attr($id) . '"' : '') . '>' . $json . '</script>';
}

function td_head_tags(array $meta): string
{
    $site_name = td_site()['siteName'] ?? 'Trí Đức';
    $url = td_absolute($meta['path']);
    $image = td_absolute($meta['image']);
    $lines = ['<title>' . esc_html($meta['title']) . '</title>'];
    $tags = [
        ['name', 'description', $meta['description']],
        ['link', 'canonical', $url],
        ['property', 'og:site_name', $site_name],
        ['property', 'og:locale', 'vi_VN'],
        ['property', 'og:type', $meta['type'] === 'article' ? 'article' : 'website'],
        ['property', 'og:title', $meta['title']],
        ['property', 'og:description', $meta['description']],
        ['property', 'og:url', $url],
        ['property', 'og:image', $image],
        ['name', 'twitter:card', 'summary_large_image'],
        ['name', 'twitter:title', $meta['title']],
        ['name', 'twitter:description', $meta['description']],
        ['name', 'twitter:image', $image],
    ];
    if (!empty($meta['published'])) {
        $tags[] = ['property', 'article:published_time', $meta['published']];
    }
    foreach ($tags as [$kind, $key, $value]) {
        $lines[] = $kind === 'link'
            ? '<link rel="' . $key . '" href="' . esc_url($value) . '" />'
            : '<meta ' . $kind . '="' . $key . '" content="' . esc_attr($value) . '" />';
    }

    $ld = [];
    if (!empty($meta['breadcrumbs'])) {
        $items = [];
        foreach ($meta['breadcrumbs'] as $i => $b) {
            $items[] = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $b['name'], 'item' => td_absolute($b['path'])];
        }
        $ld[] = ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => $items];
    }
    if ($meta['type'] === 'article') {
        $home = untrailingslashit(home_url());
        $ld[] = [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $meta['title'],
            'description' => $meta['description'],
            'image' => $image,
            'url' => $url,
        ] + (!empty($meta['published']) ? ['datePublished' => $meta['published']] : []) + [
            'author' => ['@type' => 'Organization', 'name' => $site_name, 'url' => $home],
            'publisher' => ['@type' => 'Organization', 'name' => $site_name, 'logo' => td_absolute(td_static_url('/logo-tri-duc.png'))],
        ];
    }
    if ($ld) {
        $lines[] = td_ld($ld, 'ld-page');
    }
    return implode("\n    ", $lines);
}

/** LocalBusiness + WebSite structured data, on every page (organizationLd() of seo-plugin.ts). */
function td_organization_ld(): string
{
    $c = td_company();
    $home = untrailingslashit(home_url());
    $site_name = td_site()['siteName'] ?? 'Trí Đức';
    return td_ld([
        [
            '@context' => 'https://schema.org',
            '@type' => 'LocalBusiness',
            '@id' => $home . '/#business',
            'name' => $c['name'] ?? $site_name,
            'alternateName' => $site_name,
            'description' => 'Nhà phân phối chính hãng máy xét nghiệm Dirui, hóa chất xét nghiệm Dewei và thiết bị y tế cho bệnh viện, phòng khám toàn quốc.',
            'url' => $home,
            'logo' => td_absolute(td_static_url((string) ($c['logoUrl'] ?? '/logo-tri-duc.png'))),
            'image' => td_absolute(td_default_image()),
            'email' => $c['email'] ?? '',
            'telephone' => $c['hotline'] ?? '',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $c['address'] ?? '',
                'addressLocality' => 'Hà Nội',
                'addressRegion' => 'Hà Nội',
                'addressCountry' => 'VN',
            ],
            'areaServed' => ['@type' => 'Country', 'name' => 'Việt Nam'],
            'knowsAbout' => ['Máy xét nghiệm Dirui', 'Máy xét nghiệm sinh hóa', 'Máy xét nghiệm nước tiểu', 'Máy xét nghiệm huyết học', 'Hóa chất xét nghiệm', 'Thiết bị y tế'],
            'sameAs' => array_values(array_filter([$c['facebookUrl'] ?? '', $c['zaloUrl'] ?? ''])),
        ],
        [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            '@id' => $home . '/#website',
            'name' => $site_name,
            'url' => $home,
            'inLanguage' => 'vi-VN',
            'publisher' => ['@id' => $home . '/#business'],
        ],
    ]);
}

/** FAQ of a brand page or a products page, for FAQPage structured data and the page copy. */
function td_page_faq(array $route): array
{
    $brand = !empty($route['brand']) ? td_brand_by_slug($route['brand']) : null;
    if ($brand) {
        $items = td_brand_products($brand);
        return $items ? td_brand_faq_for($brand, $items) : [];
    }
    if ($route['tab'] === 'san-pham' && empty($route['productId'])) {
        return td_guide_faq_for(($route['cat'] ?? '') ?: 'all');
    }
    return [];
}

function td_faq_ld(array $faq): string
{
    $entities = [];
    foreach ($faq as $f) {
        $entities[] = ['@type' => 'Question', 'name' => $f['q'], 'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f['a']]];
    }
    return td_ld(['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $entities]);
}

// ---------------------------------------------------------------------------------------------
// fallbackBody() of seo-plugin.ts: the page's content as plain HTML inside #root, which the app replaces.

function td_link(array $route, string $text): string
{
    return '<a href="' . esc_url(home_url(td_route_path($route))) . '">' . esc_html($text) . '</a>';
}

function td_list(array $items): string
{
    return $items ? '<ul><li>' . implode('</li><li>', $items) . '</li></ul>' : '';
}

function td_fallback_body(array $route, array $meta, string $article_html = ''): string
{
    $site = td_site();
    $products = td_products();
    $product_labels = td_category_labels('san-pham');
    $product_item = function ($p) {
        return td_link(['tab' => 'san-pham', 'productId' => $p['id']], td_product_title($p))
            . (($p['shortDesc'] ?? '') !== '' ? ' – ' . esc_html($p['shortDesc']) : '');
    };
    $category_links = [];
    foreach ($product_labels as $cat => $label) {
        $category_links[] = td_link(['tab' => 'san-pham', 'cat' => $cat], $label);
    }
    $brand_links = [];
    foreach (td_brands() as $b) {
        $brand_links[] = td_link(['tab' => 'san-pham', 'brand' => $b['slug']], $b['heading']);
    }
    $faq_html = function (array $faq) {
        $out = '';
        foreach ($faq as $f) {
            $out .= '<h3>' . esc_html($f['q']) . '</h3><p>' . esc_html($f['a']) . '</p>';
        }
        return $out;
    };
    $main = '';

    if (!empty($route['productId']) && ($p = td_product($route['productId']))) {
        $brand = td_brand_of($p['brand'] ?? '');
        $specs = '';
        if (!empty($p['specs'])) {
            $rows = '';
            foreach ($p['specs'] as $s) {
                $rows .= '<tr><th>' . esc_html($s['label'] ?? '') . '</th><td>' . esc_html($s['value'] ?? '') . '</td></tr>';
            }
            $specs = '<h2>Thông số kỹ thuật</h2><table>' . $rows . '</table>';
        }
        $features = !empty($p['features']) ? '<h2>Tính năng nổi bật</h2>' . td_list(array_map('esc_html', $p['features'])) : '';
        $cat_link = td_link(['tab' => 'san-pham', 'cat' => $p['category']], $product_labels[$p['category']] ?? 'Sản phẩm');
        $brand_link = $brand ? ' · Thương hiệu: ' . td_link(['tab' => 'san-pham', 'brand' => $brand['slug']], $brand['heading']) : '';
        $main = implode("\n", [
            '<h1>' . esc_html(td_product_title($p)) . '</h1>',
            '<p>' . esc_html($p['shortDesc'] ?? '') . '</p>',
            ($p['fullDesc'] ?? '') !== '' ? '<p>' . esc_html($p['fullDesc']) . '</p>' : '',
            $specs,
            $features,
            '<p>Danh mục: ' . $cat_link . $brand_link . '</p>',
            '<p>Liên hệ báo giá ' . esc_html(td_product_title($p)) . ': hotline ' . esc_html(td_hotline()) . '.</p>',
        ]);
    } elseif (!empty($route['articleId']) && ($a = td_article($route['articleId']))) {
        $main = '<article><h1>' . esc_html($a['title']) . '</h1><p><time>' . esc_html($a['date']) . '</time></p>'
            . preg_replace('/<(\/?)h1\b/i', '<$1h2', $article_html) . '</article>';
    } elseif (!empty($route['brand']) && ($brand = td_brand_by_slug($route['brand']))) {
        $items = td_brand_products($brand);
        $tables = '';
        foreach (td_brand_groups($items) as $label => $list) {
            $rows = '';
            foreach ($list as $p) {
                $rows .= '<tr><td>' . td_link(['tab' => 'san-pham', 'productId' => $p['id']], td_product_title($p)) . '</td><td>'
                    . esc_html(td_product_key_spec($p['specs'] ?? [], $p['shortDesc'] ?? '')) . '</td><td>' . esc_html($p['origin'] ?? '') . '</td></tr>';
            }
            $tables .= '<h3>' . esc_html($label) . '</h3><table><tr><th>Model</th><th>Thông số nổi bật</th><th>Xuất xứ</th></tr>' . $rows . '</table>';
        }
        $main = implode("\n", [
            '<h1>' . esc_html($brand['heading']) . '</h1><p>' . esc_html($brand['intro']) . '</p>',
            '<h2>Sản phẩm ' . esc_html($brand['name']) . '</h2>' . td_list(array_map($product_item, $items)),
            $items ? '<h2>So sánh các dòng ' . esc_html(td_brand_subject($brand)) . '</h2>' . $tables : '',
            $items ? '<h2>Câu hỏi thường gặp về ' . esc_html($brand['name']) . '</h2>' . $faq_html(td_brand_faq_for($brand, $items)) : '',
        ]);
    } elseif ($route['tab'] === 'san-pham') {
        $cat = $route['cat'] ?? '';
        $items = $cat !== '' ? array_filter($products, function ($p) use ($cat) {
            return $p['category'] === $cat;
        }) : $products;
        $heading = $cat !== '' ? $product_labels[$cat] : 'Máy xét nghiệm và hóa chất xét nghiệm chính hãng';
        $guide = $site['guides'][$cat !== '' ? $cat : 'all'] ?? null;
        $overview = '';
        if ($cat === '') {
            $blurbs = [];
            foreach ($site['blurbs'] ?? [] as $c => $blurb) {
                $blurbs[] = td_link(['tab' => 'san-pham', 'cat' => $c], $product_labels[$c] ?? $c) . ': ' . esc_html($blurb);
            }
            $overview = td_list($blurbs);
        }
        $faq = $faq_html(td_guide_faq_for($cat !== '' ? $cat : 'all'));
        $guide_html = '';
        if ($guide) {
            $guide_html = '<h2>' . esc_html($guide['heading']) . '</h2>';
            foreach ($guide['intro'] as $para) {
                $guide_html .= '<p>' . esc_html($para) . '</p>';
            }
            $guide_html .= $overview;
        }
        $main = implode("\n", [
            '<h1>' . esc_html($heading) . '</h1>',
            '<p>' . esc_html($meta['description']) . '</p>',
            td_list(array_map($product_item, array_values($items))),
            $guide_html,
            $faq !== '' ? '<h2>Câu hỏi thường gặp</h2>' . $faq : '',
            '<h2>Danh mục sản phẩm</h2>' . td_list($category_links),
            '<h2>Thương hiệu</h2>' . td_list($brand_links),
        ]);
    } elseif ($route['tab'] === 'tin-tuc') {
        $cat = $route['cat'] ?? '';
        $heading = $cat !== '' ? td_category_labels('tin-tuc')[$cat] : 'Tin tức và kiến thức xét nghiệm';
        $articles = [];
        foreach (td_news() as $a) {
            if ($cat === '' || ($a['categorySlug'] ?? '') === $cat) {
                $articles[] = td_link(['tab' => 'tin-tuc', 'articleId' => $a['id']], $a['title']) . ' – ' . esc_html(mb_substr($a['excerpt'], 0, 200));
            }
        }
        $main = '<h1>' . esc_html($heading) . '</h1><p>' . esc_html($meta['description']) . '</p>' . td_list($articles);
    } elseif ($route['tab'] === 'tai-lieu') {
        $cat = $route['cat'] ?? '';
        $labels = td_category_labels('tai-lieu');
        $heading = $cat !== '' ? $labels[$cat] : 'Tài liệu kỹ thuật và video hướng dẫn';
        $cats = [];
        foreach ($labels as $c => $label) {
            $cats[] = td_link(['tab' => 'tai-lieu', 'cat' => $c], $label);
        }
        $main = '<h1>' . esc_html($heading) . '</h1><p>' . esc_html($meta['description']) . '</p>' . td_list($cats);
    } elseif ($route['tab'] === 'trang-chu') {
        $latest = [];
        foreach (array_slice(td_news(), 0, 20) as $a) {
            $latest[] = td_link(['tab' => 'tin-tuc', 'articleId' => $a['id']], $a['title']);
        }
        $main = implode("\n", [
            '<h1>Máy xét nghiệm Dirui, hóa chất xét nghiệm chính hãng – ' . esc_html($site['siteName'] ?? 'Trí Đức') . '</h1>',
            '<p>' . esc_html($meta['description']) . '</p>',
            '<h2>Danh mục máy xét nghiệm</h2>' . td_list($category_links),
            '<h2>Thương hiệu phân phối</h2>' . td_list($brand_links),
            '<h2>Sản phẩm</h2>' . td_list(array_map($product_item, $products)),
            '<h2>Tin tức mới</h2>' . td_list($latest),
        ]);
    } else {
        $main = '<h1>' . esc_html(str_replace(' | ' . ($site['siteName'] ?? 'Trí Đức'), '', $meta['title'])) . '</h1><p>' . esc_html($meta['description']) . '</p>';
    }

    $nav = td_list([
        td_link(['tab' => 'trang-chu'], 'Trang chủ'),
        td_link(['tab' => 'gioi-thieu'], 'Giới thiệu'),
        td_link(['tab' => 'san-pham'], 'Sản phẩm'),
        td_link(['tab' => 'san-pham', 'brand' => 'dirui'], 'Máy xét nghiệm Dirui'),
        td_link(['tab' => 'tai-lieu'], 'Tài liệu'),
        td_link(['tab' => 'tin-tuc'], 'Tin tức'),
        td_link(['tab' => 'tuyen-dung'], 'Tuyển dụng'),
        td_link(['tab' => 'lien-he'], 'Liên hệ'),
    ]);
    $c = td_company();
    $hotline = (string) ($c['hotline'] ?? '');
    $contact = '<p>' . esc_html($c['name'] ?? '') . ' – ' . esc_html($c['address'] ?? '') . '. Hotline: <a href="tel:' . esc_attr(str_replace('.', '', $hotline)) . '">'
        . esc_html($hotline) . '</a>' . (!empty($c['hotline2']) ? ', ' . esc_html($c['hotline2']) : '') . '. Email: ' . esc_html($c['email'] ?? '') . '.</p>';

    return '<div id="seo-fallback" style="max-width:1100px;margin:0 auto;padding:24px 16px;font-family:system-ui,sans-serif;line-height:1.6;color:#111">'
        . "\n<nav aria-label=\"Điều hướng\">{$nav}</nav>\n<main>{$main}</main>\n<footer>{$contact}</footer>\n</div>";
}
