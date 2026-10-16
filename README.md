# MENSTYLE - Nền Tảng Thương Mại Điện Tử Thời Trang Nam Cao Cấp

> **Đồ Án Tốt Nghiệp Chuyên Ngành Công Nghệ Thông Tin**  
> Dự án Website Thương mại điện tử thời trang nam cao cấp tích hợp Trí tuệ nhân tạo (Google Gemini AI), phát triển với React, Vite, Tailwind CSS và hệ thống quản trị tương tác thời gian thực.

---

## 👥 Phân Công Nhiệm Vụ Thành Viên Dự Án

| STT | Thành Viên | Vai Trò & Phụ Trách Chính | Chi Tiết Đóng Góp |
|:---:|:---|:---|:---|
| 1 | **Nguyễn Trường Hưng** | **Project Lead • UI/UX Designer & Frontend Lead** | - Thiết kế toàn bộ giao diện UI/UX chuẩn phong cách thời trang nam cao cấp.<br>- Thiết kế cấu trúc Responsive Mobile/Desktop.<br>- Xây dựng luồng trải nghiệm khách hàng (Giỏ hàng, Yêu thích, Checkout, Thanh toán VietQR/VNPay).<br>- Tích hợp hệ sinh thái AI (Chatbot Stylist Gemini, Phối đồ Outfit AI, Tìm kiếm bằng ảnh AI Vision, Tóm tắt review).<br>- Tối ưu hóa animation, dải banner chạy vô tận và cụm nút liên hệ nổi đa kênh. |
| 2 | **Nga** | **Database & Data Architecture Lead** | - Thiết kế kiến trúc và lược đồ cơ sở dữ liệu sản phẩm, danh mục, đơn hàng và tài khoản khách hàng.<br>- Phân tích và chuẩn hóa hơn 200+ mẫu mã sản phẩm theo các phân loại độc lập: Sơ Mi, Polo, Quần Âu, Quần Short, Quần Jeans, Blazer & Phụ Kiện.<br>- Đồng bộ hóa và cấu trúc dữ liệu lưu trữ trạng thái đơn hàng (menstyle_orders), giỏ hàng và danh sách khách hàng CRM phục vụ trang Quản Trị. |

---

## 🌟 Các Tính Năng Nổi Bật Của Hệ Thống

### 1. Khách Hàng & Trải Nghiệm Mua Sắm (Storefront)
- **Bố cục 3 tầng hiện đại**: Dải khuyến mãi chạy chữ vô tận (Seamless Infinite Marquee), thanh thương hiệu trung tâm và thanh phân loại danh mục.
- **200+ Sản phẩm phong phú**: Đầy đủ hình ảnh sắc nét, phân loại chuẩn mực: Áo Sơ Mi, Áo Polo, Áo Khoác & Blazer, Quần Âu Công Sở, Quần Jeans & Khaki, Quần Short, Phụ Kiện.
- **Giỏ hàng & Mini Cart Drawer**: Mặc định 0 sản phẩm khi vào web, cập nhật số lượng và tính tổng tiền tức thì.
- **Thanh toán thông minh**: Bắt buộc đăng nhập/đăng ký tài khoản trước khi checkout, hỗ trợ quét mã VietQR tự động và cổng VNPay.
- **Cụm liên hệ nổi đa kênh**: Nút AI Stylist, Gọi Hotline, Messenger Facebook, Zalo Chat, Nút thu gọn và Cuộn nhanh lên đầu trang.

### 2. Hệ Sinh Thái Trí Tuệ Nhân Tạo (Gemini AI Powered)
- **🤖 Chatbot Stylist AI**: Tư vấn gu ăn mặc, chọn size, phối đồ theo hoàn cảnh, tự động đính kèm card sản phẩm có thể bấm xem chi tiết.
- **✨ AI Smart Outfit Stylist**: Chọn hoàn cảnh (Công sở, Tiệc cưới, Dạo phố, Thể thao) $\rightarrow$ AI đề xuất set đồ 3 món hoàn chỉnh kèm nút "Thêm Nguyên Set Vào Giỏ Hàng".
- **📸 AI Visual Search**: Tìm kiếm trang phục bằng cách tải ảnh lên để AI Gemini Vision nhận diện và tìm sản phẩm tương đồng.
- **📝 AI Review Summary**: Tóm tắt đánh giá khách hàng về chất vải, độ bền và lời khuyên chọn size.

### 3. Trang Quản Trị Độc Quyền (Admin Dashboard)
- Quản lý sản phẩm (CRUD): Thêm mới, chỉnh sửa, xóa sản phẩm và cập nhật giá/ảnh tức thì.
- Quản lý đơn hàng: Tìm kiếm mã đơn, cập nhật trạng thái đơn hàng (Chờ xác nhận, Đang giao, Hoàn thành, Hủy đơn).
- CRM Khách hàng: Danh sách tài khoản đăng ký thật trên hệ thống.
- Biểu đồ dữ liệu thật: Thống kê doanh thu, tỷ lệ hoàn thành đơn và tỷ trọng danh mục dựa trên số liệu thực tế.

---

## 🛠️ Công Nghệ Sử Dụng
- **Frontend:** React 19, Vite, Tailwind CSS
- **AI & Computer Vision:** Google Gen AI SDK (`@google/genai`), Model `gemini-2.5-flash`
- **Icons:** Lucide React
- **Quản lý dữ liệu:** Dynamic JSON Architecture & LocalStorage Database Sync
- **Môi trường vận hành:** Localhost (Vite Dev Server)
