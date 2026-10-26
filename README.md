# Khi nét vẽ cất lời — Lớp 6B

Triển lãm mở rộng cho chuyên mục Phòng tranh của báo điện tử “Tri ân thầy cô”, Trường THCS Hòa Chung, Cao Bằng, năm học 2026–2027.

Đây là dự án độc lập. Không dùng hay sửa dự án Học Đường Số, chỉ lưu mã nguồn ở kho riêng `vuthanhthuy257-star/phong-tranh-6b`, không dùng máy chủ, cơ sở dữ liệu hoặc thư viện ngoài.

## 1. Xem thử

Giải nén toàn bộ thư mục. Có thể mở trực tiếp `index.html` để xem thử vì dữ liệu dùng tệp JavaScript, không cần tải JSON qua fetch. Để kiểm tra gần với môi trường triển khai hơn, nếu có Python, mở terminal trong thư mục và chạy:

```sh
python -m http.server 8080
```

Mở http://localhost:8080. Không đưa địa chỉ localhost vào Canva hay mã QR.

## 2. Nội dung demo

Có 6 bảng giữ chỗ được ghi rõ “Chưa phải tranh của học sinh”, 5 video MP4 thử nghiệm chuyển động phóng chậm từ bảng giữ chỗ và 1 tranh tĩnh. Video thử nghiệm không phải sản phẩm Veo 3. Không có tên học sinh thật hay tranh AI giả làm tranh học sinh.

Các tệp SVG chỉ dùng cho bảng giữ chỗ. Khi có tranh thật, dùng JPG, PNG hoặc WebP. Không cần sửa giao diện.

## 3. Thay tranh và video

1. Chép ảnh thật vào `images`, ví dụ `images/loi-tri-an.webp`.
2. Chép video Veo 3 vào `videos`, ví dụ `videos/loi-tri-an.mp4`.
3. Mở `js/artworks.js` bằng trình soạn thảo văn bản UTF-8.
4. Sửa đối tượng tương ứng, ví dụ:

```js
{
  id: "loi-tri-an",
  title: "Lời tri ân",
  author: "Tên tác giả đã được duyệt",
  description: "Lời chúc do học sinh viết.",
  image: "images/loi-tri-an.webp",
  video: "videos/loi-tri-an.mp4",
  order: 1,
  published: true,
  demo: false
}
```

Các tên và nội dung trong ví dụ này chỉ minh họa cách nhập. Giữ dấu ngoặc, dấu phẩy giữa các đối tượng. Dùng dấu nháy đơn trong lời giới thiệu hoặc viết `\"` nếu nội dung có dấu nháy kép. Tên tệp nên không dấu, không khoảng trắng, phân biệt đúng chữ hoa/thường. Đường dẫn tính từ `index.html`.

- `id`: duy nhất cho mỗi tác phẩm.
- `title`, `author`, `description`: tên tranh, tác giả, lời giới thiệu.
- `image`: đường dẫn ảnh gốc.
- `video`: đường dẫn MP4; để `""` khi không có video.
- `order`: số nhỏ xuất hiện trước; nên dùng các số khác nhau.
- `published`: `true` để hiển thị, `false` để ẩn.
- `demo`: `true` cho mẫu, đổi `false` khi thay bằng nội dung thật.

Ảnh và video luôn dùng chế độ contain, giữ tỷ lệ, không cắt nội dung. Video nên có cùng tỷ lệ với tranh gốc; nếu Veo tạo tỷ lệ khác, nội dung vẫn được giữ trọn nhưng có thể có khoảng trống xung quanh.

## 4. Thêm, xóa, thay và sắp xếp

- Thêm: sao chép một đối tượng trong danh sách `window.ARTWORKS`, đặt ID mới, đổi đường dẫn và thông tin; thêm dấu phẩy giữa các đối tượng.
- Thay video: chép MP4 mới rồi sửa `video`. Nên dùng tên mới, ví dụ `loi-tri-an-v2.mp4`, để tránh bộ nhớ đệm cũ.
- Xóa: bỏ toàn bộ đối tượng và dấu phẩy tương ứng; hoặc chỉ đặt `published: false` để ẩn. Tệp ảnh/video không dùng nữa có thể xóa để giảm dung lượng.
- Đổi thứ tự: sửa `order` rồi triển khai lại. Không sửa HTML/CSS.
- Tranh tĩnh: đặt `video: ""`; phòng xem chỉ hiện ảnh lớn và thông tin.

Khi chuyển sang nội dung thật, đặt `demo: false` cho từng tác phẩm. Phần mở đầu tự dùng ảnh của tác phẩm đầu tiên theo thứ tự trưng bày; nhãn giữ chỗ và thông báo demo tự ẩn khi không còn nội dung minh họa. Không cần sửa HTML/CSS để cập nhật tranh. Xóa các tệp demo không còn sử dụng.

## 5. Điều khiển

Nhấp/chạm tranh để mở. Tác phẩm có MP4 sẽ thử tự phát không tiếng, lặp và phát trong trang. Trình duyệt chặn tự phát sẽ có nút phát thủ công. Có điều khiển video gốc bên trong phòng xem, không chuyển sang URL MP4 riêng.

Dùng nút Tranh gốc/Tranh chuyển động, Trước/Tiếp theo, hoặc phím mũi tên. Khi focus nằm trên điều khiển video, phím mũi tên được dành cho điều khiển video của trình duyệt. Nhấn Esc hoặc Trở về phòng tranh để đóng. Video dừng và gỡ nguồn khi đóng, đổi chế độ hoặc chuyển tác phẩm. Video cũng tạm dừng khi chuyển sang tab khác.

