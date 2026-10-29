# Triển khai thử trên Netlify, giữ nguyên website cũ

Chưa có hoạt động triển khai nào được thực hiện trong lần bàn giao. Làm theo hướng dẫn này để tạo **một website mới** khi bạn sẵn sàng. Không chọn cập nhật hay xóa site cũ.

## Cách kéo thả, không cần lập trình

1. Giải nén gói dự án. Kiểm tra thư mục `dist` có `index.html`, `style.css`, `app.js`, `museum.js`, `data` và `assets`.
2. Đăng nhập tài khoản Netlify của bạn. Chọn chức năng tạo site/project mới và triển khai thủ công (nhãn nút có thể thay đổi theo giao diện Netlify).
3. Kéo **thư mục `dist`** vào khu vực triển khai của site mới. `index.html` phải nằm ngay cấp đầu trong nội dung được tải lên.
4. Đặt tên thử nghiệm riêng, chẳng hạn `sac-mau-tri-an-6b-v2` nếu tên còn trống. Đừng chọn site Netlify cũ làm đích.
5. Khi Netlify cung cấp URL HTTPS, mở trên máy tính và điện thoại để kiểm tra theo bảng trong báo cáo kiểm thử.
6. Khi cần cập nhật, tải lại nội dung `dist` lên **site thử nghiệm mới** vừa tạo. Việc thay thế site cũ là quyết định riêng sau khi duyệt.

Không cần lệnh build, không cần biến môi trường hoặc dịch vụ trả phí cho mã nguồn này. Netlify có các điều kiện và hạn mức theo tài khoản; xem trong tài khoản của bạn khi tạo site.

## Nếu kết nối với kho Git mới

- Kho chỉ chứa dự án mới `sac-mau-tri-an-v2`.
- Publish directory: `dist`.
- Build command: để trống.
- Tệp `netlify.toml` ở gốc đã khai báo publish directory và một số header cơ bản.
- Không liên kết vào kho hoặc site của Học Đường Số.

## Đường dẫn để đưa vào báo Canva/PDF

Chỉ dùng URL HTTPS thực tế do Netlify cung cấp sau khi đã kiểm tra. Đường dẫn `localhost` chỉ hoạt động trên máy chạy máy chủ, không dùng cho QR hoặc báo.

Dán URL của trang chính (không thêm `/xem-thu.html`) vào phần liên kết của Canva. Khi xuất PDF, thử bấm liên kết từ tệp PDF đã xuất. Sau khi đã duyệt đường dẫn ổn định, mới tạo mã QR cho URL đó và thử quét trên mạng di động.

## Kiểm tra trước khi chia sẻ

- Trang chào đúng tên trường, lớp, ngày tháng.
- Phòng 3D mở được trên các trình duyệt mục tiêu.
- Xem lần lượt 20 tranh và 10 thiệp, đủ hai mặt thiệp.
- Đóng ảnh vẫn giữ nguyên góc nhìn.
- Vuốt trong phòng không mở nhầm ảnh; chụm/mở hai ngón tay trong ảnh hoạt động.
- Màn hình dọc, ngang không che nút hoặc bảng tên.
- Tắt WebGL để kiểm tra danh mục 2D.
- Thử đường dẫn và mã QR bằng mạng di động.
