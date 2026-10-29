# Bản duyệt nâng cấp Warm Minimalism

## Phạm vi và sao lưu

Tiếp tục từ bản Sắc màu tri ân hiện tại, commit công khai `49a681e5a074d8384950f34887c108113ec18f28`. Không viết lại ứng dụng, không đổi dữ liệu, kiến trúc hoặc bảng màu. Toàn bộ bản trước sửa được sao lưu thành `SAC-MAU-TRI-AN-TRUOC-NANG-CAP.zip` và nhánh GitHub `backup-truoc-warm-minimalism-20261029`.

Bản duyệt được xuất bản ở **thư mục riêng** `sac-mau-tri-an-warm-preview/dist/`. Thư mục công khai cũ `sac-mau-tri-an-v2/dist/`, trang chủ kho và cấu hình Netlify giữ nguyên. Việc áp dụng vào địa chỉ hiện tại chờ người dùng duyệt.

## Các thay đổi

- **Phòng tranh:** ba chậu lá xanh có tán gọn; một chậu nhỏ gần lối nối, hai chậu ở góc. Một bình hoa hồng đất/kem nhạt trên bục tròn ở góc trống. Giảm từ hai ghế 3,3 m thành một ghế gỗ 2 m, sâu 0,48 m, đặt lệch trục chính.
- **Khu thiệp:** hai chậu cây nhỏ/vừa và một bình hoa trên bục, giữ vùng giữa phòng thoáng; bỏ hai ghế cũ không cần thiết.
- **Bảng tên:** giữ bảng phía trên diện tích treo; bổ sung đúng hai dòng “Những nét vẽ gửi ngàn lời tri ân” và “Trao yêu thương qua từng cánh thiệp”.
- **Camera:** góc mở đầu hướng vào tranh ở tầm mắt. Giữ độ nhạy ngang 0,004 rad/px, dọc 0,003 rad/px; giới hạn pitch từ −0,38 đến +0,38 rad, xấp xỉ ±22°. Giữ tám điểm mỗi phòng; chỉnh điểm đầu và điểm tường Tây phía trước. Đồng bộ vị trí vòng tròn lối nối khu Thiệp với vị trí camera, sửa chênh lệch có ở bản cũ.
- **Điện thoại:** nhãn khu nhỏ hơn; ẩn dòng mô tả và nhãn phụ trong phòng; thanh dưới còn một hàng, có nút danh mục, điểm quan sát và đặt lại góc. Các vùng chạm tối thiểu 44 px. Hai nút chuyển khu vẫn có chữ và vùng chạm 44 px. Giữ màn hình chào và cửa sổ xem tác phẩm.
- **Mô hình:** chậu/vase/bục dạng xoay tròn, cành dạng ống; lá cong hai mặt có độ dày, hoa có cánh bằng tam giác. Không billboard, không ảnh cây phẳng, không tải GLB/ảnh ngoài, không bóng động hoặc chuyển động liên tục.

## Kiểm thử chức năng và hình học

Các lệnh sau đã chạy trên bản duyệt cuối:

```sh
npm run check
node tests/warm-layout.mjs
TEST_MODE=fallback node tests/integration.mjs
TEST_MODE=standalone node tests/integration.mjs
```

- JSON 20 tranh + 10 thiệp giữ nguyên **từng byte**, đối chiếu SHA-256 với bản trước.
- Chọn đúng 30/30 tác phẩm từ tọa độ 3D, mở ảnh và thông tin, 10/10 thiệp đổi hai mặt; đóng ảnh giữ nguyên camera.
- Ngưỡng phân biệt vuốt/chạm và độ nhạy vuốt không đổi; kiểm tra pinch zoom, kéo chuột, xoay bằng touch pointer, giới hạn dọc, chuyển khu, điểm sàn và phương án 2D không WebGL.
- 16 điểm quan sát: kiểm tra tâm và bốn góc mỗi ảnh/bảng tên, tổng **2.400 tia**, không phát hiện trang trí hoặc ghế che các mẫu này.
- Cả bảy nhóm trang trí có chân đỡ chạm sàn, nằm trong tường phòng, dưới 2,2 m; điểm camera cách các hộp bao trang trí hơn 0,75 m.
- Phép chiếu tranh mặc định nằm trong vùng an toàn dự kiến ở 320×568, 360×800, 390×844, 430×932, 844×390 và 600×360.
- Sau khi thêm cây, phép thử từng phát hiện chậu gần cửa che bảng tên Tranh 11 từ ba điểm. Đã giảm riêng chậu này và chạy lại toàn bộ phép thử.

