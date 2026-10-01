# Đưa website Trí Đức lên WordPress

Chạy `npm run build:wp` (trong thư mục `Tri-Viet-Phat-main/`) sẽ tạo ra 2 file trong `wordpress/dist/`:

| File | Là gì | Cài ở đâu |
| --- | --- | --- |
| `tri-duc-theme.zip` (~2 MB) | Giao diện (theme) Trí Đức, giống hệt website hiện tại | Giao diện → Thêm mới → Tải lên |
| `tri-duc-du-lieu.zip` (~35 MB) | Plugin nhập dữ liệu: 362 tin tức, 28 sản phẩm, 7 tài liệu, 3 tin tuyển dụng và 565 ảnh | Plugin → Cài mới → Tải lên |

## Yêu cầu

- WordPress 6.0 trở lên, PHP 7.4 trở lên (hosting AZDIGI đáp ứng).
- WordPress cài ở **thư mục gốc** của tên miền hoặc tên miền phụ (ví dụ `https://wp.thietbiytegroup.com/`). Không cài vào thư mục con kiểu `ten-mien.com/wp/`.
- Cài đặt → Đường dẫn tĩnh: không để "Mặc định". Theme tự chọn "Tên bài viết" khi kích hoạt.

## Các bước

1. Cài WordPress (cPanel → Softaculous → WordPress), ngôn ngữ Tiếng Việt.
2. **Giao diện → Thêm mới → Tải giao diện lên** → chọn `tri-duc-theme.zip` → Cài đặt → **Kích hoạt**.
3. **Plugin → Cài mới → Tải plugin lên** → chọn `tri-duc-du-lieu.zip` → Cài đặt → **Kích hoạt**. Trang "Nhập dữ liệu Trí Đức" tự mở.
   - Nếu WordPress báo file quá lớn: vào cPanel → File Manager → `public_html/wp-content/plugins/` → Upload file zip → chuột phải → Extract, rồi kích hoạt trong mục Plugin.
4. Bấm **Bắt đầu nhập** và giữ trang mở tới khi báo "Xong" (khoảng 5–15 phút). Bị ngắt giữa chừng thì bấm lại: mục nào đã nhập sẽ được bỏ qua.
5. Nhập xong: tắt và xóa plugin "Trí Đức – Nhập dữ liệu" (nội dung vẫn còn).
6. **Trí Đức → Kết nối & mã theo dõi**: điền Telegram bot token, Chat ID, email nhận yêu cầu, Gemini API key (lấy lại các giá trị đang dùng ở GitHub → Settings → Secrets). Thiếu Telegram/email thì yêu cầu của khách vẫn được lưu ở mục **Khách liên hệ**.

## Quản lý nội dung trong WP Admin

- **Bài viết** = Tin tức. Chọn danh mục *Kiến thức sức khỏe*, *Tin y tế* hoặc *Tin nội bộ*, đặt ảnh đại diện, viết tóm tắt. Ô "SEO trên Google" ở cuối trang soạn bài.
- **Sản phẩm**: tên, ảnh đại diện, ô Tóm tắt (= mô tả ngắn), hộp "Thông tin sản phẩm" (danh mục, hãng, thông số mỗi dòng một mục…). Ô *Thứ tự* (mục Thuộc tính) quyết định vị trí: số nhỏ hiện trước.
- **Tài liệu**, **Tuyển dụng**: tương tự (tuyển dụng có thêm số lượng, nơi làm việc).
- **Khách liên hệ**: mọi yêu cầu khách gửi từ form trên website.
- **Trí Đức**: thông tin công ty, đối tác, đánh giá khách hàng, chữ và ảnh của từng trang, tiêu đề SEO các trang.

Sửa xong bấm Cập nhật là website đổi ngay, không cần build lại.

## SEO

- Đường dẫn giữ nguyên như website hiện tại (`/san-pham/chi-tiet/...`, `/tin-tuc/bai-viet/...`). Hơn 400 link của website WordPress cũ vẫn chuyển hướng 301 như trước (riêng `/wp-admin`, `/wp-login.php`, `/feed` nay là của WordPress).
- Sơ đồ trang: `/wp-sitemap.xml` (`/sitemap.xml` tự chuyển sang). Gửi lại trong Google Search Console sau khi chuyển.
- Theme tự viết tiêu đề, mô tả, Open Graph, dữ liệu có cấu trúc. **Không cần cài Yoast/Rank Math** (cài vào sẽ bị trùng thẻ).
- Bản chạy thử trên tên miền phụ: bật Cài đặt → Đọc → "Ngăn chặn các công cụ tìm kiếm đánh chỉ mục" để Google không lấy trùng nội dung.

## Khi chuyển thietbiytegroup.com sang WordPress

Workflow "Deploy to hosting" (`.github/workflows/deploy.yml`) **đã tắt tự động chạy** từ 01/10/2026: đẩy code lên GitHub không còn tải website tĩnh lên hosting, nên không ghi đè WordPress. Đừng bấm "Run workflow" bằng tay khi WordPress đã nằm trên hosting, vì sẽ ghi đè lên nó.

## Cập nhật theme sau này

Sửa giao diện trong `src/` (như trước), chạy `npm run build:wp`, rồi tải `tri-duc-theme.zip` lên lại. WordPress sẽ hỏi "Thay thế giao diện hiện tại", bấm đồng ý. Nội dung đã nhập không bị ảnh hưởng.
