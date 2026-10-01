<?php
/**
 * Plugin Name: Trí Đức – Nhập dữ liệu
 * Description: Nhập một lần toàn bộ nội dung website Trí Đức vào WordPress: tin tức, sản phẩm, tài liệu, tuyển dụng và ảnh. Dùng cùng giao diện Trí Đức. Nhập xong có thể tắt và xóa plugin.
 * Version: 1.1.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Công ty TNHH Thương mại Dịch vụ Trí Đức
 * License: Proprietary
 * Text Domain: tri-duc-du-lieu
 *
 * data/content.json and files/ are written by wordpress/build.ts from the project's src/content and public/.
 * The import runs in short steps (admin-ajax), skips what already exists (by slug) unless asked to overwrite,
 * copies each picture once into the Media Library and points the content at it.
 * On an existing site with WooCommerce, the products go into its matching WooCommerce products (same model
 * code at the end of the address, e.g. "may-dien-giai-ac9803" <- ac9803): their description is replaced by
 * the website's (the previous one is kept in meta _td_old_content/_td_old_excerpt) and the specs are added.
 * With Polylang, new content gets the default language.
 */

defined('ABSPATH') || exit;

define('TDI_DIR', __DIR__);

add_action('admin_menu', function () {
    add_management_page('Nhập dữ liệu Trí Đức', 'Nhập dữ liệu Trí Đức', 'manage_options', 'tri-duc-nhap', 'tdi_page');
});

// Right after activation, open the import screen
add_action('activated_plugin', function ($plugin) {
    if ($plugin === plugin_basename(__FILE__) && !wp_doing_ajax() && PHP_SAPI !== 'cli' && !isset($_GET['activate-multi'])) {
        wp_safe_redirect(admin_url('tools.php?page=tri-duc-nhap'));
        exit;
    }
});

function tdi_data(): array
{
    static $data = null;
    if ($data === null) {
        $data = json_decode((string) @file_get_contents(TDI_DIR . '/data/content.json'), true) ?: ['items' => [], 'categories' => []];
    }
    return $data;
}

const TDI_TYPE_LABELS = ['td_product' => 'Sản phẩm', 'td_document' => 'Tài liệu', 'td_job' => 'Tuyển dụng', 'post' => 'Tin tức'];

function tdi_page(): void
{
    $data = tdi_data();
    $counts = array_count_values(array_column($data['items'], 'type'));
    $theme_ok = post_type_exists('td_document');
    $done = get_option('tri_duc_imported');
    ?>
<div class="wrap">
  <h1>Nhập dữ liệu Trí Đức</h1>
  <?php if (!$theme_ok) : ?>
    <div class="notice notice-error"><p>Hãy <strong>kích hoạt giao diện Trí Đức</strong> trước (Giao diện → Giao diện), rồi quay lại trang này.</p></div>
  <?php endif; ?>
  <?php if ($done) : ?>
    <div class="notice notice-success"><p>Đã nhập xong lúc <?php echo esc_html(wp_date('H:i d/m/Y', (int) $done)); ?>. Có thể nhập lại: những mục đã có sẽ được bỏ qua.</p></div>
  <?php endif; ?>
  <p>Plugin này chép toàn bộ nội dung website vào WordPress:</p>
  <ul style="list-style:disc;margin-left:20px">
    <?php foreach (TDI_TYPE_LABELS as $type => $label) : ?>
      <li><?php echo esc_html($label); ?>: <strong><?php echo (int) ($counts[$type] ?? 0); ?></strong></li>
    <?php endforeach; ?>
    <li>Ảnh được chép vào Thư viện (Media), mỗi ảnh một lần.</li>
  </ul>
  <p>Việc nhập chạy từng đợt nhỏ, mất khoảng 5–15 phút tùy hosting. <strong>Giữ trang này mở</strong> cho tới khi xong. Nếu bị ngắt giữa chừng, bấm lại nút: những mục đã nhập sẽ được bỏ qua.</p>
  <p><label><input type="checkbox" id="tdi-overwrite" /> Ghi đè các mục đã có (cùng đường dẫn) bằng nội dung gốc</label></p>
  <p><button class="button button-primary button-hero" id="tdi-start" <?php disabled(!$theme_ok); ?>>Bắt đầu nhập</button></p>
  <div id="tdi-progress" hidden>
    <div style="background:#dcdcde;border-radius:4px;height:22px;max-width:640px;overflow:hidden"><div id="tdi-bar" style="background:#2271b1;height:100%;width:0;transition:width .3s"></div></div>
    <p id="tdi-status"></p>
    <textarea id="tdi-log" readonly rows="14" class="large-text code" style="max-width:900px"></textarea>
  </div>
</div>
<script>
(function () {
  var nonce = <?php echo wp_json_encode(wp_create_nonce('tdi')); ?>;
  var btn = document.getElementById('tdi-start');
  var bar = document.getElementById('tdi-bar');
  var status = document.getElementById('tdi-status');
  var log = document.getElementById('tdi-log');
  function write(line) { log.value += line + '\n'; log.scrollTop = log.scrollHeight; }
  function step(offset, failures) {
    var body = new FormData();
    body.append('action', 'tdi_step');
    body.append('_ajax_nonce', nonce);
    body.append('offset', offset);
    body.append('overwrite', document.getElementById('tdi-overwrite').checked ? '1' : '');
    fetch(ajaxurl, { method: 'POST', body: body, credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.success) throw new Error(res && res.data ? res.data : 'Lỗi không rõ');
        res.data.log.forEach(write);
        var next = res.data.next, total = res.data.total;
        bar.style.width = Math.round(next / total * 100) + '%';
        status.textContent = 'Đã xử lý ' + next + ' / ' + total + ' mục…';
        if (next >= total) {
          status.innerHTML = '<strong>Xong!</strong> Đã nhập toàn bộ nội dung. Mở website để xem; plugin này có thể tắt và xóa.';
          btn.disabled = false;
          btn.textContent = 'Nhập lại';
          return;
        }
        step(next, 0);
      })
      .catch(function (err) {
        if (failures < 3) {
          write('… lỗi tạm thời (' + err.message + '), thử lại');
          setTimeout(function () { step(offset, failures + 1); }, 3000);
          return;
        }
        status.textContent = 'Bị dừng ở mục ' + offset + ': ' + err.message + '. Bấm nút để chạy tiếp.';
        btn.disabled = false;
        btn.textContent = 'Chạy tiếp';
        btn.dataset.offset = offset;
      });
  }
  btn.addEventListener('click', function () {
    btn.disabled = true;
    document.getElementById('tdi-progress').hidden = false;
    step(parseInt(btn.dataset.offset || '0', 10), 0);
  });
})();
</script>
<?php
}

