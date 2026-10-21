export const AVAILABLE_VOUCHERS = [
  {
    code: 'MEN30',
    discountAmount: 30000,
    minOrder: 399000,
    displayDiscount: '30.000₫',
    condition: 'Đơn hàng từ 399.000₫',
    expiry: 'HSD: 31/10/2026',
    remaining: 'Kiểm tra khi áp dụng'
  },
  {
    code: 'MEN60',
    discountAmount: 60000,
    minOrder: 700000,
    displayDiscount: '60.000₫',
    condition: 'Đơn hàng từ 700.000₫',
    expiry: 'HSD: 31/10/2026',
    remaining: 'Kiểm tra khi áp dụng'
  },
  {
    code: 'MEN100',
    discountAmount: 100000,
    minOrder: 1000000,
    displayDiscount: '100.000₫',
    condition: 'Đơn hàng từ 1.000.000₫',
    expiry: 'HSD: 31/10/2026',
    remaining: 'Kiểm tra khi áp dụng'
  },
  {
    code: 'VIPMEN',
    discountAmount: 150000,
    minOrder: 1500000,
    displayDiscount: '150.000₫',
    condition: 'Đơn hàng từ 1.500.000₫',
    expiry: 'HSD: 31/10/2026',
    remaining: 'Kiểm tra khi áp dụng'
  },
  {
    code: 'MENSTYLE20',
    percent: 20,
    minOrder: 0,
    displayDiscount: 'Giảm 20%',
    condition: 'Áp dụng cho mọi đơn hàng',
    expiry: 'HSD: 31/10/2026',
    remaining: 'Kiểm tra khi áp dụng'
  }
];

export function validateVoucher(inputCode, subTotal) {
  if (!inputCode) {
    return { valid: false, message: 'Vui lòng nhập mã voucher' };
  }
  const cleanCode = inputCode.trim().toUpperCase();
  const voucher = AVAILABLE_VOUCHERS.find(v => v.code === cleanCode);

  if (!voucher) {
    return { valid: false, message: 'Mã voucher không hợp lệ hoặc đã hết hạn!' };
  }

  if (subTotal < voucher.minOrder) {
    const formattedMin = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.minOrder);
    return {
      valid: false,
      message: `Mã ${voucher.code} chỉ áp dụng cho đơn hàng từ ${formattedMin} (Hiện tại: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subTotal)})`
    };
  }

  let discount = 0;
  if (voucher.discountAmount) {
    discount = voucher.discountAmount;
  } else if (voucher.percent) {
    discount = Math.round(subTotal * (voucher.percent / 100));
  }

  return {
    valid: true,
    discount,
    voucher,
    message: `Áp dụng thành công mã ${voucher.code}: Giảm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}!`
  };
}
