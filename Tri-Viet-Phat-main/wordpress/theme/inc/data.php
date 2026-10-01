<?php
/**
 * The content handed to the app: window.__TD__ (src/wp.ts in the project), served as a cacheable script at
 * /?td_data=<version>. The version changes whenever news, products, documents, jobs or page texts change,
 * so visitors' browsers keep the data until there is something new.
 */

defined('ABSPATH') || exit;

/** data/<name>.json written by the build: site (brands, guides, labels, redirects), defaults, schema. */
function td_json_file(string $name): array
{
    static $cache = [];
    if (!isset($cache[$name])) {
        $raw = @file_get_contents(TD_DIR . '/data/' . $name . '.json');
        $cache[$name] = is_string($raw) ? (json_decode($raw, true) ?: []) : [];
    }
    return $cache[$name];
}

function td_site(): array
{
    return td_json_file('site');
}

/**
 * Page texts and settings ("trang-chu", "seo", "company", "partners"…): as saved in WP Admin → Trí Đức,
 * otherwise the texts the theme ships with.
 */
function td_content(string $name): array
{
    $saved = get_option('tri_duc_content', []);
    if (is_array($saved) && isset($saved[$name]) && is_array($saved[$name])) {
        return $saved[$name];
    }
    return td_json_file('defaults')[$name] ?? [];
}

function td_company(): array
{
    return td_content('company');
}

/** Connection settings (WP Admin → Trí Đức → Kết nối) and their values before anything is saved. */
function td_settings_defaults(): array
{
    return [
        'telegram_token' => '',
        'telegram_chat_ids' => '',
        'email_to' => 'infothietbiyte168@gmail.com',
        'email_from' => '',
        'gemini_key' => '',
        'ai_models' => 'gemini-flash-lite-latest, gemini-3.8-flash, gemini-2.5-flash-lite',
        'ai_google_search' => '',
        'ga_id' => 'G-4ZN5LFJ9EE',
        'gtag_id' => 'GT-MJPJ9G9P',
        'site_verification' => 'YvQAr4u4VHPC7DY9Vslu8l6MeIfKVTHUpWu75rMSdig',
    ];
}

function td_option(string $key): string
{
    $o = get_option('tri_duc_settings', []);
    return is_array($o) && isset($o[$key]) ? (string) $o[$key] : (string) (td_settings_defaults()[$key] ?? '');
}

// ---------------------------------------------------------------------------------------------
// The theme's own images (static/: logo, banners, partner logos) keep the paths the app uses ("/images/…").

function td_static_url(string $path): string
{
    if ($path !== '' && $path[0] === '/' && substr($path, 0, 2) !== '//' && strpos($path, '..') === false
        && is_file(TD_DIR . '/static' . $path)) {
        return get_template_directory_uri() . '/static' . $path;
    }
    return $path;
}

/** Points every "/…png|jpg|svg…" path in page texts at the theme folder. */
function td_with_static_urls($value)
{
    if (is_array($value)) {
        return array_map('td_with_static_urls', $value);
    }
    if (is_string($value) && preg_match('~^/[^/].*\.(png|jpe?g|webp|gif|svg|ico)$~i', $value)) {
        return td_static_url($value);
    }
    return $value;
}

// ---------------------------------------------------------------------------------------------
// Posts as the app's entries.

function td_image(WP_Post $post, string $size = 'large'): string
{
    $url = get_the_post_thumbnail_url($post, $size);
    if (!$url) {
        // Imported content whose picture could not be copied keeps the address it had
        $url = (string) get_post_meta($post->ID, '_td_image', true);
    }
    // Without a featured image the cards show the site's lab photo rather than a broken picture
    return $url ? td_static_url($url) : td_default_image();
}

function td_date(WP_Post $post): string
{
    return mysql2date('d/m/Y', $post->post_date);
}

/**
 * Body as WordPress shows it (blocks, shortcodes, lazy images). Content brought over by the import plugin
 * (meta _td_html) is finished HTML, so WordPress's automatic paragraphs (wpautop) are not added to it.
 */
