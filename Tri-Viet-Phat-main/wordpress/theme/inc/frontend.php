<?php
/**
 * Routing of the front end. Every address of the website is one of the app's pages (src/seo/routes.ts):
 * this file answers it with the page's SEO <head>, a readable copy of its content and the app, before
 * WordPress picks a template. It also serves the app's data (/?td_data=), the article bodies, the
 * enquiry form and the AI chat (/?td_api=), the theme's images at their old paths ("/images/…") and
 * the 301 redirects of the old WordPress addresses.
 */

defined('ABSPATH') || exit;

/** Path of the request below the WordPress home, decoded, without slashes at the ends. */
function td_request_path(): string
{
    $uri = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $home = rtrim((string) parse_url((string) get_option('home'), PHP_URL_PATH), '/');
    if ($home !== '' && strpos($uri, $home) === 0) {
        $uri = substr($uri, strlen($home));
    }
    return trim(rawurldecode($uri), '/');
}

/** An address on the site from its own home address (Polylang points home_url('/') at the current language). */
function td_home_url(string $path): string
{
    return untrailingslashit((string) get_option('home')) . $path;
}

function td_is_get(): bool
{
    return in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true);
}

// ---------------------------------------------------------------------------------------------
// The theme's images at the paths the app and old links use (/images/…, /partners/…, /logo-tri-duc.png,
// /favicon.ico). The app already asks for them in the theme folder; this covers links shared earlier.

add_action('init', function () {
    if (is_admin() || !td_is_get()) {
        return;
    }
    $path = td_request_path();
    if (!preg_match('~^[A-Za-z0-9._/-]+\.(png|jpe?g|webp|gif|svg|ico)$~', $path) || strpos($path, '..') !== false) {
        return;
    }
    $file = TD_DIR . '/static/' . $path;
    if (!is_file($file)) {
        return;
    }
    $types = ['png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'webp' => 'image/webp', 'gif' => 'image/gif', 'svg' => 'image/svg+xml', 'ico' => 'image/x-icon'];
    $modified = filemtime($file);
    header('Content-Type: ' . $types[strtolower(pathinfo($file, PATHINFO_EXTENSION))]);
    header('Cache-Control: public, max-age=2592000');
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $modified) . ' GMT');
    if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= $modified) {
        status_header(304);
        exit;
    }
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
}, 1);

// ---------------------------------------------------------------------------------------------
// Data and endpoints: /?td_data=<version>, /?td_api=news|lead|chat

add_action('init', function () {
    if (isset($_GET['td_data']) && td_is_get()) {
        $current = $_GET['td_data'] === td_data_version();
        header('Content-Type: application/javascript; charset=UTF-8');
        header('X-Content-Type-Options: nosniff');
        // The address carries the version, so the current one can be kept for good
        header('Cache-Control: public, ' . ($current ? 'max-age=31536000, immutable' : 'max-age=60'));
        echo 'window.__TD__=' . td_payload_json() . ';';
        exit;
    }

    $api = isset($_GET['td_api']) ? (string) $_GET['td_api'] : '';
    if ($api === 'news') {
        $post = td_news_post(sanitize_title(wp_unslash((string) ($_GET['id'] ?? ''))));
        header('Cache-Control: public, max-age=300');
        if (!$post) {
            wp_send_json(['error' => 'Không tìm thấy bài viết.'], 404);
        }
        wp_send_json(['html' => td_render_content($post)]);
    }
    if ($api === 'lead' || $api === 'chat') {
        td_run_api($api === 'lead' ? 'lien-he.php' : 'chat.php');
    }
}, 99);

/**
 * Runs the website's own endpoint (api/lien-he.php or api/chat.php, the same files as on the static hosting)
 * with its settings and data taken from WordPress (td_api_config) and enquiries saved as "Khách liên hệ".
 */
function td_run_api(string $file): void
{
    // The theme's api/td-common.php is empty: td_leads_add() below stores the enquiries
    require TD_DIR . '/api/' . $file;
    exit;
}

/** What api/lien-he.php and api/chat.php read from their config files on the static hosting. */
function td_api_config(string $name): array
{
    $list = function (string $key) {
        return array_values(array_filter(array_map('trim', preg_split('/[\s,;]+/', td_option($key)))));
    };
    switch ($name) {
        case 'telegram':
            return ['bot_token' => td_option('telegram_token'), 'chat_ids' => $list('telegram_chat_ids')];
        case 'email':
            return ['to' => $list('email_to'), 'from' => td_option('email_from')];
        case 'ai':
            $models = $list('ai_models');
            return ['gemini_api_key' => td_option('gemini_key'), 'google_search' => td_option('ai_google_search') === '1'] + ($models ? ['models' => $models] : []);
        case 'ai-knowledge':
            return td_ai_knowledge();
        case 'ai-docs':
            return td_ai_docs();
    }
    return [];
}

