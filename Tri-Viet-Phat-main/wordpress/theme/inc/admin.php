<?php
/**
 * WP Admin: the product / job / SEO fields in the editor, the enquiries list ("Khách liên hệ") and the
 * "Trí Đức" screen, where the page texts and settings of the project's src/content/pages and
 * src/content/settings are edited. Its forms are built from data/schema.json, the field list of the
 * project's previous editor (public/admin/decap/config.yml), with the same Vietnamese labels.
 */

defined('ABSPATH') || exit;

// ---------------------------------------------------------------------------------------------
// Editor boxes

add_action('add_meta_boxes', function () {
    add_meta_box('td_product', 'Thông tin sản phẩm', 'td_product_box', 'td_product', 'normal', 'high');
    add_meta_box('td_job', 'Thông tin tuyển dụng', 'td_job_box', 'td_job', 'normal', 'high');
    foreach (['post', 'td_product', 'td_document'] as $type) {
        add_meta_box('td_seo', 'SEO trên Google', 'td_seo_box', $type, 'normal', 'default');
    }
    add_meta_box('td_lead', 'Nội dung yêu cầu', 'td_lead_box', 'td_lead', 'normal', 'high');
    remove_meta_box('submitdiv', 'td_lead', 'side');
});

function td_box_css(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;
    echo '<style>.td-box p{margin:0 0 14px}.td-box label{display:block;font-weight:600;margin-bottom:4px}.td-box .description{margin-top:4px}</style>';
}

function td_input(string $name, string $label, string $value, string $hint = '', bool $multiline = false, int $rows = 4): void
{
    echo '<p><label for="' . esc_attr($name) . '">' . esc_html($label) . '</label>';
    if ($multiline) {
        echo '<textarea class="large-text" rows="' . $rows . '" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '">' . esc_textarea($value) . '</textarea>';
    } else {
        echo '<input type="text" class="large-text" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '" />';
    }
    if ($hint !== '') {
        echo '<span class="description">' . esc_html($hint) . '</span>';
    }
    echo '</p>';
}

/** One per line; "a: b" / "a | b" lines for the label–value lists. */
function td_lines_from(array $items, string $a = '', string $b = '', string $sep = ': '): string
{
    return implode("\n", array_map(function ($item) use ($a, $b, $sep) {
        return $a === '' ? (string) $item : ($item[$a] ?? '') . $sep . ($item[$b] ?? '');
    }, $items));
}

function td_lines_to(string $text, string $a = '', string $b = '', string $sep = ':'): array
{
    $out = [];
    foreach (preg_split('/\r\n|\r|\n/', $text) as $line) {
        $line = trim($line);
        if ($line === '') {
            continue;
        }
        if ($a === '') {
            $out[] = $line;
            continue;
        }
        $at = strpos($line, $sep);
        $out[] = $at === false
            ? [$a => $line, $b => '']
            : [$a => trim(substr($line, 0, $at)), $b => trim(substr($line, $at + strlen($sep)))];
    }
    return $out;
}

function td_product_box(WP_Post $post): void
{
    td_box_css();
    wp_nonce_field('td_meta', 'td_meta_nonce');
    $meta = function ($field) use ($post) {
        return td_meta($post, $field);
    };
    $list = function ($field) use ($meta) {
        $v = $meta($field);
        return is_array($v) ? $v : [];
    };
    echo '<div class="td-box">';
    echo '<p><label for="td_category">Danh mục</label><select id="td_category" name="td[category]"><option value="">— Chọn danh mục —</option>';
    foreach (td_category_labels('san-pham') as $value => $label) {
        echo '<option value="' . esc_attr($value) . '"' . selected($meta('category'), $value, false) . '>' . esc_html($label) . '</option>';
    }
    echo '</select></p>';
    echo '<p class="description">Mô tả ngắn của sản phẩm là ô <strong>Tóm tắt</strong> (Excerpt); ảnh sản phẩm là <strong>Ảnh đại diện</strong>; '
        . 'ô soạn thảo chính là bài giới thiệu chi tiết (có thì thay cho phần đặc điểm kỹ thuật). Ô <strong>Thứ tự</strong> (Thuộc tính) quyết định vị trí: số nhỏ hiện trước.</p>';
    foreach (td_product_text_fields() as $field => $label) {
        td_input("td[$field]", $label, (string) $meta($field));
    }
    td_input('td[fullDesc]', 'Mô tả đầy đủ', (string) $meta('fullDesc'), '', true);
    td_input('td[specs]', 'Thông số kỹ thuật', td_lines_from($list('specs'), 'label', 'value'), 'Mỗi dòng một thông số, dạng "Tên thông số: Giá trị".', true, 8);
    td_input('td[features]', 'Đặc điểm nổi bật', td_lines_from($list('features')), 'Mỗi dòng một đặc điểm.', true, 5);
    td_input('td[detailedFeatures]', 'Tính năng chi tiết', td_lines_from($list('detailedFeatures'), 'title', 'desc', ' | '), 'Mỗi dòng một tính năng, dạng "Tiêu đề | Mô tả".', true, 6);
    td_input('td[benefits]', 'Lợi ích', td_lines_from($list('benefits')), 'Mỗi dòng một lợi ích.', true, 4);
    td_input('td[certifications]', 'Chứng nhận', td_lines_from($list('certifications')), 'Mỗi dòng một chứng nhận, ví dụ CE Mark.', true, 3);
    echo '</div>';
}