add_action('wp_ajax_tdi_step', function () {
    check_ajax_referer('tdi');
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Bạn không có quyền nhập dữ liệu.', 403);
    }
    if (!post_type_exists('td_document')) {
        wp_send_json_error('Chưa kích hoạt giao diện Trí Đức.');
    }
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';
    @set_time_limit(120);
    // Content comes from the website as it is (iframes of videos, tables…)
    kses_remove_filters();
    // Old posts: no pingbacks to the sites they link to, no enclosure checks of every link (wp-cron)
    remove_action('publish_post', '_publish_post_hook', 5);
    wp_defer_term_counting(true);
    // Fewer resized copies per picture: the website uses the full, large and medium sizes
    add_filter('intermediate_image_sizes_advanced', function ($sizes) {
        return array_intersect_key($sizes, array_flip(['thumbnail', 'medium', 'large']));
    });

    $items = tdi_data()['items'];
    $offset = max(0, (int) ($_POST['offset'] ?? 0));
    $overwrite = !empty($_POST['overwrite']);
    $log = [];
    if ($offset === 0) {
        tdi_categories();
        $log = tdi_remove_samples();
    }
    $start = microtime(true);
    $i = $offset;
    while ($i < count($items) && ($i === $offset || microtime(true) - $start < 12)) {
        $log[] = tdi_import($items[$i], $overwrite);
        $i++;
    }
    wp_defer_term_counting(false);
    if ($i >= count($items)) {
        if (function_exists('td_bump_data_version')) {
            td_bump_data_version();
        }
        flush_rewrite_rules();
        update_option('tri_duc_imported', time(), false);
    }
    wp_send_json_success(['next' => $i, 'total' => count($items), 'log' => $log]);
});

/** Polylang's default language, or '' without Polylang. */
function tdi_lang(): string
{
    return function_exists('pll_default_language') ? (string) pll_default_language() : '';
}

function tdi_set_language(int $id, string $type): void
{
    if (tdi_lang() !== '' && function_exists('pll_set_post_language') && pll_is_translated_post_type($type)) {
        pll_set_post_language($id, tdi_lang());
    }
}

function tdi_categories(): void
{
    foreach (tdi_data()['categories'] ?? [] as $slug => $name) {
        if (!get_term_by('slug', $slug, 'category')) {
            $term = wp_insert_term($name, 'category', ['slug' => $slug]);
            if (!is_wp_error($term) && tdi_lang() !== '' && function_exists('pll_set_term_language')) {
                pll_set_term_language($term['term_id'], tdi_lang());
            }
        }
    }
}