/** Stores a website enquiry as a "Khách liên hệ" post (api/lien-he.php calls this). */
function td_leads_add(array $lead): bool
{
    $title = trim(implode(' – ', array_filter([$lead['title'] ?? '', $lead['name'] ?? '', ($lead['phone'] ?? '') ?: ($lead['contact'] ?? '')])));
    $id = wp_insert_post([
        'post_type' => 'td_lead',
        'post_status' => 'publish',
        'post_title' => $title !== '' ? $title : 'Yêu cầu từ website',
        'post_author' => 0,
    ], true);
    if (is_wp_error($id)) {
        return false;
    }
    foreach (['kind', 'name', 'phone', 'contact', 'page'] as $key) {
        update_post_meta($id, '_td_' . $key, (string) ($lead[$key] ?? ''));
    }
    update_post_meta($id, '_td_fields', $lead['fields'] ?? []);
    return true;
}

// ---------------------------------------------------------------------------------------------
// Pages

add_action('template_redirect', 'td_route_request', 0);

function td_route_request(): void
{
    if (is_feed() || is_robots() || is_favicon() || is_trackback() || is_embed() || is_preview()
        || get_query_var('sitemap') || get_query_var('sitemap-stylesheet')) {
        return;
    }
    $path = td_request_path();
    if ($path === 'sitemap.xml' || strpos($path, 'wp-sitemap') === 0) {
        return;
    }

    // Addresses of the old WordPress site, kept for their Google rankings (public/.htaccess in the project):
    // exact pages first, then whole sections (tag/…, en/…)
    $redirects = td_site()['redirects'] ?? [];
    $target = $redirects['exact'][$path] ?? null;
    foreach ($target === null ? ($redirects['prefixes'] ?? []) : [] as $prefix => $to) {
        if ($path === $prefix || strpos($path, $prefix . '/') === 0) {
            $target = $to;
            break;
        }
    }
    if ($target !== null) {
        wp_redirect(td_home_url($target), 301, 'Tri Duc');
        exit;
    }

    $route = td_parse_route($path);

    // WordPress's own address of a post or category (?p=123, /bai-viet/, /category/…) → the website's
    if (is_singular() || is_category()) {
        $object = get_queried_object();
        $target = is_singular() ? td_post_url($object) : (isset(td_category_labels('tin-tuc')[$object->slug]) ? home_url('/tin-tuc/' . $object->slug) : null);
        if ($target && (!$route || !empty($_GET))) {
            wp_redirect($target, 301, 'Tri Duc');
            exit;
        }
        if (!$route && is_page()) {
            // A page made in Trang (Pages) that the app has no screen for: index.php shows it plainly
            return;
        }
    }

    if ($route) {
        // One address per page: "/gioi-thieu/" and "/gioi-thieu.html" → "/gioi-thieu"
        $canonical = td_route_path($route);
        $requested = '/' . $path . (substr((string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), -1) === '/' && $path !== '' ? '/' : '');
        if ($requested !== $canonical) {
            $query = (string) parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_QUERY);
            wp_redirect(td_home_url($canonical) . ($query !== '' ? '?' . $query : ''), 301, 'Tri Duc');
            exit;
        }
    }

    td_render_page($route);
    exit;
}

/** The app's files from app/manifest.json (written by the build). */
function td_app_assets(): array
{
    $manifest = td_json_file('../app/manifest');
    $entry = $manifest['index.html'] ?? [];
    $base = get_template_directory_uri() . '/app/';
    return [
        'js' => isset($entry['file']) ? $base . $entry['file'] : '',
        'css' => array_map(function ($f) use ($base) {
            return $base . $f;
        }, $entry['css'] ?? []),
    ];
}

