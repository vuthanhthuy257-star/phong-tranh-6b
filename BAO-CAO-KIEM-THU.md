# Báo cáo bàn giao — 25/10/2026

## Đã xây dựng

- Phòng triển lãm tông giấy kem, khung tranh, tiêu đề và phần giới thiệu riêng; lưới 1/2/3/4 cột theo breakpoint.
- Sáu tác phẩm minh họa, năm MP4 thử nghiệm tại thư mục website, một tranh tĩnh; nhãn minh họa rõ ràng.
- Danh sách sinh từ artworks.js, lọc xuất bản, sắp xếp theo order; hỗ trợ số lượng linh hoạt.
- Phòng xem dùng dialog, giữ tỷ lệ ảnh/video; chuyển gốc/chuyển động, trước/sau, Esc, mũi tên, trả focus.
- Video muted/loop/playsinline, poster, nút phát dự phòng, lỗi video trở về ảnh, chỉ gắn nguồn tác phẩm đang mở; dừng và gỡ nguồn video cũ.
- Lazy load thumbnail, không nạp MP4 từ danh sách; tùy chọn giảm chuyển động tắt tự phát.
- Không framework, dịch vụ ảnh/video ngoài, tài khoản người xem, API hoặc database.

## Kiểm tra đã thực hiện

- Node.js kiểm tra cú pháp app.js và artworks.js: đạt.
- Đọc dữ liệu bằng Node VM: đủ 6 tác phẩm xuất bản, ID duy nhất, đúng trường và đường dẫn tệp tồn tại; có 1 tác phẩm không video: đạt.
- Mô phỏng thêm, xóa, ẩn và đổi thứ tự trên dữ liệu: đạt ở mức dữ liệu, chưa xác nhận render trình duyệt.
- ffprobe kiểm tra 5 MP4: H.264, yuv420p, 640×480, 4 giây: đạt.
- Kiểm tra cấu trúc HTML tham chiếu CSS/JS/ảnh tại chỗ và tính toàn vẹn ZIP: đạt.

## Chưa kiểm chứng trên trình duyệt

Đã chuẩn bị và thử chạy bộ kiểm thử Playwright, nhưng Chromium không khởi động được do môi trường chặn thao tác socket (Operation not permitted). Lần thử xin bổ sung quyền chưa chạy hoàn tất. Không có kết quả kiểm thử trình duyệt thành công hoặc ảnh chụp giao diện để làm bằng chứng.

Vì vậy CHƯA xác nhận trực quan ở 375, 768, 1366, 1920 px; chưa xác nhận thao tác chuột/chạm/bàn phím, focus, không tràn ngang, phát/dừng thực tế, autoplay bị chặn, lỗi MP4, và độ mượt. Mã đã xử lý những trường hợp này, nhưng triển khai mã không đồng nghĩa kiểm thử thành công.

Cần kiểm tra bổ sung trên Chrome desktop/Android và Safari iPhone thật, với ảnh và video thật. Bộ kiểm thử tự động đã chuẩn bị được cung cấp riêng trong gói bàn giao để người có môi trường Playwright tiếp tục; không phải bằng chứng đã chạy đạt.

## Triển khai và giới hạn

Chưa triển khai Netlify: phiên làm việc không có tài khoản/kết nối Netlify được cấu hình. Chưa có URL công khai, chưa kiểm tra QR/hyperlink PDF, chưa kiểm tra bộ đọc metadata trên mạng xã hội. Có cấu hình và hướng dẫn triển khai thủ công, cập nhật cùng dự án để giữ URL. Cần đặt URL tuyệt đối cho og:image sau khi có domain.

Toàn bộ nội dung hiện là minh họa. Video chỉ phóng chậm bảng giữ chỗ, không mô phỏng kết quả Veo 3 của tranh thật. Cần thay nội dung và hoàn tất kiểm thử trên website công khai trước khi gửi dự thi.
