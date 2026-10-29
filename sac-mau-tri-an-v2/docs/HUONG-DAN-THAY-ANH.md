# Thay ảnh và nhập tên tác giả

## 1. Chuẩn bị ảnh

Chụp hoặc quét tranh/thiệp thẳng, đủ sáng và lấy đủ mép nội dung. Website giữ nguyên tỷ lệ, không cắt, không tự sửa nội dung. Với mỗi thiệp, chuẩn bị hai ảnh riêng: **mặt ngoài** và **mặt trong**.

Nên dùng JPG hoặc WebP; PNG cũng được. Đặt tên không dấu, không khoảng trắng, dùng chữ thường. Ví dụ `tranh-01.jpg`, `thiep-01-ngoai.jpg`, `thiep-01-trong.jpg`.

Tạo hai bản của cùng một ảnh với cùng tỷ lệ:

| Loại | Khuyến nghị | Nơi đặt |
| --- | --- | --- |
| Ảnh gốc để xem chi tiết | Cạnh dài khoảng 1800–2400 px, ưu tiên chữ và nét vẽ rõ; khoảng 0,5–1,5 MB tùy ảnh | `dist/assets/paintings/` hoặc `dist/assets/cards/` |
| Ảnh nhẹ để treo trong phòng | Cạnh dài 600–900 px, khoảng 80–180 KB | `dist/assets/thumbnails/` |

Không ghi đè ảnh gốc của bạn khi tạo bản nhẹ. Với thiệp, ảnh thu nhỏ chỉ cần dùng mặt ngoài. Kích thước trên là gợi ý, không phải điều kiện bắt buộc. Không dùng Word để lưu ảnh hoặc sửa tệp JSON.

## 2. Chép ảnh vào đúng thư mục

```text
dist/
  assets/
    paintings/
      tranh-01.jpg
      ... tranh-20.jpg
    cards/
      thiep-01-ngoai.jpg
      thiep-01-trong.jpg
      ... đến thiệp 10
    thumbnails/
      tranh-01.webp
      ... tranh-20.webp
      thiep-01.webp
      ... thiep-10.webp
  data/
    artworks.json
```

Các tệp SVG đang có là ảnh giữ chỗ, có thể giữ lại trong lúc thay dần. Chép ảnh thật không làm website tự nhận: cần cập nhật đường dẫn ở bước sau.

## 3. Mở tệp dữ liệu

Sao chép `dist/data/artworks.json` ra một nơi an toàn trước khi sửa. Mở tệp bằng trình soạn thảo văn bản UTF-8, chẳng hạn VS Code. Tìm mã `tranh-01` hoặc `thiep-01`.

Tệp gồm hai danh sách: `paintings` (20 tranh) và `cards` (10 thiệp). Giữ nguyên cấu trúc dấu ngoặc, dấu ngoặc kép và dấu phẩy; chỉ thay nội dung bên trong dấu ngoặc kép và giá trị `placeholder`.

### Ví dụ một tranh

Đây là mẫu cú pháp, tên và tác giả phải thay bằng thông tin thật bạn đã kiểm tra:

```json
{
  "id": "tranh-01",
  "title": "Điền tên tranh thật ở đây",
  "author": "Điền họ tên học sinh ở đây",
  "image": "assets/paintings/tranh-01.jpg",
  "thumbnail": "assets/thumbnails/tranh-01.webp",
  "placeholder": false,
  "position": { "wall": "tay", "slot": 1 }
}
```

- `id`: giữ nguyên, mỗi tác phẩm có một mã riêng.
- `title`: tên tranh, nhập tiếng Việt đầy đủ dấu.
- `author`: tên tác giả.
- `image`: ảnh gốc chỉ dùng khi mở chi tiết.
- `thumbnail`: ảnh nhẹ cùng nội dung và tỷ lệ, dùng trong phòng và danh mục.
- `placeholder`: giữ `true` khi chưa thay ảnh; đổi sang `false` khi đã dùng ảnh thật và thông tin đúng. Viết `false` không có dấu ngoặc kép.
- `position`: giữ nguyên nếu không muốn đổi vị trí treo.

