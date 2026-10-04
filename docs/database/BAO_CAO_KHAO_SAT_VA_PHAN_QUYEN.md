# BÁO CÁO THIẾT KẾ CƠ SỞ DỮ LIỆU DỰ ÁN MENSTYLE (MONGODB ATLAS)
**Dự án:** Hệ Thống Thương Mại Điện Tử Thời Trang Nam Cao Cấp MENSTYLE  
**Tham chiếu hệ thống thực tế:** [Torano.vn](https://torano.vn)  
**Người thực hiện (Database Designer / Backend Architect):** Lê Quỳnh Nga (`lqnga112@gmail.com`)  
**Công nghệ triển khai:** MongoDB Atlas (Cloud NoSQL), Mongoose ODM, Node.js  
**Ngày hoàn thiện:** Tháng 10/2026  

---

## MỤC LỤC
1. [Khảo sát nghiệp vụ thực tế tham chiếu Torano.vn](#1-khảo-sát-nghiệp-vụ-thực-tế-tham-chiếu-toranovn)
2. [Mô hình phân quyền người dùng (RBAC - Role-Based Access Control)](#2-mô-hình-phân-quyền-người-dùng-rbac)
3. [Kiến trúc tổng thể 28 Collections phân theo 6 Phân hệ chức năng](#3-kiến-trúc-tổng-thể-28-collections-phân-theo-6-phân-hệ-chức-năng)
4. [Đặc tả chi tiết chức năng & Cấu trúc 28 Collections](#4-đặc-tả-chi-tiết-chức-năng--cấu-trúc-28-collections)
   - [Phân hệ 1: Xác thực & Khách hàng (5 Collections)](#phân-hệ-1-xác-thực--khách-hàng-auth--users)
   - [Phân hệ 2: Danh mục & Sản phẩm (5 Collections)](#phân-hệ-2-danh-mục--sản-phẩm-catalog--products)
   - [Phân hệ 3: Kho hàng & Tồn kho (1 Collection)](#phân-hệ-3-kho-hàng--tồn-kho-inventory)
   - [Phân hệ 4: Giỏ hàng, Đơn hàng & Vận chuyển (9 Collections)](#phân-hệ-4-giỏ-hàng-đơn-hàng--thanh-toán-orders--checkout)
   - [Phân hệ 5: Marketing & Tương tác khách hàng (6 Collections)](#phân-hệ-5-marketing--tương-tác-khách-hàng-marketing--crm)
   - [Phân hệ 6: Quản trị hệ thống & Chi nhánh (2 Collections)](#phân-hệ-6-quản-trị-hệ-thống--chi-nhánh-system--operations)
5. [Hiện thực hóa trên MongoDB Atlas & Dữ liệu khởi tạo (Seed Data)](#5-hiện-thực-hóa-trên-mongodb-atlas--dữ-liệu-khởi-tạo)

---

## 1. KHẢO SÁT NGHIỆP VỤ THỰC TẾ THAM CHIẾU TORANO.VN
Trang web thương mại điện tử **Torano.vn** là thương hiệu thời trang nam hàng đầu tại Việt Nam với chuỗi cửa hàng phủ rộng toàn quốc. Qua khảo sát chuyên sâu, hệ thống thời trang nam có những đặc thù nghiệp vụ cốt lõi sau:

1. **Cấu trúc danh mục sản phẩm đa tầng (Hierarchical Categories):**
   - Danh mục cha -> Danh mục con: Áo (Áo Polo, Áo Sơ Mi, Áo Thun, Áo Khoác, Blazer), Quần (Quần Âu, Quần Khaki, Quần Jean, Quần Short), Phụ kiện (Thắt lưng, Ví da, Tất).
2. **Ma trận biến thể đa chiều (Variant Matrix - Color x Size):**
   - Mỗi sản phẩm không chỉ có giá đơn lẻ mà gồm nhiều biến thể: Màu sắc (Đen, Xanh Navy, Trắng, Ghi) kết hợp Kích cỡ (S, M, L, XL, 2XL hoặc size số 29, 30, 31, 32, 33).
   - Tồn kho (`stock`) và mã định danh (`SKU`) được quản lý chi tiết đến từng biến thể Màu x Size.
3. **Bảng quy chuẩn thông số chọn Size (Size Guide):**
   - Tính năng tư vấn chiều cao, cân nặng, vòng ngực, vòng eo để gợi ý size vừa vặn nhất cho nam giới, giảm thiểu tỷ lệ hoàn hàng.
4. **Chính sách Khách hàng thân thiết (Loyalty Program):**
   - Tích điểm dựa trên giá trị đơn hàng (Ví dụ: 10.000 VNĐ = 1 điểm).
   - Nâng hạng thành viên tự động: Bạc (Silver) -> Vàng (Gold) -> Kim Cương (Diamond) kèm chiết khấu cố định theo hạng.
5. **Khuyến mãi linh hoạt (Coupons & Promotions):**
   - Mã giảm theo %, giảm số tiền cố định, điều kiện đơn tối thiểu, giới hạn lượt dùng toàn sàn và giới hạn trên mỗi tài khoản.
6. **Chuỗi cung ứng & Đơn hàng đa trạng thái:**
   - Hỗ trợ cả khách vãng lai (Guest Checkout) và thành viên đăng nhập.
   - Vòng đời đơn hàng khép kín: Chờ xác nhận -> Đang xử lý -> Đang giao -> Đã giao -> Đổi trả (Order Return trong 7 ngày).

---

## 2. MÔ HÌNH PHÂN QUYỀN NGƯỜI DÙNG (RBAC)
Hệ thống được thiết kế theo mô hình **RBAC (Role-Based Access Control)** với 4 cấp độ phân quyền tách biệt rõ ràng:

| Cấp Quyền | Đối Tượng | Quyền Hạn Nghiệp Vụ Cụ Thể |
| :--- | :--- | :--- |
| **Guest** | Khách vãng lai | Xem danh mục, tra cứu sản phẩm, xem size chart, thêm vào giỏ hàng tạm, đặt hàng không cần tài khoản. |
| **Customer** | Khách hàng thành viên | Đầy đủ quyền của Guest; xem lịch sử đơn hàng, sổ địa chỉ nhận hàng, tích điểm KHTT, lưu sản phẩm yêu thích (Wishlist), đánh giá sản phẩm đã mua, yêu cầu đổi trả size. |
| **Staff** | Nhân viên vận hành | Được chia quyền theo bộ phận: Nhân viên kho (cập nhật tồn kho), Nhân viên CSKH (xử lý đơn, duyệt đổi trả, trả lời đánh giá), Nhân viên Marketing (tạo mã giảm giá, đổi banner). |
| **Super Admin** | Quản trị viên tối cao | Toàn quyền kiểm soát hệ thống: Quản lý tài khoản & phân quyền, xem báo cáo doanh thu, cấu hình chi nhánh, xem nhật ký kiểm toán hệ thống (Audit Logs). |

---

## 3. KIẾN TRÚC TỔNG THỂ 28 COLLECTIONS PHÂN THEO 6 PHÂN HỆ CHỨC NĂNG

```
MENSTYLE DATABASE ARCHITECTURE (28 COLLECTIONS)
│
├── 📁 1. Auth & Users (5 Collections)
│   ├── roles
│   ├── users
│   ├── userprofiles
│   ├── useraddresses
│   └── loyaltymemberships
│
├── 📁 2. Catalog & Products (5 Collections)
│   ├── categories
│   ├── products
│   ├── productvariants
│   ├── productattributes
│   └── sizeguides
│
├── 📁 3. Inventory (1 Collection)
│   └── inventorystocks
│
├── 📁 4. Orders & Checkout (9 Collections)
│   ├── carts
│   ├── cartitems
│   ├── wishlists
│   ├── orders
│   ├── orderitems
│   ├── orderstatushistories
│   ├── paymenttransactions
│   ├── shipments
│   └── orderreturns
│
├── 📁 5. Marketing & CRM (6 Collections)
│   ├── couponpromotions
│   ├── couponusages
│   ├── bannersliders
│   ├── reviewratings
│   ├── reviewreplies
│   └── aichatconversations
│
└── 📁 6. System & Operations (2 Collections)
    ├── storebranches
    └── auditlogs
```

---

## 4. ĐẶC TẢ CHI TIẾT CHỨC NĂNG & CẤU TRÚC 28 COLLECTIONS

### PHÂN HỆ 1: XÁC THỰC & KHÁCH HÀNG (AUTH & USERS)
Phân hệ quản lý định danh người dùng, bảo mật mật khẩu bằng `bcrypt`, thông tin vóc dáng và chương trình khách hàng thân thiết.

#### 1. `roles` (Vai trò & Phân quyền)
- **Mục đích:** Lưu trữ các vai trò trong hệ thống và danh sách quyền hạn dạng chuỗi (`permissions`).
- **Các trường chính:** `name` (enum: guest, customer, staff, super_admin), `displayName`, `description`, `permissions` (mảng quyền như `products.read`, `orders.manage`, `*`).

#### 2. `users` (Tài khoản người dùng)
- **Mục đích:** Bảng cốt lõi quản lý thông tin đăng nhập và hồ sơ cơ bản của cả Admin lẫn Khách hàng.
- **Các trường chính:** `name`, `email` (unique), `phone`, `password` (băm bcrypt), `role`, `avatar`, `isActive`, `points` (điểm tích lũy), `tier` (Silver, Gold, Diamond).

#### 3. `userprofiles` (Hồ sơ số đo vóc dáng nam)
- **Mục đích:** Lưu trữ đặc thù vóc dáng quý ông (chiều cao, cân nặng, form dáng ưa thích) để hệ thống tự động gợi ý kích cỡ vừa vặn khi mua hàng như phong cách Torano.
- **Các trường chính:** `userId` (ref: users), `gender`, `birthDate`, `heightCm`, `weightKg`, `preferredSize` (S, M, L, XL, 2XL), `preferredFit` (Slimfit, Regular, Oversize), `bio`.

#### 4. `useraddresses` (Sổ địa chỉ giao hàng)
- **Mục đích:** Cho phép mỗi người dùng lưu nhiều địa chỉ nhận hàng (nhà riêng, công ty), phục vụ giao nhận nhanh chóng.
- **Các trường chính:** `userId` (ref: users), `recipientName`, `phoneNumber`, `provinceCity`, `district`, `ward`, `specificAddress`, `isDefault`, `addressType`.

#### 5. `loyaltymemberships` (Chương trình khách hàng thân thiết)
- **Mục đích:** Quản lý hạng thẻ KHTT, % giảm giá tự động theo hạng và lịch sử cộng/trừ điểm thưởng.
- **Các trường chính:** `userId` (ref: users), `tierName` (Silver, Gold, Diamond), `currentPoints`, `accumulatedSpent` (tổng chi tiêu trọn đời), `discountPercent`, `pointHistory` (mảng lưu chi tiết số điểm biến động, lý do và mã đơn hàng).

---

### PHÂN HỆ 2: DANH MỤC & SẢN PHẨM (CATALOG & PRODUCTS)
Phân hệ xử lý dữ liệu hàng hóa thời trang, đáp ứng các tiêu chuẩn hiển thị và lọc đa tầng chuẩn thương hiệu lớn.

#### 6. `categories` (Danh mục đa cấp)
- **Mục đích:** Quản lý nhóm sản phẩm hình cây (Cấp 1: Áo -> Cấp 2: Áo Polo, Áo Sơ Mi, Áo Khoác).
- **Các trường chính:** `name`, `slug` (unique), `description`, `image`, `parentId` (ref: categories - tự trỏ chính nó để làm cây đa cấp), `order`, `isActive`.

#### 7. `products` (Sản phẩm thời trang)
- **Mục đích:** Chứa thông tin gốc của sản phẩm (tên, giá niêm yết, % giảm, ảnh thumbnail, album ảnh, mô tả chi tiết, điểm đánh giá).
- **Các trường chính:** `name`, `slug`, `sku`, `category` (ref: categories), `price`, `originalPrice`, `discountPercent`, `description`, `details`, `images`, `thumbnail`, `colors` (danh sách màu kèm mã hex), `sizes` (mảng kích cỡ), `isFeatured`, `isBestSeller`, `isNewArrival`, `rating`, `reviewCount`, `totalStock`, `isActive`.

#### 8. `productvariants` (Biến thể sản phẩm - Ma trận Màu x Size)
- **Mục đích:** Trọng tâm kiến trúc thời trang: Tách riêng từng cặp biến thể (VD: Áo Polo Navy size M, Polo Navy size L, Polo Trắng size M) để quản lý tồn kho và giá riêng biệt.
- **Các trường chính:** `productId` (ref: products), `sku` (mã SKU biến thể riêng biệt), `color`, `colorCode`, `size`, `stock` (tồn kho của biến thể này), `priceOverride` (giá đè nếu size to đắt hơn), `image`, `isActive`.

#### 9. `productattributes` (Thuộc tính thời trang bổ trợ)
- **Mục đích:** Lưu trữ các thuộc tính dùng để lọc sản phẩm trên giao diện (Bộ lọc chất liệu: Pima Cotton, Sợi tre Bamboo; Bộ lọc kiểu dáng: Slimfit, Regular Fit).
- **Các trường chính:** `name`, `code` (material, fit, pattern), `values` (mảng các giá trị thuộc tính), `isActive`.

#### 10. `sizeguides` (Bảng hướng dẫn chọn kích cỡ)
- **Mục đích:** Cung cấp bảng tra cứu kích thước chi tiết (khoảng chiều cao, cân nặng, vòng ngực, vòng vai) tương ứng với từng danh mục sản phẩm.
- **Các trường chính:** `categoryId` (ref: categories), `title`, `sizeTable` (mảng chứa size, khoảng min-max chiều cao/cân nặng, số đo cm), `guideImage`, `description`.

---

### PHÂN HỆ 3: KHO HÀNG & TỒN KHO (INVENTORY)
Phòng chống tình trạng bán vượt quá số lượng thực tế khi có nhiều đơn đặt cùng lúc.

#### 11. `inventorystocks` (Quản lý tồn kho theo chi nhánh/kho tổng)
- **Mục đích:** Quản lý số lượng hàng thực tế trên kệ, số lượng hàng đang tạm giữ cho khách chờ thanh toán, và ngưỡng cảnh báo hết hàng cho thủ kho.
- **Các trường chính:** `variantId` (ref: productvariants), `branchId` (ref: storebranches), `quantityOnHand` (tồn thực tế), `quantityReserved` (tồn đang giữ cho đơn chờ), `lowStockThreshold` (ngưỡng báo động để nhập hàng), `lastRestockedAt`.

---

### PHÂN HỆ 4: GIỎ HÀNG, ĐƠN HÀNG & THANH TOÁN (ORDERS & CHECKOUT)
Xử lý toàn bộ quy trình mua hàng trực tuyến từ khi thêm đồ vào giỏ tới khi giao hàng thành công hoặc giải quyết đổi trả hàng.

#### 12. `carts` (Giỏ hàng)
- **Mục đích:** Quản lý giỏ hàng của cả khách hàng đã đăng nhập (`userId`) lẫn khách vãng lai thông qua `sessionId`.
- **Các trường chính:** `userId` (ref: users), `sessionId`, `totalItems`, `subtotalAmount`, `couponApplied`, `discountAmount`, `expiresAt`.

#### 13. `cartitems` (Chi tiết mục trong giỏ)
- **Mục đích:** Lưu từng món hàng, chính xác biến thể màu sắc, kích cỡ và số lượng trong giỏ hàng.
- **Các trường chính:** `cartId` (ref: carts), `productId` (ref: products), `variantId` (ref: productvariants), `quantity`, `unitPrice`.

#### 14. `wishlists` (Danh sách yêu thích)
- **Mục đích:** Cho phép khách hàng lưu lại những món đồ thời trang ưng ý để xem lại và mua sau.
- **Các trường chính:** `userId` (ref: users), `productId` (ref: products), compound unique index `(userId, productId)`.

#### 15. `orders` (Đơn đặt hàng)
- **Mục đích:** Bảng gốc quản lý đơn hàng tổng thể, thông tin giao hàng, tiền cước, giảm giá voucher, phương thức thanh toán và trạng thái xử lý.
- **Các trường chính:** `orderCode` (mã đơn, VD: ORD-2026-001), `userId`, `guestInfo` (họ tên, sđt, địa chỉ khi khách không đăng nhập), `totalAmount`, `shippingFee`, `discountAmount`, `finalAmount`, `paymentMethod` (COD, VNPAY, MOMO, BANKING), `paymentStatus` (pending, paid, failed, refunded), `orderStatus` (pending, confirmed, processing, shipping, delivered, cancelled).

#### 16. `orderitems` (Chi tiết mặt hàng trong đơn)
- **Mục đích:** Lưu vết bất biến (immutable snapshot) tên sản phẩm, ảnh, màu, size và đơn giá tại thời điểm đặt hàng (kể cả sau này sản phẩm gốc đổi giá hay xóa thì đơn cũ vẫn nguyên vẹn).
- **Các trường chính:** `orderId` (ref: orders), `productId`, `variantId`, `productName`, `thumbnail`, `color`, `size`, `price`, `quantity`, `subtotal`.

#### 17. `orderstatushistories` (Nhật ký tiến trình đơn hàng)
- **Mục đích:** Ghi lại dòng thời gian thay đổi trạng thái của đơn hàng (ai đổi lúc mấy giờ, lý do gì), phục vụ quản lý nội bộ và tra cứu khiếu nại.
- **Các trường chính:** `orderId` (ref: orders), `previousStatus`, `newStatus`, `changedBy` (ref: users), `note`.

#### 18. `paymenttransactions` (Giao dịch cổng thanh toán)
- **Mục đích:** Lưu lịch sử giao dịch chuyển tiền qua VNPay, MoMo hoặc đối soát tiền mặt COD của shipper.
- **Các trường chính:** `orderId` (ref: orders), `transactionCode`, `provider`, `amount`, `currency`, `status` (pending, success, failed, refunded), `payloadResponse` (lưu response IPN từ cổng thanh toán).

#### 19. `shipments` (Vận đơn giao hàng)
- **Mục đích:** Kết nối thông tin đơn hàng với các đơn vị vận chuyển hàng đầu (Giao Hàng Nhanh - GHN, Giao Hàng Tiết Kiệm - GHTK, Viettel Post).
- **Các trường chính:** `orderId` (ref: orders), `trackingNumber` (mã vận đơn tra cứu), `carrier` (GHN, GHTK, ViettelPost), `shippingStatus` (ready_to_pick, delivering, delivered, returned), `estimatedDeliveryDate`, `actualDeliveredDate`, `senderAddress`, `receiverAddress`.

#### 20. `orderreturns` (Khiếu nại & Yêu cầu đổi trả)
- **Mục đích:** Đặc thù thời trang khách hàng rất hay đổi size nếu mặc không vừa hoặc đổi màu trong 7 ngày theo chính sách chuẩn Torano.
- **Các trường chính:** `orderId` (ref: orders), `userId`, `reason` (Kích cỡ không vừa, Hàng lỗi đường may...), `evidenceImages` (ảnh chụp sản phẩm thực tế), `status` (requested, approved, rejected, items_received, refunded), `refundAmount`, `staffNote`.

---

### PHÂN HỆ 5: MARKETING & TƯƠNG TÁC KHÁCH HÀNG (MARKETING & CRM)
Tối ưu hóa doanh số, tăng tỷ lệ chuyển đổi đơn hàng và chăm sóc khách hàng tự động.

#### 21. `couponpromotions` (Mã giảm giá & Chương trình khuyến mãi)
- **Mục đích:** Quản lý các chiến dịch voucher giảm giá toàn sàn hoặc theo đợt sale (Black Friday, Tết, Khai trương).
- **Các trường chính:** `code` (VD: MENSTYLE2026), `title`, `description`, `discountType` (percentage, fixed_amount), `discountValue`, `minOrderValue`, `maxDiscountAmount`, `usageLimitTotal`, `usageCount`, `usageLimitPerUser`, `startDate`, `endDate`, `isActive`.

#### 22. `couponusages` (Lịch sử sử dụng voucher)
- **Mục đích:** Kiểm soát chặt chẽ việc mỗi tài khoản khách hàng chỉ được dùng voucher theo đúng giới hạn cho phép.
- **Các trường chính:** `couponId` (ref: couponpromotions), `userId`, `orderId`, `discountApplied`, `usedAt`. Compound unique index `(couponId, userId, orderId)`.

#### 23. `bannersliders` (Banner quảng cáo & Bộ sưu tập)
- **Mục đích:** Quản lý các hình ảnh trình chiếu nổi bật tại Trang chủ và đầu các trang danh mục.
- **Các trường chính:** `title`, `subtitle`, `imageUrl`, `mobileImageUrl`, `linkUrl`, `position` (home_hero, flash_sale...), `order`, `isActive`.

#### 24. `reviewratings` (Đánh giá & Trải nghiệm thực tế)
- **Mục đích:** Khách hàng đánh giá sao (1-5 sao), viết nhận xét kèm ảnh thật và đặc biệt có feedback về form dáng (Chật / Vừa vặn / Rộng) giúp khách sau dễ chọn size.
- **Các trường chính:** `productId` (ref: products), `userId`, `orderId`, `rating`, `comment`, `feedbackFit`, `images`, `isVerifiedPurchase`, `likesCount`, `status` (approved, pending, hidden).

#### 25. `reviewreplies` (Phản hồi đánh giá từ cửa hàng)
- **Mục đích:** Nhân viên CSKH phản hồi cảm ơn hoặc hỗ trợ xử lý khiếu nại đánh giá của khách hàng.
- **Các trường chính:** `reviewId` (ref: reviewratings), `userId` (ref: users - staff/admin), `replyContent`.

#### 26. `aichatconversations` (Lịch sử hội thoại AI Stylist)
- **Mục đích:** Lưu trữ các đoạn chat tư vấn chọn đồ tự động của Trợ lý AI với khách hàng, kèm các ID sản phẩm được AI đề xuất.
- **Các trường chính:** `userId`, `sessionId`, `messages` (mảng các tin nhắn kèm người gửi user/assistant, text và `suggestedProductIds`), `lastInteractionAt`.

---

### PHÂN HỆ 6: QUẢN TRỊ HỆ THỐNG & CHI NHÁNH (SYSTEM & OPERATIONS)
Đảm bảo an ninh thông tin và vận hành chuỗi showroom thời trang offline kết hợp online (Omnichannel).

#### 27. `storebranches` (Hệ thống showroom & Chi nhánh)
- **Mục đích:** Quản lý danh sách các cửa hàng thực tế trên toàn quốc để khách hàng tra cứu địa chỉ gần nhất hoặc đến thử đồ trực tiếp.
- **Các trường chính:** `branchName`, `branchCode`, `phoneNumber`, `provinceCity`, `district`, `address`, `openingHours`, `latitude`, `longitude`, `isActive`.

#### 28. `auditlogs` (Nhật ký kiểm toán an toàn hệ thống)
- **Mục đích:** Ghi nhận mọi hành động nhạy cảm của ban quản trị (sửa giá, xóa sản phẩm, can thiệp tài khoản) phục vụ truy vết bảo mật.
- **Các trường chính:** `userId` (ref: users), `userEmail`, `action` (CREATE_PRODUCT, UPDATE_STATUS...), `collectionName`, `documentId`, `details`, `ipAddress`, `userAgent`, `createdAt`.

---

## 5. HIỆN THỰC HÓA TRÊN MONGODB ATLAS & DỮ LIỆU KHỞI TẠO

### 5.1. Triển khai kỹ thuật (Technical Implementation)
- Toàn bộ 28 bảng chức năng trên đã được định nghĩa thành **28 Mongoose Models** tại thư mục `server/models/` phân theo 6 thư mục con chuyên biệt.
- Được export tập trung thông qua file điều phối: `server/models/index.js`.
- Kết nối bảo mật tới Cloud Database thông qua biến môi trường `.env`.

### 5.2. Môi trường MongoDB Atlas (Cloud)
- **Cluster:** `NgaLQ` (MongoDB Atlas AWS Region `ap-east-1`).
- **Database Name:** `menstyle`.
- **Trạng thái:** Toàn bộ 28 collections đều đã có dữ liệu mẫu thực tế 100% được nạp qua script seeder `server/seeders/seed.js`.

### 5.3. Tài khoản quản trị & Tài khoản thử nghiệm đã khởi tạo
1. **Tài khoản Super Admin:**
   - Email: `admin@menstyle.vn`
   - Mật khẩu: `Admin@123456`
   - Quyền: `super_admin` (Toàn quyền quản trị)
2. **Tài khoản Khách hàng (Customer):**
   - Email: `lqnga112@gmail.com`
   - Mật khẩu: `User@123456`
   - Quyền: `customer` (Khách hàng thân thiết hạng Gold - 250 điểm)

---
*Báo cáo được lưu trữ chính thức tại kho mã nguồn dự án: `docs/database/BAO_CAO_KHAO_SAT_VA_PHAN_QUYEN.md`.*