function td_render_content(WP_Post $post): string
{
    $GLOBALS['post'] = $post;
    setup_postdata($post);
    $raw = get_post_meta($post->ID, '_td_html', true) === '1';
    $priority = $raw ? has_filter('the_content', 'wpautop') : false;
    if ($priority !== false) {
        remove_filter('the_content', 'wpautop', $priority);
    }
    $html = apply_filters('the_content', $post->post_content);
    if ($priority !== false) {
        add_filter('the_content', 'wpautop', $priority);
    }
    wp_reset_postdata();
    return str_replace(']]>', ']]&gt;', (string) $html);
}

function td_plain(string $html): string
{
    $text = wp_strip_all_tags(strip_shortcodes($html));
    return trim(preg_replace('/\s+/u', ' ', html_entity_decode($text, ENT_QUOTES, 'UTF-8')));
}

/** The summary written in the editor, else the start of the body; cut at a word to $max characters. */
function td_excerpt(WP_Post $post, int $max = 0): string
{
    $text = $post->post_excerpt !== '' ? td_plain($post->post_excerpt) : td_plain(mb_substr($post->post_content, 0, 3000));
    if ($post->post_excerpt === '' && $max === 0) {
        $max = 250;
    }
    if ($max > 0 && mb_strlen($text) > $max) {
        $text = preg_replace('/\s+\S*$/u', '', mb_substr($text, 0, $max)) . '…';
    }
    return $text;
}

function td_meta(WP_Post $post, string $field)
{
    return get_post_meta($post->ID, '_td_' . $field, true);
}

/** seoTitle / seoDescription when written in the editor's SEO box. */
function td_seo_fields(WP_Post $post): array
{
    $out = [];
    foreach (['seoTitle', 'seoDescription'] as $field) {
        $value = trim((string) td_meta($post, $field));
        if ($value !== '') {
            $out[$field] = $value;
        }
    }
    return $out;
}

function td_query(string $type, array $args = []): array
{
    $query = new WP_Query($args + [
        'post_type' => $type,
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => $type === 'post' ? ['date' => 'DESC', 'ID' => 'DESC'] : ['menu_order' => 'ASC', 'date' => 'DESC'],
        'no_found_rows' => true,
        'ignore_sticky_posts' => true,
        'suppress_filters' => false,
    ]);
    update_post_thumbnail_cache($query);
    return $query->posts;
}

/** Slug of the post's website category (kien-thuc-suc-khoe / tin-y-te / tin-noi-bo), if any. */
function td_news_category(WP_Post $post): string
{
    $known = td_site()['newsCategories'] ?? [];
    foreach (get_the_category($post->ID) as $term) {
        if (isset($known[$term->slug])) {
            return $term->slug;
        }
    }
    return '';
}

/** News list for the app: no bodies (an article's body is loaded when it is opened). */
function td_build_news(): array
{
    $news = [];
    foreach (td_query('post') as $post) {
        $item = [
            'id' => $post->post_name,
            'title' => $post->post_title,
            'date' => td_date($post),
            'image' => td_image($post),
            // Cards show three lines at most, so a short excerpt keeps the data light
            'excerpt' => td_excerpt($post, 220),
        ];
        $cat = td_news_category($post);
        if ($cat !== '') {
            $item['categorySlug'] = $cat;
        }
        $news[] = $item + td_seo_fields($post);
    }
    return $news;
}

