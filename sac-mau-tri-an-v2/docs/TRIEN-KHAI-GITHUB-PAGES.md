# Xem bản mới trên GitHub Pages

Bản 3D được thêm riêng trong thư mục `sac-mau-tri-an-v2` của kho `vuthanhthuy257-star/phong-tranh-6b`. Trang chủ cũ và netlify.toml ở gốc được giữ nguyên. Nhánh `backup-phong-tranh-truoc-3d-20261029` giữ trạng thái trước khi thêm bản mới.

## Bật Pages nếu chưa có

Mở https://github.com/vuthanhthuy257-star/phong-tranh-6b/settings/pages bằng tài khoản chủ kho. Chọn **Deploy from a branch**, nhánh **main**, thư mục **/(root)**, rồi Save. Nếu đã dùng đúng thiết lập này, không cần đổi.

Đường dẫn dự kiến sau khi Pages triển khai thành công:

https://vuthanhthuy257-star.github.io/phong-tranh-6b/sac-mau-tri-an-v2/dist/

Đây là đường dẫn dự kiến, cần kiểm tra kết quả GitHub Pages trước khi tạo QR. Công cụ GitHub của phiên này không có thao tác quản trị Pages.

## Xem không cần hosting

Tải kho qua Code → Download ZIP; giải nén và mở `sac-mau-tri-an-v2/dist/xem-thu.html` bằng trình duyệt. Đây là bản HTML độc lập đã nhúng ảnh giữ chỗ.

## Thay dữ liệu

Sửa `sac-mau-tri-an-v2/dist/data/artworks.json` và ảnh tương ứng trong `dist/assets`. Xem tài liệu `HUONG-DAN-THAY-ANH.md`. Không sửa dữ liệu cũ ở `js/artworks.js` nếu chỉ cập nhật triển lãm 3D.
