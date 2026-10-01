<?php
/**
 * Running on an existing WordPress site (triducmedical.com): its plugins keep working the way its editors
 * know them.
 *   WooCommerce  the products are the WooCommerce products (menu Sản phẩm/Products), not the theme's own type;
 *                their website category comes from the product categories (or the "Thông tin sản phẩm" box)
 *   Polylang     the website shows the default language (Vietnamese); translations stay in WP Admin
 *   Yoast SEO    the SEO title/description written in Yoast's box are used; Yoast's own <head> output is left
 *                out of the app's pages (it describes WordPress's view of the address, not the page shown),
 *                and its sitemap index lists the app's own pages
 * Plugins' styles and scripts are not loaded on the app's pages (the app has its own).
 */

defined('ABSPATH') || exit;

/** WooCommerce products when WooCommerce is active, else the theme's own "Sản phẩm" type. */
function td_product_type(): string
{
    return class_exists('WooCommerce') ? 'product' : 'td_product';
}

function td_has_yoast(): bool
{
    return defined('WPSEO_VERSION');
}

/** Polylang's default language ("vi"), or '' without Polylang. */
function td_default_language(): string
{
    return function_exists('pll_default_language') ? (string) pll_default_language() : '';
}

function td_is_translated_type(string $type): bool
{
    return td_default_language() !== '' && function_exists('pll_is_translated_post_type') && pll_is_translated_post_type($type);
}

/** Query arguments that keep a query to the website's language. */
function td_lang_args(string $type): array
{
    return td_is_translated_type($type) ? ['lang' => td_default_language()] : [];
}

/** False for a translation (e.g. the English version of a product), which has no page on the website. */
function td_is_default_language(WP_Post $post): bool
{
    if (!td_is_translated_type($post->post_type) || !function_exists('pll_get_post_language')) {
        return true;
    }
    $lang = pll_get_post_language($post->ID);
    return !$lang || $lang === td_default_language();
}

/**
 * The website category of a product (may-xet-nghiem-sinh-hoa…): chosen in the "Thông tin sản phẩm" box,
 * else taken from its WooCommerce product categories ("may-xet-nghiem-nuoc-tieu-va-can-nuoc-tieu" →
 * may-xet-nghiem-nuoc-tieu), else "thiet-bi-khac".
 */
function td_product_category(WP_Post $post): string
{
    $labels = td_category_labels('san-pham');
    $own = (string) get_post_meta($post->ID, '_td_category', true);
    if (isset($labels[$own]) || $post->post_type !== 'product') {
        return $own;
    }
    $aliases = ['may-xet-nghiem-dong-mau' => 'may-phan-tich-dong-mau', 'may-ly-tam' => 'thiet-bi-khac', 'hoa-chat' => 'hoa-chat-xet-nghiem'];
    $slugs = wp_get_post_terms($post->ID, 'product_cat', ['fields' => 'slugs']);
    foreach (is_array($slugs) ? $slugs : [] as $slug) {
        foreach (array_merge(array_combine(array_keys($labels), array_keys($labels)), $aliases) as $prefix => $key) {
            if ($slug === $prefix || strpos($slug, $prefix . '-') === 0) {
                return $key;
            }
        }
    }
    return 'thiet-bi-khac';
}

/**
 * The product's id in the website's addresses (/san-pham/chi-tiet/<id>): the id it had on the website
 * (meta _td_id, set by the import, e.g. "ac9803" for the WooCommerce product "may-dien-giai-ac9803"), so
 * the addresses Google knows stay the same; else its slug.
 */
function td_product_id(WP_Post $post): string
{
    $id = (string) get_post_meta($post->ID, '_td_id', true);
    return $id !== '' ? $id : $post->post_name;
}

/** SEO title and description written in Yoast's box, with Yoast's variables (%%title%%…) filled in. */
function td_yoast_fields(WP_Post $post): array
{
    if (!td_has_yoast()) {
        return [];
    }
    $out = [];
    foreach (['seoTitle' => '_yoast_wpseo_title', 'seoDescription' => '_yoast_wpseo_metadesc'] as $field => $key) {
        $value = (string) get_post_meta($post->ID, $key, true);
        if ($value !== '' && function_exists('wpseo_replace_vars')) {
            $value = wpseo_replace_vars($value, $post);
        }
        $value = trim(wp_strip_all_tags(html_entity_decode($value, ENT_QUOTES, 'UTF-8')));
        if ($value !== '') {
            $out[$field] = $value;
        }
    }
    return $out;
}

/** Called before an app page is written: other plugins' assets and Yoast's head tags stay out of it. */
function td_isolate_page(): void
{
    add_action('wp_enqueue_scripts', function () {
        foreach ((array) wp_styles()->queue as $handle) {
            wp_dequeue_style($handle);
        }
        foreach ((array) wp_scripts()->queue as $handle) {
            wp_dequeue_script($handle);
        }
    }, PHP_INT_MAX);
    remove_all_actions('wpseo_head');
}

// Products, posts and categories of the other language have no page: Yoast's sitemap leaves them out,
// and lists the app's own pages (td-sitemap.xml, inc/sitemap.php) in its index
if (td_has_yoast()) {
    add_filter('wpseo_sitemap_entry', function ($url, $type, $object) {
        if ($type === 'post' && $object instanceof WP_Post
            && (in_array($object->post_type, ['td_document', 'td_job'], true) || !td_is_default_language($object))) {
            return false;
        }
        // A WordPress page at an address the website answers itself (/lien-he, /gio-hang → redirect…)
        if ($type === 'post' && $object instanceof WP_Post && $object->post_type === 'page') {
            $path = trim((string) parse_url((string) get_permalink($object), PHP_URL_PATH), '/');
            $redirects = td_site()['redirects'] ?? [];
            if (td_parse_route($path) !== null || isset($redirects['exact'][$path])
                || (function_exists('wc_get_page_id') && in_array($object->ID, [wc_get_page_id('cart'), wc_get_page_id('checkout'), wc_get_page_id('myaccount'), wc_get_page_id('shop')], true))) {
                return false;
            }
        }
        if ($type === 'term' && $object instanceof WP_Term && $object->taxonomy === 'category'
            && !isset(td_site()['newsCategories'][$object->slug])) {
            return false;
        }
        return $url;
    }, 10, 3);
    add_filter('wpseo_sitemap_exclude_taxonomy', function ($exclude, $taxonomy) {
        return $exclude || in_array($taxonomy, ['product_cat', 'product_tag', 'post_tag', 'post_format', 'pa_brand'], true);
    }, 10, 2);
    add_filter('wpseo_sitemap_exclude_post_type', function ($exclude, $type) {
        return $exclude || in_array($type, ['td_document', 'td_job', 'td_lead'], true);
    }, 10, 2);
    add_filter('wpseo_sitemap_exclude_author', '__return_empty_array');
    add_filter('wpseo_sitemap_index', function ($xml) {
        return $xml . '<sitemap><loc>' . esc_url(home_url('/td-sitemap.xml')) . '</loc></sitemap>' . "\n";
    });
}
