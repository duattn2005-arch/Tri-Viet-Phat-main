<?php
/**
 * wp-sitemap.xml: WordPress lists the news posts and products (at the website's addresses, see
 * td_post_url); this adds the app's own pages (sections, categories, brand pages) and leaves out what has
 * no page of its own (documents, jobs, authors, other categories).
 */

defined('ABSPATH') || exit;

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
            return array_map(function ($route) {
                return ['loc' => home_url(td_route_path($route))];
            }, $routes);
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
