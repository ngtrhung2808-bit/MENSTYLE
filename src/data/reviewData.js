// Dữ liệu đánh giá ban đầu & quản lý đánh giá
export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    productId: 1,
    productName: 'Áo Blazer Nam Italian Wool Dáng Slim-fit',
    customerName: 'Hoàng Minh Tuấn',
    customerEmail: 'minhtuan.hn@gmail.com',
    rating: 5,
    comment: 'Chất vải len dệt cực kỳ cao cấp, đứng phom và tôn dáng. Đường may sắc nét chuẩn phong cách Ý, rất đáng tiền!',
    date: '2026-10-18',
    isVerified: true,
    status: 'visible', // 'visible' | 'hidden'
    adminReply: 'MENSTYLE chân thành cảm ơn quý khách! Rất hân hạnh được đồng hành cùng phong cách lịch lãm của bạn.'
  },
  {
    id: 'rev-2',
    productId: 2,
    productName: 'Áo Sơ Mi Nam Trắng Nano Chống Nhăn',
    customerName: 'Đặng Quốc Huy',
    customerEmail: 'huy.dang@yahoo.com',
    rating: 5,
    comment: 'Sơ mi mặc đi làm cả ngày không hề bị nhăn ở nếp gấp tay áo. Cổ áo đứng và chất vải rất thoáng khí.',
    date: '2026-10-19',
    isVerified: true,
    status: 'visible',
    adminReply: null
  },
  {
    id: 'rev-3',
    productId: 3,
    productName: 'Áo Polo Pima Cotton Dệt Bo Cổ Sang Trọng',
    customerName: 'Nguyễn Văn Nam',
    customerEmail: 'namnguyen@gmail.com',
    rating: 4,
    comment: 'Áo đẹp, chất vải mềm mát. Tuy nhiên size L hơi ôm một chút so với các hãng khác, nên tăng 1 size nếu thích mặc rộng.',
    date: '2026-10-20',
    isVerified: true,
    status: 'visible',
    adminReply: 'Cảm ơn phản hồi của anh Nam! Form dáng slim-fit của MENSTYLE ôm vừa vặn, shop có hỗ trợ đổi size tận nhà hoàn toàn miễn phí nhé ạ.'
  },
  {
    id: 'rev-4',
    productId: 4,
    productName: 'Quần Âu Nam Co Giãn 4 Chiều Công Sở',
    customerName: 'Trần Đình Trọng',
    customerEmail: 'trong.tran@outlook.com',
    rating: 2,
    comment: 'Hàng giao bị chậm 2 ngày so với dự kiến, đóng gói hộp hơi bị móp méo góc.',
    date: '2026-10-21',
    isVerified: true,
    status: 'visible',
    adminReply: 'MENSTYLE thành thật xin lỗi anh Trọng về sự cố vận chuyển từ bên bưu tá. Shop đã gửi tặng anh voucher giảm 50.000₫ cho đơn tiếp theo ạ!'
  },
  {
    id: 'rev-5',
    productId: 5,
    productName: 'Thắt Lưng Nam Da Bò Thật Khóa Tự Động Sang Trọng',
    customerName: 'Tài khoản spam',
    customerEmail: 'spam123@abc.xyz',
    rating: 1,
    comment: 'Cần vay tiền nhanh không thế chấp vui lòng liên hệ Zalo 0999xxx...',
    date: '2026-10-22',
    isVerified: false,
    status: 'hidden',
    adminReply: null
  }
];

export function getStoredReviews() {
  try {
    const raw = localStorage.getItem('menstyle_reviews');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('menstyle_reviews', JSON.stringify(INITIAL_REVIEWS));
  return INITIAL_REVIEWS;
}

export function saveStoredReviews(reviews) {
  try {
    localStorage.setItem('menstyle_reviews', JSON.stringify(reviews));
  } catch (e) {
    console.error(e);
  }
}
