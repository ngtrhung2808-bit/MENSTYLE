// Cấu hình voucher & logic xác thực voucher
export const INITIAL_VOUCHERS = [
  {
    id: 'v-1',
    code: 'MEN30',
    title: 'Khuyến mãi thành viên mới',
    discountAmount: 30000,
    percent: 0,
    minOrder: 399000,
    totalCount: 100,
    usedCount: 58,
    expiry: '2026-12-31',
    isActive: true,
    condition: 'Đơn hàng từ 399.000₫',
    displayDiscount: '30.000₫',
    remaining: 'Còn 42 lượt'
  },
  {
    id: 'v-2',
    code: 'MEN60',
    title: 'Ưu đãi đơn hàng tiêu chuẩn',
    discountAmount: 60000,
    percent: 0,
    minOrder: 700000,
    totalCount: 300,
    usedCount: 14,
    expiry: '2026-12-31',
    isActive: true,
    condition: 'Đơn hàng từ 700.000₫',
    displayDiscount: '60.000₫',
    remaining: 'Còn 286 lượt'
  },
  {
    id: 'v-3',
    code: 'MEN100',
    title: 'Ưu đãi mua sắm cao cấp',
    discountAmount: 100000,
    percent: 0,
    minOrder: 1000000,
    totalCount: 200,
    usedCount: 46,
    expiry: '2026-12-31',
    isActive: true,
    condition: 'Đơn hàng từ 1.000.000₫',
    displayDiscount: '100.000₫',
    remaining: 'Còn 154 lượt'
  },
  {
    id: 'v-4',
    code: 'VIPMEN',
    title: 'Đặc quyền Quý Ông VIP',
    discountAmount: 150000,
    percent: 0,
    minOrder: 1500000,
    totalCount: 100,
    usedCount: 32,
    expiry: '2026-12-31',
    isActive: true,
    condition: 'Đơn hàng từ 1.500.000₫',
    displayDiscount: '150.000₫',
    remaining: 'Còn 68 lượt'
  },
  {
    id: 'v-5',
    code: 'MENSTYLE20',
    title: 'Tri ân khách hàng thân thiết',
    discountAmount: 0,
    percent: 20,
    minOrder: 0,
    totalCount: 500,
    usedCount: 125,
    expiry: '2026-12-31',
    isActive: true,
    condition: 'Giảm 20% cho mọi đơn hàng',
    displayDiscount: 'Giảm 20%',
    remaining: 'Vô hạn'
  }
];

export const AVAILABLE_VOUCHERS = INITIAL_VOUCHERS;

// Lấy danh sách voucher từ localStorage (hoặc nạp mặc định)
export function getStoredVouchers() {
  try {
    const raw = localStorage.getItem('menstyle_vouchers');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Lỗi đọc menstyle_vouchers:', err);
  }
  localStorage.setItem('menstyle_vouchers', JSON.stringify(INITIAL_VOUCHERS));
  return INITIAL_VOUCHERS;
}

// Lưu danh sách voucher
export function saveStoredVouchers(vouchers) {
  try {
    localStorage.setItem('menstyle_vouchers', JSON.stringify(vouchers));
  } catch (err) {
    console.error('Lỗi ghi menstyle_vouchers:', err);
  }
}

// Kiểm tra lịch sử dùng mã của khách hàng: Mỗi khách chỉ được dùng 1 lần / từng mã
export function hasUserUsedVoucher(code, userIdOrEmail) {
  if (!userIdOrEmail) return false;
  try {
    const rawUsages = localStorage.getItem('menstyle_voucher_usages');
    const usages = rawUsages ? JSON.parse(rawUsages) : {};
    const normalizedCode = code.trim().toUpperCase();
    const userList = usages[normalizedCode] || [];
    return userList.includes(userIdOrEmail.toLowerCase().trim());
  } catch (err) {
    return false;
  }
}