### Ví dụ một thiệp

```json
{
  "id": "thiep-01",
  "title": "Thiệp 01",
  "author": "Điền họ tên học sinh ở đây",
  "frontImage": "assets/cards/thiep-01-ngoai.jpg",
  "insideImage": "assets/cards/thiep-01-trong.jpg",
  "thumbnail": "assets/thumbnails/thiep-01.webp",
  "placeholder": false,
  "position": { "wall": "tay", "slot": 1 }
}
```

Thiệp mặc định mở mặt ngoài. Nút trong cửa sổ tự chuyển giữa hai ảnh; không sửa mã 3D.

**Đường dẫn không có `dist/` ở đầu.** Tên tệp và đuôi `.jpg`, `.png`, `.webp` phải trùng chính xác, kể cả chữ hoa/thường. Không dùng đường dẫn ổ đĩa `C:\...`, đường dẫn Google Drive hoặc Canva thay cho tệp ảnh.

## 4. Nếu cần đổi vị trí trưng bày

Thông thường không cần đổi. Mỗi vị trí phải dùng cho đúng một tác phẩm trong cùng khu.

| Khu | `wall` | `slot` hợp lệ |
| --- | --- | --- |
| Phòng tranh | `tay`, `dong` | 1–6 |
| Phòng tranh | `bac`, `nam` | 1–4 |
| Thiệp | `tay`, `dong` | 1–4 |
| Thiệp | `bac`, `nam` | 1–2 |

Bản mẫu bố trí thiệp trên hai tường bên và tường Bắc. Tường Nam để chữ giới thiệu; nên giữ cách sắp đặt hiện có. Nếu hoán đổi tranh, đổi hai trường `position` cho nhau để không chồng vị trí. Không tăng/giảm số lượng trong bản này nếu chưa điều chỉnh bố cục.

## 5. Kiểm tra sau khi sửa

1. Lưu tệp dưới dạng UTF-8.
2. Chạy máy chủ như README, mở `http://localhost:4173`, tải lại trang.
3. Vào cả hai khu, chạm ảnh vừa thay và thử mặt trong của thiệp. Kiểm tra tên, dấu tiếng Việt và độ rõ.
4. Nếu có Node.js, chạy `npm run check` để phát hiện tệp ảnh thiếu, ID/vị trí trùng hoặc JSON sai.
5. Chạy `node tools/standalone.mjs` nếu muốn cập nhật `dist/xem-thu.html`. Tệp HTML độc lập là bản chụp dữ liệu ở lúc tạo; nó không tự đọc JSON sau khi bạn sửa.

Nếu chỉ sửa ảnh và JSON để cập nhật website triển khai, không cần chạy lại bất kỳ phần dựng 3D nào. Nếu dùng lại cùng tên ảnh mà trình duyệt giữ bản cũ, tải lại mạnh hoặc đổi tên tệp ảnh rồi sửa JSON.

## 6. Trước khi dùng bản chính thức

Sau khi thay đủ ảnh, có thể thay nội dung ô ghi chú **“BẢN XEM THỬ · ẢNH GIỮ CHỖ”** trong `dist/index.html` bằng **“TRIỂN LÃM LỚP 6B · 20.11.2026”**, và cập nhật đoạn ghi chú ảnh giữ chỗ ở cuối hộp Hướng dẫn. Các cờ `placeholder` của từng tác phẩm vẫn quyết định nhãn trong cửa sổ chi tiết.

Bản HTML độc lập có nhúng toàn bộ ảnh, nên có thể rất nặng khi dùng ảnh thật. Để người xem mở bằng QR, dùng `index.html` trên Netlify với ảnh thu nhỏ riêng; không dùng đường dẫn `xem-thu.html` làm đường dẫn chính thức.