/**
 * WordPress's sample post and page ("Hello world!", "Sample Page") of a new install would show on the website:
 * trashed while never edited. Recognised by their default address, so a real post is never touched.
 */
function tdi_remove_samples(): array
{
    $log = [];
    $samples = [
        1 => ['post', ['hello-world', sanitize_title(_x('hello-world', 'Default post slug'))]],
        2 => ['page', ['sample-page', sanitize_title(_x('sample-page', 'Default page slug'))]],
    ];
    foreach ($samples as $id => [$type, $names]) {
        $post = get_post($id);
        if ($post && $post->post_type === $type && $post->post_status === 'publish' && in_array($post->post_name, $names, true)
            && $post->post_modified === $post->post_date) {
            wp_trash_post($id);
            $log[] = '- Bỏ vào thùng rác nội dung mẫu của WordPress: ' . $post->post_title;
        }
    }
    return $log;
}

function tdi_import(array $item, bool $overwrite): string
{
    if ($item['type'] === 'td_product' && post_type_exists('product')) {
        return tdi_import_woo_product($item, $overwrite);
    }
    $label = (TDI_TYPE_LABELS[$item['type']] ?? $item['type']) . ': ' . $item['title'];
    $existing = get_posts([
        'name' => $item['slug'],
        'post_type' => $item['type'],
        'post_status' => 'any',
        'posts_per_page' => 1,
        'fields' => 'ids',
        'suppress_filters' => true,
        'lang' => '',
    ]);
    if ($existing && !$overwrite) {
        return '= ' . $label . ' (đã có, bỏ qua)';
    }

    // Never schedule: a date ahead of the server clock becomes now
    $date = $item['date'];
    if (strtotime($date) > current_time('timestamp')) {
        $date = current_time('mysql');
    }
    $post = [
        'post_type' => $item['type'],
        'post_name' => $item['slug'],
        'post_title' => $item['title'],
        'post_content' => tdi_replace_images($item['content'] ?? ''),
        'post_excerpt' => $item['excerpt'] ?? '',
        'post_status' => $item['status'] ?? 'publish',
        'post_date' => $date,
        'post_date_gmt' => get_gmt_from_date($date),
        'menu_order' => (int) ($item['order'] ?? 0),
        'comment_status' => 'closed',
        'ping_status' => 'closed',
        'post_author' => get_current_user_id(),
    ];
    if ($existing) {
        $post['ID'] = $existing[0];
    }
    $id = wp_insert_post(wp_slash($post), true);
    if (is_wp_error($id)) {
        return '! ' . $label . ': ' . $id->get_error_message();
    }
    if (!$existing) {
        tdi_set_language($id, $item['type']);
    }

    if ($item['type'] === 'post') {
        $term = !empty($item['category']) ? get_term_by('slug', $item['category'], 'category') : null;
        if ($term) {
            wp_set_post_categories($id, [$term->term_id]);
        }
    }
    foreach ($item['meta'] ?? [] as $key => $value) {
        update_post_meta($id, '_td_' . $key, wp_slash($value));
    }
    // Finished HTML: the theme shows it without WordPress's automatic paragraphs
    update_post_meta($id, '_td_html', '1');

    $note = '';
    $image = (string) ($item['image'] ?? '');
    if ($image !== '') {
        $attachment = tdi_attachment($image, $item['alt'] ?? $item['title']);
        if ($attachment) {
            set_post_thumbnail($id, $attachment);
            delete_post_meta($id, '_td_image');
        } elseif (preg_match('~^https?://~', $image)) {
            // A picture on another website stays an address, shown as it was
            update_post_meta($id, '_td_image', $image);
            $note = ' (ảnh lấy từ website khác)';
        } else {
            // Missing on the old site too: the theme shows its default photo
            $note = ' (không có file ảnh, dùng ảnh mặc định)';
        }
    }
    return ($existing ? '↻ ' : '+ ') . $label . $note;
}

/** The WooCommerce product (default language) whose address ends with the model code, or 0. */
function tdi_woo_product(string $id): int
{
    static $slugs = null;
    if ($slugs === null) {
        $slugs = [];
        $args = ['post_type' => 'product', 'post_status' => 'any', 'posts_per_page' => -1, 'suppress_filters' => true];
        foreach (get_posts($args + (tdi_lang() !== '' ? ['lang' => tdi_lang()] : [])) as $post) {
            $slugs[$post->post_name] = $post->ID;
        }
    }
    foreach ($slugs as $slug => $post_id) {
        if ($slug === $id || substr($slug, -strlen('-' . $id)) === '-' . $id) {
            return $post_id;
        }
    }
    return 0;
}