function td_job_box(WP_Post $post): void
{
    td_box_css();
    wp_nonce_field('td_meta', 'td_meta_nonce');
    echo '<div class="td-box">';
    td_input('td[quantity]', 'Số lượng', (string) td_meta($post, 'quantity'), 'Ví dụ: 02 người');
    td_input('td[location]', 'Nơi làm việc', (string) td_meta($post, 'location'), 'Ví dụ: Hà Nội');
    echo '</div>';
}

function td_seo_box(WP_Post $post): void
{
    td_box_css();
    wp_nonce_field('td_meta', 'td_meta_nonce');
    echo '<div class="td-box">';
    td_input('td[seoTitle]', 'Tiêu đề trên Google', (string) td_meta($post, 'seoTitle'), 'Bỏ trống thì dùng tiêu đề. Tối đa khoảng 60 ký tự.');
    td_input('td[seoDescription]', 'Mô tả trên Google', (string) td_meta($post, 'seoDescription'), 'Bỏ trống thì dùng tóm tắt. Khoảng 120–160 ký tự.', true, 3);
    echo '</div>';
}

add_action('save_post', function ($post_id, $post) {
    if (!isset($_POST['td_meta_nonce']) || !wp_verify_nonce($_POST['td_meta_nonce'], 'td_meta')
        || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || !current_user_can('edit_post', $post_id) || wp_is_post_revision($post_id)) {
        return;
    }
    $in = wp_unslash((array) ($_POST['td'] ?? []));
    $text = function ($key) use ($in) {
        return sanitize_textarea_field((string) ($in[$key] ?? ''));
    };
    $fields = [];
    if ($post->post_type === 'td_product') {
        foreach (array_merge(['category', 'fullDesc'], array_keys(td_product_text_fields())) as $key) {
            $fields[$key] = $text($key);
        }
        $fields['specs'] = td_lines_to($text('specs'), 'label', 'value');
        $fields['features'] = td_lines_to($text('features'));
        $fields['detailedFeatures'] = td_lines_to($text('detailedFeatures'), 'title', 'desc', '|');
        $fields['benefits'] = td_lines_to($text('benefits'));
        $fields['certifications'] = td_lines_to($text('certifications'));
    }
    if ($post->post_type === 'td_job') {
        $fields['quantity'] = $text('quantity');
        $fields['location'] = $text('location');
    }
    if (in_array($post->post_type, ['post', 'td_product', 'td_document'], true)) {
        $fields['seoTitle'] = $text('seoTitle');
        $fields['seoDescription'] = $text('seoDescription');
    }
    foreach ($fields as $key => $value) {
        update_post_meta($post_id, '_td_' . $key, $value);
    }
}, 10, 2);

// ---------------------------------------------------------------------------------------------
// Enquiries ("Khách liên hệ")

const TD_LEAD_KINDS = [
    'lien-he' => 'Liên hệ',
    'tu-van' => 'Tư vấn / báo giá',
    'bao-gia' => 'Hợp tác / báo giá',
    'sua-chua' => 'Bảo trì / sửa chữa',
    'san-pham' => 'Báo giá sản phẩm',
    'ung-tuyen' => 'Ứng tuyển',
    'dang-ky-tin' => 'Đăng ký nhận tin',
];