function td_render_page(?array $route): void
{
    $status = $route ? 200 : 404;
    $route = $route ?: ['tab' => 'trang-chu'];
    td_isolate_page();
    status_header($status);
    header('Content-Type: text/html; charset=UTF-8');
    if ($status === 404) {
        nocache_headers();
    }

    $meta = td_seo_for($route);
    $article = null;
    if (!empty($route['articleId']) && ($post = td_news_post($route['articleId']))) {
        $article = ['id' => $route['articleId'], 'html' => td_render_content($post)];
    }
    $faq = td_page_faq($route);
    $assets = td_app_assets();
    $company = td_company();
    $ga = td_option('ga_id');
    $gtag = td_option('gtag_id');
    $verification = td_option('site_verification');
    $noindex = $status === 404 || !get_option('blog_public');
    $json = function ($data) {
        return wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
    };
    ?>
<!doctype html>
<html lang="vi">
  <head>
<?php if ($ga !== '') : ?>
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo esc_attr($gtag !== '' ? $gtag : $ga); ?>"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', <?php echo $json($ga); ?>);
    </script>
<?php endif; ?>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
<?php if ($verification !== '') : ?>
    <meta name="google-site-verification" content="<?php echo esc_attr($verification); ?>" />
<?php endif; ?>
    <meta name="robots" content="<?php echo $noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'; ?>" />
<?php if (!has_site_icon()) : ?>
    <link rel="icon" href="<?php echo esc_url(td_static_url('/favicon.ico')); ?>" sizes="48x48" />
    <link rel="icon" type="image/png" sizes="192x192" href="<?php echo esc_url(td_static_url('/favicon-192.png')); ?>" />
    <link rel="apple-touch-icon" href="<?php echo esc_url(td_static_url('/apple-touch-icon.png')); ?>" />
<?php endif; ?>
    <?php echo td_head_tags($meta); ?>

    <?php echo td_organization_ld(); ?>

<?php if ($faq) : ?>
    <?php echo td_faq_ld($faq); ?>

<?php endif; ?>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
<?php foreach ($assets['css'] as $css) : ?>
    <link rel="stylesheet" href="<?php echo esc_url($css); ?>" />
<?php endforeach; ?>
<?php wp_head(); ?>
  </head>
  <body class="bg-[#f8f9ff] text-[#0b1c30] antialiased overflow-x-hidden">
<?php wp_body_open(); ?>
    <div id="root"><?php echo td_fallback_body($route, $meta, $article['html'] ?? ''); ?></div>
    <script src="<?php echo esc_url(home_url('/?td_data=' . rawurlencode(td_data_version()))); ?>"></script>
<?php if ($article) : ?>
    <script>window.__TD__ && (window.__TD__.article = <?php echo $json($article); ?>);</script>
<?php endif; ?>
<?php if ($assets['js'] !== '') : ?>
    <script type="module" src="<?php echo esc_url($assets['js']); ?>"></script>
<?php endif; ?>
<?php wp_footer(); ?>
  </body>
</html>
<?php
}

/**
 * A draft preview, or a page made in Trang (Pages) that the app has no screen for: shown with a plain layout
 * (logo, title, content, contact line), since the app only knows the website's own pages.
 */
function td_render_simple_page(): void
{
    $company = td_company();
    $home = home_url('/');
    ?>
<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo esc_html(wp_strip_all_tags(single_post_title('', false) ?: get_bloginfo('name'))); ?></title>
  <?php wp_head(); ?>
  <style>
    body { margin: 0; font-family: Inter, system-ui, sans-serif; color: #111; background: #f8f9ff; line-height: 1.7; }
    header, footer { background: #0a2540; color: #fff; }
    header .wrap { display: flex; align-items: center; gap: 16px; }
    header img { height: 44px; }
    header a { color: #fff; text-decoration: none; }
    .wrap { max-width: 900px; margin: 0 auto; padding: 16px; }
    main .wrap { background: #fff; margin-top: 24px; margin-bottom: 24px; border-radius: 12px; padding: 24px; }
    main img { max-width: 100%; height: auto; }
    footer { font-size: 14px; }
    footer a { color: #fff; }
  </style>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
  <header><div class="wrap">
    <a href="<?php echo esc_url($home); ?>"><img src="<?php echo esc_url(td_static_url((string) ($company['logoUrl'] ?? '/logo-tri-duc.png'))); ?>" alt="<?php echo esc_attr($company['name'] ?? ''); ?>" /></a>
    <a href="<?php echo esc_url($home); ?>">← Về trang chủ</a>
  </div></header>
  <main><div class="wrap">
<?php while (have_posts()) : the_post(); ?>
    <h1><?php the_title(); ?></h1>
    <?php the_content(); ?>
<?php endwhile; ?>
<?php if (!have_posts() && !in_the_loop()) : ?>
    <h1>Không tìm thấy trang</h1>
<?php endif; ?>
  </div></main>
  <footer><div class="wrap">
    <?php echo esc_html($company['name'] ?? ''); ?> – <?php echo esc_html($company['address'] ?? ''); ?>.
    Hotline: <a href="tel:<?php echo esc_attr(str_replace('.', '', (string) ($company['hotline'] ?? ''))); ?>"><?php echo esc_html($company['hotline'] ?? ''); ?></a>
  </div></footer>
<?php wp_footer(); ?>
</body>
</html>
<?php
}
