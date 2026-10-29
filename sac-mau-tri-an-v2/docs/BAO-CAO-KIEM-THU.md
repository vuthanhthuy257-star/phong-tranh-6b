# Báo cáo bàn giao và kiểm thử

Ngày: 29/10/2026. Dự án mới độc lập: **SẮC MÀU TRI ÂN — Lớp 6B**.

## Chức năng đã triển khai

- Màn hình chào với đúng tên triển lãm, trường/lớp, nút bắt đầu và ngày 20/11/2026.
- Hai phòng 3D dựng trực tiếp bằng WebGL, tường kem và xanh nhẹ, sàn gỗ, trần, hiệu ứng đèn, khung và bảng tên; có cửa và hành lang nối hai khu.
- 20 vị trí tranh và 10 vị trí thiệp riêng biệt; 40 ảnh giữ chỗ ghi rõ số và trạng thái, không giả tác phẩm thật hoặc tên học sinh.
- Kéo chuột/vuốt để xoay; phím mũi tên hỗ trợ xoay; tám điểm quan sát mỗi phòng, các vòng tròn trên sàn, nút tiến/lùi và chuyển nhanh khu.
- Bộ chọn đối tượng tính tia trong không gian 3D, có kiểm tra tường/vật cản; ngưỡng di chuyển 7 px phân biệt chạm với kéo.
- Cửa sổ ảnh gốc, tên và tác giả, phóng to/thu nhỏ, cuộn chuột, kéo ảnh, chụm/mở hai ngón tay. Hai mặt thiệp có nút chuyển rõ ràng.
- Đóng cửa sổ không đổi camera. Danh mục có nút đi đến vị trí từng tác phẩm.
- Không có WebGL hoặc mất context thì dùng danh mục 2D; vẫn xem được hai mặt thiệp.
- JSON riêng để quản lý tác phẩm, bảng tên dùng tiếng Việt, không sửa mã dựng 3D khi thay ảnh.
- Không dùng CDN; không có video, đăng nhập, cơ sở dữ liệu hoặc máy chủ riêng.
- Bản `dist/xem-thu.html` nhúng sẵn toàn bộ mã và ảnh, mở độc lập; `dist/index.html` là bản đọc JSON để triển khai.

## Kết quả tự động

Các lệnh đã chạy thành công trên mã nguồn cuối:

```text
node --check dist/app.js
node --check dist/museum.js
npm run check
node tests/integration.mjs
TEST_MODE=fallback node tests/integration.mjs
TEST_MODE=standalone node tests/integration.mjs
```

Kiểm tra thêm: JavaScript được nhúng trong HTML độc lập biên dịch được bằng Node VM; không có tham chiếu tài nguyên ngoài trong HTML đó; 41 SVG (40 ảnh và favicon) được bộ phân tích XML đọc thành công.

**Phân biệt phạm vi:** kiểm thử tích hợp dùng DOM và ngữ cảnh WebGL mô phỏng. Nó chạy mã ứng dụng thật, kiểm tra sự kiện, phép chiếu và chọn đối tượng, nhưng không dựng raster hoặc thực thi CSS trong trình duyệt thật.

| Yêu cầu kiểm thử | Kết quả và phạm vi |
| --- | --- |
| 1. Chạy ở môi trường phát triển | Có lệnh khởi chạy và bản HTML độc lập. Máy chủ HTTP trong môi trường này bị chặn socket `Operation not permitted`; chưa xác minh HTTP thực tế. |
| 2. Có hai khu | Đạt ở dữ liệu và kiểm thử logic chuyển khu. |
| 3. Đủ 20 vị trí tranh | Đạt; ID và vị trí duy nhất. |
| 4. Đủ 10 vị trí thiệp | Đạt; đủ hai đường dẫn ảnh cho mỗi thiệp. |
| 5. Mọi tranh mở được | 20/20 chọn đúng từ tọa độ 3D trong phép thử; có điểm quan sát cố định nhìn tới từng tranh. Chưa thao tác trong trình duyệt thật. |
| 6. Đổi mặt thiệp | 10/10 chuyển đúng mặt ngoài → mặt trong → mặt ngoài trong kiểm thử sự kiện. |
| 7. Điều hướng hai khu | Đạt logic nút khu, nút điểm quan sát và điểm sàn; kiểm tra cả cửa điều hướng trong mã. |
| 8. Xoay bằng chuột | Sự kiện kéo làm thay đổi yaw/pitch, giữ nguyên vị trí và không mở ảnh. Chưa kiểm tra cảm giác kéo thực tế. |
| 9. Cảm ứng | Đã chạy sự kiện `pointerType: touch` cho vuốt và hai con trỏ để phóng to. Chưa kiểm tra điện thoại thật. |
| 10. Giữ trạng thái khi đóng | 30/30 camera giữ nguyên room/station/position/yaw/pitch sau khi đóng. |
| 11. Tài nguyên hợp lệ | 70 tham chiếu ảnh trong JSON đều tồn tại, không rỗng; 40 ảnh giữ chỗ hợp lệ. Chưa kiểm tra lỗi mạng HTTP thực tế. |
| 12. Không lỗi console nghiêm trọng | Mã qua kiểm tra cú pháp và kiểm thử logic không ném lỗi. Chưa thể xác minh console/shader/GPU trong trình duyệt thật. |
| 13. Chữ tiếng Việt | JSON/HTML/SVG UTF-8 hợp lệ; nội dung có dấu truyền nguyên vẹn vào bảng tên canvas. Chưa xác minh raster font trên từng thiết bị. |
| 14. Màn hình nhỏ | Có CSS cho dọc/ngang; phép chiếu và chọn hoạt động ở 390×844, 844×390, 1440×900. Chưa xác minh tràn/che khuất bằng ảnh chụp trình duyệt. |

Không báo cáo các kiểm thử mô phỏng là đã xác minh trên điện thoại thật.

## Tối ưu đã áp dụng

- Chỉ nạp ảnh treo khi vào khu tương ứng; tối đa ba ảnh đồng thời.
- Ảnh gốc chỉ gán cho cửa sổ chi tiết khi mở. Trong dữ liệu giữ chỗ, ảnh thu nhỏ và ảnh gốc dùng chung SVG rất nhẹ; khi thay thật cần cung cấp bản thumbnail riêng theo hướng dẫn.
- Giới hạn cạnh texture ảnh trong phòng 768 px, tỷ lệ điểm ảnh màn hình 1,6.
- Bảng tên 512×96, texture hiệu ứng sáng được dùng chung; không tính bóng động.
- Chỉ vẽ lại cảnh khi camera, kích thước hoặc texture thay đổi.
- Tôn trọng cài đặt giảm chuyển động cho chuyển cảnh.

## Giới hạn còn lại

Môi trường chặn socket cả cho máy chủ lẫn trình duyệt Chromium. Chưa có URL xem thử trực tuyến, chưa triển khai Sites/Netlify, chưa xác minh hình ảnh WebGL thực, shader GPU, CSS, console trình duyệt hoặc thiết bị cảm ứng vật lý. Bản HTML độc lập được kiểm thử JavaScript bằng môi trường mô phỏng; cần mở bằng trình duyệt thực tế để duyệt mỹ thuật và cảm giác thao tác.

Trước khi in mã QR hoặc phát hành cho học sinh/phụ huynh, cần kiểm tra trên ít nhất Chrome/Edge máy tính, Safari iPhone và Chrome Android, với màn hình dọc/ngang và mạng di động. Hướng dẫn triển khai cung cấp cách tạo site mới, bảo toàn site cũ.