function td_lead_box(WP_Post $post): void
{
    $fields = td_meta($post, 'fields');
    echo '<table class="widefat striped"><tbody>';
    echo '<tr><th style="width:180px">Loại yêu cầu</th><td>' . esc_html(TD_LEAD_KINDS[td_meta($post, 'kind')] ?? td_meta($post, 'kind')) . '</td></tr>';
    echo '<tr><th>Thời gian</th><td>' . esc_html(get_the_date('H:i d/m/Y', $post)) . '</td></tr>';
    foreach (is_array($fields) ? $fields : [] as $row) {
        echo '<tr><th>' . esc_html($row[0] ?? '') . '</th><td>' . nl2br(esc_html($row[1] ?? '')) . '</td></tr>';
    }
    $page = (string) td_meta($post, 'page');
    if ($page !== '') {
        echo '<tr><th>Gửi từ trang</th><td><a href="' . esc_url($page) . '" target="_blank" rel="noopener">' . esc_html($page) . '</a></td></tr>';
    }
    echo '</tbody></table>';
    echo '<p><a class="button" href="' . esc_url(admin_url('edit.php?post_type=td_lead')) . '">← Danh sách</a> ';
    echo '<a class="button button-link-delete" href="' . esc_url(get_delete_post_link($post->ID)) . '">Xóa yêu cầu này</a></p>';
}

add_filter('manage_td_lead_posts_columns', function () {
    return ['cb' => '<input type="checkbox" />', 'title' => 'Yêu cầu', 'td_kind' => 'Loại', 'td_phone' => 'Điện thoại / Email', 'date' => 'Thời gian'];
});
add_action('manage_td_lead_posts_custom_column', function ($column, $post_id) {
    $post = get_post($post_id);
    if ($column === 'td_kind') {
        echo esc_html(TD_LEAD_KINDS[td_meta($post, 'kind')] ?? '');
    } elseif ($column === 'td_phone') {
        $phone = (string) td_meta($post, 'phone');
        echo $phone !== '' ? '<a href="tel:' . esc_attr($phone) . '">' . esc_html($phone) . '</a>' : esc_html((string) td_meta($post, 'contact'));
    }
}, 10, 2);
add_filter('post_row_actions', function ($actions, $post) {
    if ($post->post_type === 'td_lead') {
        unset($actions['inline hide-if-no-js']);
    }
    return $actions;
}, 10, 2);

add_filter('manage_td_product_posts_columns', function ($columns) {
    return array_slice($columns, 0, 1, true) + ['td_image' => 'Ảnh'] + array_slice($columns, 1, 1, true)
        + ['td_category' => 'Danh mục', 'td_order' => 'Thứ tự'] + array_slice($columns, 2, null, true);
});
add_action('manage_td_product_posts_custom_column', function ($column, $post_id) {
    $post = get_post($post_id);
    if ($column === 'td_image') {
        echo get_the_post_thumbnail($post_id, [48, 48]);
    } elseif ($column === 'td_category') {
        echo esc_html(td_category_labels('san-pham')[td_meta($post, 'category')] ?? '');
    } elseif ($column === 'td_order') {
        echo (int) $post->menu_order;
    }
}, 10, 2);

// The list of products opens in the website's order
add_action('pre_get_posts', function ($query) {
    if ($query->is_main_query() && in_array($query->get('post_type'), ['td_product', 'td_document', 'td_job'], true) && !$query->get('orderby')) {
        $query->set('orderby', ['menu_order' => 'ASC', 'date' => 'DESC']);
    }
});

// ---------------------------------------------------------------------------------------------
// "Trí Đức" screen

add_action('admin_menu', function () {
    add_menu_page('Trí Đức', 'Trí Đức', 'manage_options', 'tri-duc', 'td_admin_page', 'dashicons-admin-site-alt3', 3);
});

/** The page-text and settings files of data/schema.json, by name. */
function td_schema_files(): array
{
    $out = [];
    foreach (td_json_file('schema')['groups'] ?? [] as $group) {
        foreach ($group['files'] as $file) {
            $out[$file['name']] = $file + ['group' => $group['label']];
        }
    }
    return $out;
}