/** A published news post by its slug. */
function td_news_post(string $slug): ?WP_Post
{
    static $found = [];
    if ($slug === '') {
        return null;
    }
    if (!array_key_exists($slug, $found)) {
        $posts = get_posts(['name' => $slug, 'post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 1]);
        $found[$slug] = $posts[0] ?? null;
    }
    return $found[$slug];
}

/** Documents (td_document) or job openings (td_job) with their bodies. */
function td_entries(string $type): array
{
    $out = [];
    foreach (td_query($type) as $post) {
        $item = [
            'id' => $post->post_name,
            'title' => $post->post_title,
            'date' => td_date($post),
            'image' => td_image($post),
            'excerpt' => td_excerpt($post),
            'contentHtml' => td_render_content($post),
        ];
        if ($type === 'td_job') {
            $item['quantity'] = (string) td_meta($post, 'quantity');
            $item['location'] = (string) td_meta($post, 'location');
        }
        $out[] = $item + td_seo_fields($post);
    }
    return $out;
}

/** Text fields of a product kept in post meta, with their labels in the editor. */
function td_product_text_fields(): array
{
    return [
        'model' => 'Model',
        'brand' => 'Hãng (ví dụ: DIRUI INDUSTRIAL CO., LTD)',
        'manufacturer' => 'Nhà sản xuất',
        'origin' => 'Xuất xứ (ví dụ: Trung Quốc)',
        'countryOfOrigin' => 'Nước sản xuất',
        'alt' => 'Mô tả ảnh (cho Google; bỏ trống thì dùng tên sản phẩm)',
    ];
}

function td_build_products(): array
{
    $products = [];
    foreach (td_query('td_product') as $post) {
        $item = [
            'id' => $post->post_name,
            'order' => (int) $post->menu_order,
            'name' => $post->post_title,
            'category' => (string) td_meta($post, 'category'),
            'image' => td_image($post, 'full'),
            'shortDesc' => td_plain($post->post_excerpt),
            'fullDesc' => (string) td_meta($post, 'fullDesc'),
        ];
        foreach (array_keys(td_product_text_fields()) as $field) {
            $item[$field] = (string) td_meta($post, $field);
        }
        foreach (['specs', 'features', 'detailedFeatures', 'benefits', 'certifications'] as $field) {
            $value = td_meta($post, $field);
            $item[$field] = is_array($value) ? array_values($value) : [];
        }
        if (trim($post->post_content) !== '') {
            $item['detailHtml'] = td_render_content($post);
        }
        $products[] = $item + td_seo_fields($post);
    }
    return $products;
}

/** News list and products as in the cached data (td_payload_json), without querying them again. */
function td_data(): array
{
    static $data = null;
    if ($data === null) {
        $data = json_decode(td_payload_json(), true) ?: [];
    }
    return $data;
}

function td_news(): array
{
    return td_data()['news'] ?? [];
}

function td_products(): array
{
    return td_data()['products'] ?? [];
}

function td_product(string $id): ?array
{
    foreach (td_products() as $p) {
        if ($p['id'] === $id) {
            return $p;
        }
    }
    return null;
}

// ---------------------------------------------------------------------------------------------
// window.__TD__

const TD_PAGE_FILES = ['trang-chu', 'gioi-thieu', 'san-pham', 'tai-lieu', 'tuyen-dung', 'lien-he', 'chan-trang', 'seo'];
const TD_SETTING_FILES = ['company', 'about', 'partners', 'testimonials'];

function td_payload(): array
{
    $pages = [];
    foreach (TD_PAGE_FILES as $name) {
        $pages[$name] = td_with_static_urls(td_content($name));
    }
    $settings = [];
    foreach (TD_SETTING_FILES as $name) {
        $settings[$name] = td_with_static_urls(td_content($name));
    }
    return [
        'assets' => get_template_directory_uri() . '/static',
        'endpoints' => [
            'lead' => home_url('/?td_api=lead'),
            'chat' => home_url('/?td_api=chat'),
            'news' => home_url('/?td_api=news&id='),
        ],
        'news' => td_build_news(),
        'documents' => td_entries('td_document'),
        'jobs' => td_entries('td_job'),
        'products' => td_build_products(),
        'pages' => $pages,
        'settings' => $settings,
    ];
}

function td_data_version(): string
{
    return TD_VERSION . '.' . get_option('tri_duc_data_version', '1');
}

function td_bump_data_version(): void
{
    update_option('tri_duc_data_version', (string) round(microtime(true) * 1000));
}

/** The JSON of window.__TD__, rebuilt once per content change. */
function td_payload_json(): string
{
    $version = td_data_version();
    $cached = get_transient('td_payload');
    if (is_array($cached) && ($cached['v'] ?? '') === $version && is_string($cached['json'] ?? null)) {
        return $cached['json'];
    }
    $json = wp_json_encode(td_payload(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    set_transient('td_payload', ['v' => $version, 'json' => $json], WEEK_IN_SECONDS);
    return $json;
}

$td_changed = function ($post_id) {
    if (in_array(get_post_type($post_id), TD_CONTENT_TYPES, true)) {
        td_bump_data_version();
    }
};
foreach (['save_post', 'before_delete_post', 'trashed_post', 'untrashed_post'] as $hook) {
    add_action($hook, $td_changed);
}
foreach (['created_category', 'edited_category', 'delete_category', 'update_option_tri_duc_content', 'add_option_tri_duc_content'] as $hook) {
    add_action($hook, 'td_bump_data_version');
}