Các kiểm thử thao tác dùng DOM/WebGL mô phỏng, không thay thế kiểm tra browser thật.

## Ảnh kết xuất và shader

Đã xuất sáu ảnh trong `preview/images/`, gồm hai góc ngang và một góc dọc cho mỗi khu. Mở `preview/index.html` để xem gallery.

**Cách tạo ảnh:** lấy trực tiếp vertex buffer, camera, shader và các lệnh Canvas2D tạo texture từ chính engine; kết xuất bằng EGL/OpenGL ES với Mesa llvmpipe. Shader thật biên dịch thành công, mọi cảnh có `glGetError() = 0`. Texture Canvas2D được chuyển qua SVG/librsvg cho phép kết xuất ngoài browser; raster chữ có thể khác trình duyệt. Đây là ảnh cảnh 3D, **không phải ảnh chụp browser/điện thoại và không bao gồm HUD HTML/CSS**.

## Hiệu năng đo thực tế trong môi trường kiểm tra

Cùng góc nhìn, độ phân giải, máy, shader gốc và 40 lượt vẽ mỗi cảnh sau khởi động. Thời gian có gọi `glFinish`, đo CPU+GLES qua renderer phần mềm llvmpipe, có thể dao động do máy chia sẻ. Đây không phải FPS WebGL trên điện thoại.

| Cảnh | Độ phân giải | Trung vị cũ → mới (ms/khung) | P95 cũ → mới (ms) |
| --- | --- | --- | --- |
| Tranh, dọc | 390×844 | 6,54 → 6,59 | 8,73 → 8,58 |
| Tranh, góc cây | 1280×800 | 13,35 → 13,00 | 33,69 → 34,88 |
| Tranh, toàn cảnh | 1280×800 | 12,60 → 13,39 | 26,46 → 30,89 |
| Thiệp, dọc | 390×844 | 5,16 → 5,60 | 7,42 → 7,64 |
| Thiệp, góc hoa | 1280×800 | 12,51 → 12,85 | 31,32 → 31,02 |
| Thiệp, toàn cảnh | 1280×800 | 14,38 → 13,84 | 30,79 → 27,31 |

Hai cảnh dọc tăng lần lượt 0,05 ms (+0,8%) và 0,44 ms (+8,5%). Sáu trung vị chênh từ −0,54 đến +0,79 ms. P95 dao động lớn ở các cảnh ngang; không thể từ phép đo này khẳng định không giật trên mọi điện thoại.

| Chỉ số | Cũ → mới |
| --- | --- |
| Draw calls/khung | 535 → 482 (giảm 53) |
| Tam giác được vẽ | 1.070 → 8.216 |
| Texture đã tạo sau khi mở đủ hai phòng | 69 → 70 |
| Texture mới | Một atlas màu 64×64, 16 KB RGBA; không tải mạng |
| HTML/CSS/JS chính, chưa nén | 51.907 → 61.012 byte |
| Tổng gzip từng tệp chính | 18.211 → 21.683 byte, tăng khoảng 3,4 KB |
| Dữ liệu/ảnh tác phẩm | Không đổi |

Mô hình trang trí gộp thành **một draw call** và dùng atlas màu để giữ nguyên shader/định dạng vertex gốc. Bản thử đầu dùng thêm thuộc tính màu có chi phí cao hơn; đã thay bằng atlas và đo lại. Các số trong bảng là bản cuối.

Gzip ở đây là phép đo dung lượng nén cục bộ, không phải header hoặc tốc độ tải đo từ GitHub Pages. Chưa đo thời gian tải trên mạng di động, pin/nhiệt hoặc độ mượt trên điện thoại thật.

## Hạng mục chưa xác minh

Môi trường chặn socket và Chromium nên chưa chụp được browser thật hoặc chạy kiểm thử CSS/HUD trong browser. Chưa xác minh độ tràn, che phủ của nút trên thiết bị vật lý, Safari iOS/Chrome Android, pinch bằng tay thật, console WebGL của các GPU điện thoại hoặc tốc độ tải mạng di động. CSS, phép chiếu và logic đã được kiểm tra theo phạm vi nêu trên. Cần người dùng xem bản duyệt trên điện thoại trước khi áp dụng vào đường dẫn chính.