function td_admin_page(): void
{
    $files = td_schema_files();
    $tab = sanitize_key($_GET['tab'] ?? '') ?: 'ket-noi';
    if ($tab !== 'ket-noi' && !isset($files[$tab])) {
        $tab = 'ket-noi';
    }
    $url = function ($t) {
        return admin_url('admin.php?page=tri-duc&tab=' . $t);
    };
    echo '<div class="wrap td-admin"><h1>Trí Đức — nội dung và cài đặt website</h1>';
    if (isset($_GET['saved'])) {
        echo '<div class="notice notice-success is-dismissible"><p>Đã lưu. Website cập nhật ngay.</p></div>';
    }
    if (isset($_GET['error'])) {
        echo '<div class="notice notice-error"><p>' . esc_html(wp_unslash((string) $_GET['error'])) . '</p></div>';
    }
    echo '<div class="td-layout"><nav class="td-nav">';
    echo '<a class="' . ($tab === 'ket-noi' ? 'current' : '') . '" href="' . esc_url($url('ket-noi')) . '">Kết nối &amp; mã theo dõi</a>';
    $group = '';
    foreach ($files as $name => $file) {
        if ($file['group'] !== $group) {
            $group = $file['group'];
            echo '<h3>' . esc_html($group) . '</h3>';
        }
        echo '<a class="' . ($tab === $name ? 'current' : '') . '" href="' . esc_url($url($name)) . '">' . esc_html($file['label']) . '</a>';
    }
    echo '</nav><div class="td-main">';
    echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
    echo '<input type="hidden" name="action" value="td_save" /><input type="hidden" name="tab" value="' . esc_attr($tab) . '" />';
    wp_nonce_field('td_save');
    if ($tab === 'ket-noi') {
        td_settings_form();
    } else {
        td_content_form($files[$tab]);
    }
    echo '</form></div></div></div>';
    td_admin_assets();
}

function td_settings_form(): void
{
    $fields = [
        'Form liên hệ trên website gửi về Telegram và email; mỗi yêu cầu cũng được lưu ở mục "Khách liên hệ".',
        ['telegram_token', 'Telegram — Bot token', 'Lấy từ @BotFather, dạng 123456789:AA…', 'secret'],
        ['telegram_chat_ids', 'Telegram — Chat ID nhận tin', 'Người hoặc nhóm nhận tin (nhóm có dạng -100…). Nhiều ID cách nhau bằng dấu phẩy.'],
        ['email_to', 'Email nhận yêu cầu', 'Nhiều địa chỉ cách nhau bằng dấu phẩy.'],
        ['email_from', 'Email người gửi', 'Địa chỉ thuộc tên miền của website, ví dụ noreply@ten-mien.com. Bỏ trống thì dùng noreply@<tên miền>.'],
        'Trợ lý AI (bong bóng chat góc màn hình). Không có API key thì trợ lý trả lời theo danh mục sản phẩm.',
        ['gemini_key', 'Gemini API key', 'Tạo miễn phí tại https://aistudio.google.com/apikey', 'secret'],
        ['ai_models', 'Model Gemini', 'Thử lần lượt từ trái sang phải, cách nhau bằng dấu phẩy.'],
        ['ai_google_search', 'Cho trợ lý tìm Google', 'Cần gói Gemini trả phí (gói miễn phí báo lỗi 429).', 'checkbox'],
        'Google',
        ['ga_id', 'Google Analytics — Measurement ID', 'Dạng G-XXXXXXXXXX. Bỏ trống để tắt Google Analytics.'],
        ['gtag_id', 'Google tag — mã thẻ tải gtag.js', 'Dạng GT-XXXXXXX; bỏ trống thì tải bằng Measurement ID.'],
        ['site_verification', 'Google Search Console — mã xác minh (thẻ meta)', 'Chỉ phần content của thẻ google-site-verification.'],
    ];
    echo '<table class="form-table" role="presentation">';
    foreach ($fields as $f) {
        if (is_string($f)) {
            echo '</table><h2>' . esc_html($f) . '</h2><table class="form-table" role="presentation">';
            continue;
        }
        [$key, $label, $hint] = $f;
        $type = $f[3] ?? 'text';
        $value = td_option($key);
        echo '<tr><th scope="row"><label for="td_' . esc_attr($key) . '">' . esc_html($label) . '</label></th><td>';
        if ($type === 'checkbox') {
            echo '<input type="hidden" name="td_settings[' . esc_attr($key) . ']" value="" />';
            echo '<label><input type="checkbox" id="td_' . esc_attr($key) . '" name="td_settings[' . esc_attr($key) . ']" value="1"' . checked($value, '1', false) . ' /> Bật</label>';
        } elseif ($type === 'secret') {
            // Saved secrets are not shown again; an empty box keeps them
            echo '<input type="password" autocomplete="new-password" class="regular-text" id="td_' . esc_attr($key) . '" name="td_settings[' . esc_attr($key) . ']" value="" placeholder="'
                . esc_attr($value !== '' ? '•••••••• (đã lưu — để trống nếu không đổi)' : '') . '" />';
            if ($value !== '') {
                echo ' <label><input type="checkbox" name="td_clear[]" value="' . esc_attr($key) . '" /> Xóa</label>';
            }
        } else {
            echo '<input type="text" class="large-text" id="td_' . esc_attr($key) . '" name="td_settings[' . esc_attr($key) . ']" value="' . esc_attr($value) . '" />';
        }
        echo '<p class="description">' . esc_html($hint) . '</p></td></tr>';
    }
    echo '</table>';
    submit_button('Lưu cài đặt');
}