// Ghi nhận voucher đã được khách hàng sử dụng
export function markVoucherAsUsed(code, userIdOrEmail) {
  if (!code) return;
  const normalizedCode = code.trim().toUpperCase();
  
  // 1. Tăng usedCount trong danh sách voucher
  const vouchers = getStoredVouchers();
  const updated = vouchers.map(v => {
    if (v.code.toUpperCase() === normalizedCode) {
      return { ...v, usedCount: (v.usedCount || 0) + 1 };
    }
    return v;
  });
  saveStoredVouchers(updated);

  // 2. Ghi nhận user đã sử dụng (chặn dùng lần 2)
  if (userIdOrEmail) {
    try {
      const rawUsages = localStorage.getItem('menstyle_voucher_usages');
      const usages = rawUsages ? JSON.parse(rawUsages) : {};
      const targetUser = userIdOrEmail.toLowerCase().trim();
      if (!usages[normalizedCode]) {
        usages[normalizedCode] = [];
      }
      if (!usages[normalizedCode].includes(targetUser)) {
        usages[normalizedCode].push(targetUser);
      }
      localStorage.setItem('menstyle_voucher_usages', JSON.stringify(usages));
    } catch (err) {
      console.error('Lỗi ghi nhận voucher usage:', err);
    }
  }
}

// Hàm validate voucher khi khách áp dụng tại giỏ/thanh toán
export function validateVoucher(inputCode, subTotal, userIdOrEmail = null) {
  if (!inputCode) {
    return { valid: false, message: 'Vui lòng nhập mã voucher' };
  }
  const cleanCode = inputCode.trim().toUpperCase();
  const vouchers = getStoredVouchers();
  const voucher = vouchers.find(v => v.code.toUpperCase() === cleanCode);

  if (!voucher) {
    return { valid: false, message: 'Mã voucher không tồn tại hoặc đã bị xóa!' };
  }

  if (voucher.isActive === false) {
    return { valid: false, message: 'Mã khuyến mãi này hiện đang tạm khóa!' };
  }

  // Kiểm tra hạn sử dụng
  if (voucher.expiry) {
    const expDate = new Date(voucher.expiry);
    // Tính tới cuối ngày hết hạn
    expDate.setHours(23, 59, 59, 999);
    if (new Date() > expDate) {
      return { valid: false, message: `Mã ${voucher.code} đã hết hạn sử dụng (${voucher.expiry})!` };
    }
  }

  // Kiểm tra số lượng tồn của mã
  const remainingCount = (voucher.totalCount || 0) - (voucher.usedCount || 0);
  if (voucher.totalCount > 0 && remainingCount <= 0) {
    return { valid: false, message: `Mã ${voucher.code} đã hết lượt sử dụng trong đợt này!` };
  }

  // QUY TẮC QUAN TRỌNG: Mỗi khách hàng chỉ được dùng 1 lần cho từng loại mã
  if (userIdOrEmail && hasUserUsedVoucher(cleanCode, userIdOrEmail)) {
    return { 
      valid: false, 
      message: `Bạn đã sử dụng mã khuyến mãi ${voucher.code} trước đó. Mỗi khách hàng chỉ được áp dụng 1 lần!` 
    };
  }

  // Kiểm tra đơn tối thiểu
  if (voucher.minOrder && subTotal < voucher.minOrder) {
    const formattedMin = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.minOrder);
    return {
      valid: false,
      message: `Mã ${voucher.code} chỉ áp dụng cho đơn từ ${formattedMin} (Hiện tại: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subTotal)})`
    };
  }

  let discount = 0;
  if (voucher.percent && voucher.percent > 0) {
    discount = Math.round(subTotal * (voucher.percent / 100));
  } else if (voucher.discountAmount && voucher.discountAmount > 0) {
    discount = voucher.discountAmount;
  }

  return {
    valid: true,
    discount,
    voucher,
    message: `Áp dụng thành công mã ${voucher.code}: Giảm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}!`
  };
}