/** A product of the website into WooCommerce: the matching product gets its description and specs, else a new product. */
function tdi_import_woo_product(array $item, bool $overwrite): string
{
    $label = 'Sản phẩm: ' . $item['title'];
    $id = tdi_woo_product($item['slug']);
    if ($id && get_post_meta($id, '_td_html', true) === '1' && !$overwrite) {
        update_post_meta($id, '_td_id', $item['slug']);
        return '= ' . $label . ' (đã có, bỏ qua)';
    }
    $content = tdi_replace_images($item['content'] ?? '');
    if ($id) {
        $old = get_post($id);
        if (!metadata_exists('post', $id, '_td_old_content')) {
            add_post_meta($id, '_td_old_content', wp_slash($old->post_content));
            add_post_meta($id, '_td_old_excerpt', wp_slash($old->post_excerpt));
        }
        $result = wp_update_post(wp_slash([
            'ID' => $id,
            'post_content' => $content,
            'post_excerpt' => $item['excerpt'] ?? '',
            'menu_order' => (int) ($item['order'] ?? 0),
        ]), true);
        $note = ' (bổ sung vào sản phẩm WooCommerce "' . $old->post_title . '")';
    } else {
        $result = wp_insert_post(wp_slash([
            'post_type' => 'product',
            'post_name' => $item['slug'],
            'post_title' => $item['title'],
            'post_content' => $content,
            'post_excerpt' => $item['excerpt'] ?? '',
            'post_status' => $item['status'] ?? 'publish',
            'menu_order' => (int) ($item['order'] ?? 0),
            'comment_status' => 'closed',
            'post_author' => get_current_user_id(),
        ]), true);
        if (!is_wp_error($result)) {
            wp_set_object_terms($result, 'simple', 'product_type');
            tdi_set_language($result, 'product');
        }
        $note = ' (sản phẩm WooCommerce mới)';
    }
    if (is_wp_error($result)) {
        return '! ' . $label . ': ' . $result->get_error_message();
    }
    $id = (int) $result;
    foreach ($item['meta'] ?? [] as $key => $value) {
        update_post_meta($id, '_td_' . $key, wp_slash($value));
    }
    update_post_meta($id, '_td_html', '1');
    // Its address on the website stays /san-pham/chi-tiet/<id> (theme: td_product_id)
    update_post_meta($id, '_td_id', $item['slug']);
    // The product's own picture stays; the website's is used only when it has none
    if (!has_post_thumbnail($id) && ($attachment = tdi_attachment((string) ($item['image'] ?? ''), $item['alt'] ?? $item['title']))) {
        set_post_thumbnail($id, $attachment);
    }
    return '↻ ' . $label . $note;
}

/** Points "/uploads/…" pictures and files in a body at their copies in the Media Library. */
function tdi_replace_images(string $html): string
{
    return preg_replace_callback('~(?<=["\'\s,(=])(/uploads/[^"\'\s,)<>\\\\]+)~', function ($m) {
        $id = tdi_attachment(html_entity_decode($m[1], ENT_QUOTES, 'UTF-8'));
        return $id ? wp_get_attachment_url($id) : $m[1];
    }, $html);
}

/** The Media Library copy of a picture of the website (by its old path), copied the first time. */
function tdi_attachment(string $path, string $alt = ''): int
{
    static $cache = [];
    if (isset($cache[$path])) {
        return $cache[$path];
    }
    $found = get_posts([
        'post_type' => 'attachment',
        'post_status' => 'inherit',
        'meta_key' => '_td_source',
        'meta_value' => $path,
        'posts_per_page' => 1,
        'fields' => 'ids',
        'suppress_filters' => true,
    ]);
    if ($found) {
        return $cache[$path] = (int) $found[0];
    }
    $file = TDI_DIR . '/files' . rawurldecode($path);
    if ($path === '' || $path[0] !== '/' || strpos($path, '..') !== false || !is_file($file)) {
        return $cache[$path] = 0;
    }
    $tmp = wp_tempnam(basename($file));
    if (!$tmp || !@copy($file, $tmp)) {
        return $cache[$path] = 0;
    }
    $id = media_handle_sideload(['name' => basename($file), 'tmp_name' => $tmp], 0);
    if (is_wp_error($id)) {
        @unlink($tmp);
        return $cache[$path] = 0;
    }
    update_post_meta($id, '_td_source', $path);
    if ($alt !== '' && wp_attachment_is_image($id)) {
        update_post_meta($id, '_wp_attachment_image_alt', wp_slash($alt));
    }
    return $cache[$path] = (int) $id;
}