function td_content_form(array $file): void
{
    $value = td_content($file['name']);
    $saved = get_option('tri_duc_content', []);
    echo '<h2>' . esc_html($file['label']) . '</h2>';
    echo '<p class="description">' . (isset($saved[$file['name']]) ? 'Đang dùng nội dung đã sửa.' : 'Đang dùng nội dung mặc định của giao diện.') . ' Ảnh: bấm "Chọn ảnh" để lấy từ Thư viện.</p>';
    foreach ($file['fields'] as $field) {
        echo td_field_html($field, $value[$field['name']] ?? null, 'td_content[' . $field['name'] . ']', 0);
    }
    $json = wp_json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    echo '<details class="td-json"><summary>Sửa dạng JSON (nâng cao)</summary><p class="description">Chỉ dùng khi cần đổi cấu trúc. Nếu sửa ở đây, nội dung JSON sẽ được lưu thay cho các ô ở trên.</p>';
    echo '<textarea name="td_json" rows="16" class="large-text code">' . esc_textarea($json) . '</textarea></details>';
    echo '<p class="submit"><button type="submit" class="button button-primary">Lưu thay đổi</button> ';
    if (isset($saved[$file['name']])) {
        echo '<button type="submit" name="td_reset" value="1" class="button" onclick="return confirm(\'Bỏ mọi chỉnh sửa của mục này và dùng lại nội dung mặc định?\')">Khôi phục mặc định</button>';
    }
    echo '</p>';
}

function td_field_label(array $f): string
{
    return '<span class="td-label">' . esc_html($f['label'] ?? $f['name']) . '</span>'
        . (!empty($f['hint']) ? '<span class="description">' . esc_html($f['hint']) . '</span>' : '');
}

