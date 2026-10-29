# SẮC MÀU TRI ÂN — Phiên bản mới độc lập

Không gian triển lãm nghệ thuật – Lớp 6B – Trường THCS Hòa Chung.
Chào mừng ngày Nhà giáo Việt Nam 20/11/2026; bổ trợ báo điện tử **Chuyến đò ước mơ**.

> Mã nguồn mới nằm riêng trong kho phong-tranh-6b. Xem [hướng dẫn GitHub Pages](docs/TRIEN-KHAI-GITHUB-PAGES.md) để mở bản trực tuyến khi Pages đã bật.

## Xem ngay

Mở **`dist/xem-thu.html`** bằng Chrome, Edge, Firefox hoặc Safari. Đây là một tệp HTML độc lập có sẵn mã nguồn và 40 ảnh giữ chỗ, không cần cài đặt hoặc kết nối mạng. Tải tệp về rồi mở bằng trình duyệt nếu ứng dụng đang dùng chỉ hiển thị mã HTML.

**Bản dùng để triển khai:** `dist/index.html`, đọc danh mục từ `dist/data/artworks.json`. Không mở `index.html` trực tiếp bằng file:// vì trình duyệt hạn chế tải module và JSON; dùng bản xem thử ở trên hoặc máy chủ phát triển.

## Chạy môi trường phát triển

Có Python 3:

```sh
cd sac-mau-tri-an-v2
python3 -m http.server 4173 --directory dist
```

Mở **http://localhost:4173** trên chính máy đang chạy lệnh. Có Node.js và Python thì có thể dùng `npm run dev`. Không cần `npm install`.

## Bàn giao

- `dist/`: website tĩnh đầy đủ, có thể kéo thả lên một site Netlify **mới**.
- `dist/data/artworks.json`: 20 tranh, 10 thiệp, đủ vị trí; ảnh và thông tin thay độc lập với phần dựng 3D.
- `dist/assets/paintings/`: tranh gốc; hiện là SVG ghi rõ ảnh giữ chỗ.
- `dist/assets/cards/`: 10 cặp ảnh mặt ngoài/mặt trong giữ chỗ.
- `dist/assets/thumbnails/`: nơi đặt bản nhẹ dùng trong không gian 3D.
- `docs/HUONG-DAN-THAY-ANH.md`: cách thay ảnh và tên tác giả.
- `docs/TRIEN-KHAI-NETLIFY.md`: triển khai độc lập và chèn đường dẫn vào Canva/PDF.
- `docs/BAO-CAO-KIEM-THU.md`: kết quả và giới hạn xác minh.
- `docs/PHAM-VI-DU-AN-MOI.md`: phạm vi thư mục và bảo toàn dự án khác.
- `tests/`, `tools/`: kiểm tra, tạo lại bản HTML độc lập.

## Công nghệ

HTML/CSS/JavaScript module, WebGL 1 dựng trực tiếp, không thư viện ngoài, không CDN, không tài khoản, cơ sở dữ liệu hoặc máy chủ riêng. Hai phòng có tường, sàn gỗ, trần, khung, bảng tên, ghế và hành lang liên thông. Camera xoay tại các điểm cố định; chuyển điểm qua lớp mờ, không điều khiển nhân vật.

Ảnh thu nhỏ tải tối đa ba ảnh đồng thời và chỉ tải khi vào khu tương ứng. Texture GPU giới hạn cạnh dài 768 px; ảnh gốc chỉ gán vào cửa sổ khi chọn tác phẩm. Tỷ lệ ảnh được giữ bằng kích thước thực khi tải. Đèn là hiệu ứng bề mặt được dựng sẵn để giảm tải, không tính bóng động.

## Kiểm tra và tạo lại bản xem thử

Có Node.js (không cần thư viện cài thêm):

```sh
npm run check
node tests/integration.mjs
TEST_MODE=fallback node tests/integration.mjs
node tools/standalone.mjs
TEST_MODE=standalone node tests/integration.mjs
```

Dòng `TEST_MODE=...` dùng cú pháp macOS/Linux. Với PowerShell: `$env:TEST_MODE='fallback'; node tests/integration.mjs; Remove-Item Env:TEST_MODE`.

**Giới hạn:** môi trường thực hiện chặn socket và trình duyệt; kiểm thử tích hợp dùng DOM/WebGL mô phỏng. Chưa xác minh raster WebGL, lỗi console trong trình duyệt, bố cục thực tế hoặc điện thoại thật. Không có URL xem thử được lưu trữ trực tuyến trong lần bàn giao này.