Nếu bật tùy chọn giảm chuyển động của hệ điều hành, video không tự phát. Người xem có thể chủ động nhấn phát. Nếu video lỗi, ảnh gốc xuất hiện cùng thông báo và có thể thử lại.

## 6. Đưa lên Netlify, không cần GitHub

1. Đăng nhập tài khoản Netlify của bạn.
2. Trong Projects/Sites, chọn thêm dự án và triển khai thủ công (Deploy manually/Netlify Drop; tên mục có thể thay đổi).
3. Kéo thư mục website đã giải nén có `index.html` ở ngay cấp đầu vào vùng tải lên. Không kéo ZIP hoặc thư mục cha chứa nhiều dự án.
4. Chờ triển khai thành công, mở địa chỉ HTTPS được Netlify cấp.
5. Đặt tên miền phụ dễ nhớ trong phần cài đặt tên/URL dự án, trước khi làm QR. Có thể dùng tên miền phụ netlify.app mà không mua tên miền riêng, tùy chính sách tài khoản.
6. Kiểm tra đường dẫn bằng cửa sổ riêng tư, không đăng nhập. Nếu tài khoản bật bảo vệ truy cập, cần điều chỉnh để website công khai.

Website tĩnh này không cần build command, không cần biến môi trường. `netlify.toml` đặt thư mục xuất bản là `.`. Nếu sau này tự chọn Git, repository phải là repository mới độc lập, không dùng Học Đường Số.

### Cập nhật mà giữ nguyên URL

Mở đúng dự án Netlify đã tạo, vào Deploys và tải lại thư mục mới lên đó. Không tạo dự án mới cho mỗi lần cập nhật. Dùng địa chỉ chính của dự án, không dùng URL bản preview hoặc URL riêng của từng deployment. URL chính giữ nguyên khi cập nhật trên cùng dự án và không đổi tên miền.

### Dung lượng và chi phí

Không có API trả phí trong mã nguồn, nhưng Netlify vẫn có hạn mức/biểu phí thay đổi theo gói. Kiểm tra mục Usage/Billing và chính sách hiện hành của chính tài khoản trước khi công bố. Không coi dung lượng hoặc băng thông là miễn phí không giới hạn.

Ví dụ: 10 video x 8 MB = khoảng 80 MB lưu trữ; 500 lượt xem đủ 10 video có thể truyền khoảng 40 GB, chưa tính ảnh và lần tải lại. Website chỉ tải video đang xem, nhưng người xem vẫn có thể xem nhiều tác phẩm.

Nên dùng MP4 H.264, pixel format yuv420p, bật faststart; video ngắn khoảng 5–10 giây và kích thước 720p/1080p tùy chất lượng cần thiết. Giữ một bản ảnh gốc ngoài website; ảnh trưng bày có thể nén còn khoảng 1600–2200 px cạnh dài. Không tải video gốc quá lớn lên theo mặc định. Công cụ nén tùy chọn FFmpeg:

```sh
ffmpeg -i video-goc.mp4 -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p -movflags +faststart -an video-web.mp4
```

Lệnh này bỏ âm thanh; hãy kiểm tra chất lượng đầu ra trước khi dùng.

## 7. Link chia sẻ, QR và Canva

Sau khi có URL HTTPS chính thức:

1. Mở `index.html`, thêm `og:url` và `link rel="canonical"` với URL chính thức. Đổi `og:image` từ `images/share.png` thành URL tuyệt đối, ví dụ `https://TEN-DU-AN.netlify.app/images/share.png`. Đây là bước hoàn thiện hình đại diện cho các nền tảng yêu cầu URL tuyệt đối.
2. Triển khai lại trên cùng dự án.
3. Dùng URL chính thức để tạo mã QR trong Canva hoặc công cụ QR bạn chọn.
4. Trên trang Phòng tranh hiện có trong Canva, chọn dòng chữ “Quét mã QR hoặc nhấp vào đây để khám phá phòng tranh chuyển động”, thêm hyperlink đến cùng URL.
5. Xuất PDF và thử nhấp link trên máy tính, quét QR trên điện thoại. Kiểm tra quyền truy cập và mạng thực tế trước cuộc thi.

Dự án này không tạo hay sửa PDF, không tạo QR trỏ đến URL chưa tồn tại. File `images/share.png` đã có hình đại diện riêng cho triển lãm. Không thay địa chỉ dự án sau khi in QR.

## 8. Cấu trúc

- `index.html`: nội dung giới thiệu, phòng xem, metadata.
- `css/style.css`: giao diện responsive và giảm chuyển động.
- `js/app.js`: danh sách tự sinh, điều khiển phòng xem/video.
- `js/artworks.js`: dữ liệu duy nhất cần sửa khi cập nhật tác phẩm.
- `images/`: ảnh, hình đại diện, bảng giữ chỗ.
- `videos/`: MP4 tại website.
- `netlify.toml`: cấu hình triển khai tĩnh và một số HTTP header.
- `BAO-CAO-KIEM-THU.md`: kết quả thực tế và phần chưa kiểm chứng.

Trước khi công bố tranh/tên thật, giáo viên lựa chọn nội dung phù hợp và sử dụng thông tin học sinh theo quy định của nhà trường.

## Tải bộ website từ GitHub

Đăng nhập đúng tài khoản, mở https://github.com/vuthanhthuy257-star/phong-tranh-6b và chọn Code → Download ZIP. Giải nén rồi mở index.html. Kho riêng tư này chưa phải địa chỉ website công khai; cần triển khai Netlify theo mục 6 để có URL cho người xem.