/** Form control for one field of the schema (Decap widgets: string, text, number, boolean, select, image, file, object, list). */
function td_field_html(array $f, $value, string $name, int $depth): string
{
    $widget = $f['widget'] ?? 'string';
    $attr = 'name="' . esc_attr($name) . '"';
    switch ($widget) {
        case 'text':
        case 'markdown':
        case 'html':
            return '<div class="td-field">' . td_field_label($f) . '<textarea ' . $attr . ' rows="' . ($widget === 'text' ? 3 : 8) . '" class="large-text">'
                . esc_textarea((string) $value) . '</textarea></div>';
        case 'number':
            return '<div class="td-field">' . td_field_label($f) . '<input type="number" ' . $attr . ' value="' . esc_attr((string) $value) . '"'
                . (isset($f['min']) ? ' min="' . (int) $f['min'] . '"' : '') . (isset($f['max']) ? ' max="' . (int) $f['max'] . '"' : '') . ' class="small-text" /></div>';
        case 'boolean':
            return '<div class="td-field"><input type="hidden" ' . $attr . ' value="0" /><label><input type="checkbox" ' . $attr . ' value="1"'
                . checked(!empty($value), true, false) . ' /> ' . esc_html($f['label'] ?? $f['name']) . '</label>'
                . (!empty($f['hint']) ? '<span class="description">' . esc_html($f['hint']) . '</span>' : '') . '</div>';
        case 'select':
            $html = '<div class="td-field">' . td_field_label($f) . '<select ' . $attr . '><option value="">—</option>';
            foreach ($f['options'] ?? [] as $o) {
                $v = is_array($o) ? (string) $o['value'] : (string) $o;
                $l = is_array($o) ? (string) $o['label'] : (string) $o;
                $html .= '<option value="' . esc_attr($v) . '"' . selected((string) $value, $v, false) . '>' . esc_html($l) . '</option>';
            }
            return $html . '</select></div>';
        case 'image':
        case 'file':
            $src = td_static_url((string) $value);
            return '<div class="td-field td-media-field">' . td_field_label($f) . '<span class="td-media-row"><input type="text" ' . $attr . ' value="' . esc_attr((string) $value) . '" class="large-text" />'
                . '<button type="button" class="button td-media" data-type="' . $widget . '">' . ($widget === 'image' ? 'Chọn ảnh' : 'Chọn file') . '</button></span>'
                . ($widget === 'image' ? '<img class="td-preview" src="' . esc_url($src) . '" alt=""' . ($src === '' ? ' hidden' : '') . ' />' : '') . '</div>';
        case 'object':
            $html = '<details class="td-object"' . (empty($f['collapsed']) ? ' open' : '') . '><summary>' . esc_html($f['label'] ?? $f['name']) . '</summary>';
            foreach ($f['fields'] ?? [] as $sub) {
                $html .= td_field_html($sub, is_array($value) ? ($value[$sub['name']] ?? null) : null, $name . '[' . $sub['name'] . ']', $depth);
            }
            return $html . '</details>';
        case 'list':
            if (empty($f['fields'])) {
                // A list of single values: one per line
                return '<div class="td-field">' . td_field_label($f) . '<textarea ' . $attr . ' rows="5" class="large-text">'
                    . esc_textarea(implode("\n", array_map('strval', is_array($value) ? $value : []))) . '</textarea><span class="description">Mỗi dòng một mục.</span></div>';
            }
            $singular = $f['label_singular'] ?? 'mục';
            $items = '';
            foreach (array_values(is_array($value) ? $value : []) as $i => $item) {
                $items .= td_list_item($f, is_array($item) ? $item : [], $name . '[' . $i . ']', $depth, false);
            }
            $placeholder = '__i' . $depth . '__';
            return '<div class="td-field td-list" data-depth="' . $depth . '">' . td_field_label($f) . '<div class="td-items">' . $items . '</div>'
                . '<template>' . td_list_item($f, [], $name . '[' . $placeholder . ']', $depth, true) . '</template>'
                . '<button type="button" class="button td-add">+ Thêm ' . esc_html($singular) . '</button></div>';
    }
    return '<div class="td-field">' . td_field_label($f) . '<input type="text" ' . $attr . ' value="' . esc_attr(is_scalar($value) ? (string) $value : '') . '" class="large-text" /></div>';
}

function td_list_item(array $f, array $item, string $name, int $depth, bool $open): string
{
    $names = array_column($f['fields'], 'name');
    $extra = array_diff_key($item, array_flip($names));
    // The list's summary template of the schema ("{{fields.title}} — {{fields.facility}}"), else the first text field
    $summary = preg_replace_callback('/\{\{fields\.(\w+)\}\}/', function ($m) use ($item) {
        return is_scalar($item[$m[1]] ?? null) ? (string) $item[$m[1]] : '';
    }, (string) ($f['summary'] ?? ''));
    $summary = preg_replace('/^[\s—-]+|[\s—-]+$/u', '', $summary);
    foreach ($summary === '' ? $f['fields'] : [] as $sub) {
        if (isset($item[$sub['name']]) && is_string($item[$sub['name']]) && $item[$sub['name']] !== '' && in_array($sub['widget'] ?? 'string', ['string', 'text'], true)) {
            $summary = $item[$sub['name']];
            break;
        }
    }
    $html = '<details class="td-item"' . ($open ? ' open' : '') . '><summary><span class="td-summary">' . esc_html($summary !== '' ? $summary : ucfirst($f['label_singular'] ?? 'Mục') . ' mới') . '</span>'
        . '<span class="td-tools"><button type="button" class="button-link td-up" title="Lên">↑</button><button type="button" class="button-link td-down" title="Xuống">↓</button>'
        . '<button type="button" class="button-link td-remove">Xóa</button></span></summary>';
    if ($extra) {
        $html .= '<input type="hidden" name="' . esc_attr($name . '[__extra]') . '" value="' . esc_attr(wp_json_encode($extra, JSON_UNESCAPED_UNICODE)) . '" />';
    }
    foreach ($f['fields'] as $sub) {
        $html .= td_field_html($sub, $item[$sub['name']] ?? null, $name . '[' . $sub['name'] . ']', $depth + 1);
    }
    return $html . '</details>';
}

