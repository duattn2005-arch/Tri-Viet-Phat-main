<?php
/**
 * Content types and the site's URLs.
 *
 * News are ordinary Posts (Bài viết) in the categories kien-thuc-suc-khoe / tin-y-te / tin-noi-bo. Products,
 * documents and job openings have their own types; their extra fields are kept in post meta "_td_<field>"
 * (the field names of the project's src/content JSON). Website enquiries are stored as "Khách liên hệ".
 * Every link WordPress makes (View post, sitemap, RSS) points at the app's address for that content.
 */

defined('ABSPATH') || exit;

/** Post types whose changes reach the website's data. */
const TD_CONTENT_TYPES = ['post', 'td_product', 'product', 'td_document', 'td_job'];

function td_type_labels(string $plural, string $singular): array
{
    return [
        'name' => $plural,
        'singular_name' => $plural,
        'menu_name' => $plural,
        'all_items' => 'Tất cả ' . $singular,
        'add_new' => 'Thêm mới',
        'add_new_item' => 'Thêm ' . $singular,
        'edit_item' => 'Sửa ' . $singular,
        'new_item' => ucfirst($singular) . ' mới',
        'view_item' => 'Xem ' . $singular,
        'search_items' => 'Tìm ' . $singular,
        'not_found' => 'Chưa có ' . $singular . ' nào',
        'not_found_in_trash' => 'Thùng rác trống',
        'featured_image' => 'Ảnh đại diện',
        'set_featured_image' => 'Chọn ảnh đại diện',
        'remove_featured_image' => 'Bỏ ảnh đại diện',
        'use_featured_image' => 'Dùng làm ảnh đại diện',
    ];
}

add_action('init', function () {
    $common = [
        'public' => true,
        'show_in_rest' => true,
        'has_archive' => false,
        // The addresses are the app's (td_post_url); WordPress's own permalinks are not used
        'rewrite' => false,
        'query_var' => false,
    ];
    // With WooCommerce the products are its products (inc/compat.php)
    if (td_product_type() === 'td_product') {
        register_post_type('td_product', $common + [
            'labels' => td_type_labels('Sản phẩm', 'sản phẩm'),
            'menu_icon' => 'dashicons-products',
            'menu_position' => 5,
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions'],
        ]);
    }
    register_post_type('td_document', $common + [
        'labels' => td_type_labels('Tài liệu', 'tài liệu'),
        'menu_icon' => 'dashicons-media-document',
        'menu_position' => 6,
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions'],
    ]);
    register_post_type('td_job', $common + [
        'labels' => td_type_labels('Tuyển dụng', 'tin tuyển dụng'),
        'menu_icon' => 'dashicons-groups',
        'menu_position' => 7,
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions'],
    ]);
    // Form submissions from the website (api/lien-he.php); read in WP Admin, never created there
    register_post_type('td_lead', [
        'labels' => td_type_labels('Khách liên hệ', 'yêu cầu'),
        'public' => false,
        'show_ui' => true,
        'show_in_rest' => false,
        'menu_icon' => 'dashicons-email-alt',
        'menu_position' => 4,
        'supports' => ['title'],
        'capability_type' => 'post',
        'capabilities' => ['create_posts' => 'do_not_allow'],
        'map_meta_cap' => true,
    ]);
});

/** The website's address of a published post, or null for content without its own page. */
function td_post_url(WP_Post $post): ?string
{
    if ($post->post_status !== 'publish' || $post->post_name === '' || !td_is_default_language($post)) {
        return null;
    }
    switch ($post->post_type) {
        case 'post':
            return home_url('/tin-tuc/bai-viet/' . $post->post_name);
        case 'td_product':
        case 'product':
            return home_url('/san-pham/chi-tiet/' . td_product_id($post));
        case 'td_document':
            return home_url('/tai-lieu');
        case 'td_job':
            return home_url('/tuyen-dung');
    }
    return null;
}

$td_link = function ($url, $post) {
    $post = get_post($post);
    return ($post ? td_post_url($post) : null) ?? $url;
};
add_filter('post_link', $td_link, 10, 2);
add_filter('post_type_link', $td_link, 10, 2);

add_filter('term_link', function ($url, $term, $taxonomy) {
    if ($taxonomy === 'category' && isset(td_site()['newsCategories'][$term->slug])) {
        return home_url('/tin-tuc/' . $term->slug);
    }
    return $url;
}, 10, 3);

/** The three news categories of the website (Kiến thức sức khỏe, Tin y tế, Tin nội bộ). */
function td_ensure_news_categories(): void
{
    foreach (td_site()['newsCategories'] ?? [] as $slug => $name) {
        if (!get_term_by('slug', $slug, 'category')) {
            wp_insert_term($name, 'category', ['slug' => $slug]);
        }
    }
}

// On activation: pretty permalinks (the app's addresses need them) and the news categories
add_action('after_switch_theme', function () {
    if (get_option('permalink_structure') === '') {
        global $wp_rewrite;
        $wp_rewrite->set_permalink_structure('/%postname%/');
    }
    td_ensure_news_categories();
    td_bump_data_version();
    flush_rewrite_rules();
});

// ---------------------------------------------------------------------------------------------
// Front end: the app draws the whole page, so WordPress's own extras are left out.

add_filter('show_admin_bar', '__return_false');
add_filter('wp_speculation_rules_configuration', '__return_null');
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_head', 'rest_output_link_wp_head');
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'rel_canonical');
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head');
remove_action('wp_head', 'wp_robots', 1);
add_action('wp_enqueue_scripts', function () {
    foreach (['wp-block-library', 'wp-block-library-theme', 'global-styles', 'classic-theme-styles'] as $handle) {
        wp_dequeue_style($handle);
    }
}, 100);
