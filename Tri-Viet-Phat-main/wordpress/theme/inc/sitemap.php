<?php
/**
 * wp-sitemap.xml: WordPress lists the news posts and products (at the website's addresses, see
 * td_post_url); this adds the app's own pages (sections, categories, brand pages) and leaves out what has
 * no page of its own (documents, jobs, authors, other categories). The same pages are at /td-sitemap.xml
 * for Yoast SEO's sitemap index (inc/compat.php).
 */

defined('ABSPATH') || exit;

/** Sections, their categories and the brand pages. */
function td_static_routes(): array
{
    $routes = [];
    foreach (array_keys(td_tab_paths()) as $tab) {
        $routes[] = ['tab' => $tab];
        foreach (array_keys(td_category_labels($tab)) as $cat) {
            $routes[] = ['tab' => $tab, 'cat' => $cat];
        }
    }
    foreach (td_brands() as $b) {
        $routes[] = ['tab' => 'san-pham', 'brand' => $b['slug']];
    }
    return $routes;
}

add_action('init', function () {
    if (td_request_path() !== 'td-sitemap.xml' || !td_is_get()) {
        return;
    }
    header('Content-Type: application/xml; charset=UTF-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach (td_static_routes() as $route) {
        echo '<url><loc>' . esc_url(home_url(td_route_path($route))) . '</loc></url>' . "\n";
    }
    echo '</urlset>' . "\n";
    exit;
}, 2);

if (class_exists('WP_Sitemaps_Provider')) {
    class TD_Sitemap_Pages extends WP_Sitemaps_Provider
    {
        public function __construct()
        {
            $this->name = 'trang';
            $this->object_type = 'trang';
        }

        public function get_url_list($page_num, $object_subtype = '')
        {
            if ($page_num > 1) {
                return [];
            }
            return array_map(function ($route) {
                return ['loc' => home_url(td_route_path($route))];
            }, td_static_routes());
        }

        public function get_max_num_pages($object_subtype = '')
        {
            return 1;
        }
    }

    add_action('init', function () {
        wp_register_sitemap_provider('trang', new TD_Sitemap_Pages());
    });
}

add_filter('wp_sitemaps_add_provider', function ($provider, $name) {
    return $name === 'users' ? false : $provider;
}, 10, 2);

add_filter('wp_sitemaps_post_types', function ($types) {
    unset($types['td_document'], $types['td_job'], $types['attachment']);
    return $types;
});

add_filter('wp_sitemaps_taxonomies', function ($taxonomies) {
    return array_intersect_key($taxonomies, ['category' => true]);
});

add_filter('wp_sitemaps_taxonomies_query_args', function ($args, $taxonomy) {
    if ($taxonomy === 'category') {
        $args['slug'] = array_keys(td_site()['newsCategories'] ?? []);
    }
    return $args;
}, 10, 2);