/** Rebuilds the saved data of a file from the posted form, following the schema; keys it does not know are kept. */
function td_collect(array $fields, $posted, $current): array
{
    $posted = is_array($posted) ? $posted : [];
    $out = is_array($current) ? array_diff_key($current, array_flip(array_column($fields, 'name'))) : [];
    foreach ($fields as $f) {
        $out[$f['name']] = td_collect_value($f, $posted[$f['name']] ?? null, is_array($current) ? ($current[$f['name']] ?? null) : null);
    }
    return $out;
}

function td_collect_value(array $f, $v, $current)
{
    switch ($f['widget'] ?? 'string') {
        case 'number':
            if ($v === null || $v === '') {
                return $current;
            }
            return ($f['value_type'] ?? '') === 'float' ? (float) $v : (int) $v;
        case 'boolean':
            return !empty($v) && $v !== '0';
        case 'object':
            return td_collect($f['fields'] ?? [], $v, $current);
        case 'image':
        case 'file':
            return esc_url_raw(trim((string) $v));
        case 'list':
            if (empty($f['fields'])) {
                return array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', (string) $v)), 'strlen'));
            }
            $items = [];
            foreach (is_array($v) ? $v : [] as $item) {
                $extra = is_array($item) && isset($item['__extra']) ? (json_decode((string) $item['__extra'], true) ?: []) : [];
                $items[] = td_collect($f['fields'], $item, $extra);
            }
            return $items;
    }
    // Page texts are shown as text by the app (or as Markdown), so they are stored as typed; users who may
    // not post raw HTML (e.g. on a multisite) get it filtered
    $text = trim((string) $v);
    return current_user_can('unfiltered_html') ? $text : wp_kses_post($text);
}

add_action('admin_post_td_save', function () {
    if (!current_user_can('manage_options')) {
        wp_die('Bạn không có quyền sửa mục này.');
    }
    check_admin_referer('td_save');
    $tab = sanitize_key($_POST['tab'] ?? '');
    $back = admin_url('admin.php?page=tri-duc&tab=' . $tab);

    if ($tab === 'ket-noi') {
        $settings = get_option('tri_duc_settings', []);
        $settings = is_array($settings) ? $settings : [];
        $clear = array_map('sanitize_key', (array) ($_POST['td_clear'] ?? []));
        foreach (wp_unslash((array) ($_POST['td_settings'] ?? [])) as $key => $value) {
            $key = sanitize_key($key);
            if (!array_key_exists($key, td_settings_defaults())) {
                continue;
            }
            $value = sanitize_text_field((string) $value);
            if (in_array($key, ['telegram_token', 'gemini_key'], true) && $value === '') {
                continue;
            }
            $settings[$key] = $value;
        }
        foreach ($clear as $key) {
            $settings[$key] = '';
        }
        update_option('tri_duc_settings', $settings, false);
        wp_safe_redirect($back . '&saved=1');
        exit;
    }

    $files = td_schema_files();
    if (!isset($files[$tab])) {
        wp_safe_redirect($back);
        exit;
    }
    $all = get_option('tri_duc_content', []);
    $all = is_array($all) ? $all : [];
    if (!empty($_POST['td_reset'])) {
        unset($all[$tab]);
    } else {
        // The JSON box wins only when it was edited (it holds the content as it was when the screen opened)
        $json = trim(wp_unslash((string) ($_POST['td_json'] ?? '')));
        $data = $json !== '' ? json_decode($json, true) : null;
        if ($json !== '' && !is_array($data)) {
            wp_safe_redirect($back . '&error=' . rawurlencode('JSON không hợp lệ: ' . json_last_error_msg() . '. Chưa lưu gì.'));
            exit;
        }
        if (!is_array($data) || $data === td_content($tab)) {
            $data = td_collect($files[$tab]['fields'], wp_unslash($_POST['td_content'] ?? []), td_content($tab));
        }
        $all[$tab] = $data;
    }
    update_option('tri_duc_content', $all, false);
    wp_safe_redirect($back . '&saved=1');
    exit;
});

function td_admin_assets(): void
{
    wp_enqueue_media();
    ?>
<style>
  .td-layout { display: flex; gap: 24px; align-items: flex-start; margin-top: 16px; }
  .td-nav { flex: 0 0 230px; background: #fff; border: 1px solid #dcdcde; border-radius: 6px; padding: 8px 0; position: sticky; top: 40px; }
  .td-nav h3 { margin: 12px 14px 4px; font-size: 11px; text-transform: uppercase; color: #646970; }
  .td-nav a { display: block; padding: 6px 14px; text-decoration: none; }
  .td-nav a.current { background: #2271b1; color: #fff; }
  .td-main { flex: 1; min-width: 0; background: #fff; border: 1px solid #dcdcde; border-radius: 6px; padding: 8px 20px 12px; }
  .td-field { margin: 0 0 16px; }
  .td-label { display: block; font-weight: 600; margin-bottom: 4px; }
  .td-field .description { display: block; margin-top: 2px; }
  .td-media-row { display: flex; gap: 6px; }
  .td-preview { display: block; max-height: 90px; max-width: 220px; margin-top: 6px; border: 1px solid #dcdcde; background: #f6f7f7; }
  .td-object, .td-item, .td-json { border: 1px solid #dcdcde; border-radius: 6px; margin: 0 0 12px; padding: 0 12px; background: #fcfcfc; }
  .td-object > summary, .td-item > summary, .td-json > summary { cursor: pointer; padding: 10px 0; font-weight: 600; }
  .td-item > summary { display: flex; justify-content: space-between; gap: 12px; }
  .td-summary { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .td-tools { white-space: nowrap; }
  .td-tools button { margin-left: 14px !important; padding: 0 4px !important; text-decoration: none; }
  .td-tools .td-remove { color: #b32d2e; }
  @media (max-width: 960px) { .td-layout { flex-direction: column; } .td-nav { position: static; width: 100%; } }
</style>
<script>
(function () {
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || !b.closest('.td-admin')) return;
    var item = b.closest('.td-item');
    if (b.classList.contains('td-add')) {
      e.preventDefault();
      var list = b.closest('.td-list');
      var tpl = list.querySelector(':scope > template');
      var key = 'n' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
      list.querySelector(':scope > .td-items').insertAdjacentHTML('beforeend', tpl.innerHTML.split('__i' + list.dataset.depth + '__').join(key));
    } else if (b.classList.contains('td-remove')) {
      e.preventDefault();
      if (confirm('Xóa mục này?')) item.remove();
    } else if (b.classList.contains('td-up')) {
      e.preventDefault();
      if (item.previousElementSibling) item.parentNode.insertBefore(item, item.previousElementSibling);
    } else if (b.classList.contains('td-down')) {
      e.preventDefault();
      if (item.nextElementSibling) item.parentNode.insertBefore(item.nextElementSibling, item);
    } else if (b.classList.contains('td-media')) {
      e.preventDefault();
      var field = b.closest('.td-media-field');
      var frame = wp.media({ title: b.dataset.type === 'image' ? 'Chọn ảnh' : 'Chọn file', multiple: false, library: b.dataset.type === 'image' ? { type: 'image' } : {} });
      frame.on('select', function () {
        var url = frame.state().get('selection').first().toJSON().url;
        field.querySelector('input').value = url;
        var img = field.querySelector('.td-preview');
        if (img) { img.src = url; img.hidden = false; }
      });
      frame.open();
    }
  });
})();
</script>
<?php
}

// ---------------------------------------------------------------------------------------------
// Reminder until the content is imported

add_action('admin_notices', function () {
    $screen = get_current_screen();
    if (!$screen || !in_array($screen->id, ['dashboard', 'toplevel_page_tri-duc', 'themes'], true) || !current_user_can('manage_options')) {
        return;
    }
    $counts = wp_count_posts('td_product');
    if (($counts->publish ?? 0) + ($counts->draft ?? 0) > 0) {
        return;
    }
    echo '<div class="notice notice-info"><p><strong>Giao diện Trí Đức:</strong> website chưa có sản phẩm. Cài và kích hoạt plugin <strong>Trí Đức – Nhập dữ liệu</strong> '
        . '(file tri-duc-du-lieu.zip), rồi vào <em>Công cụ → Nhập dữ liệu Trí Đức</em> để nhập toàn bộ tin tức, sản phẩm, tài liệu, tuyển dụng và ảnh.</p></div>';
});
