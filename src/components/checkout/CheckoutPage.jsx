import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Ticket, 
  CheckCircle2, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '../common/Button';

export const CheckoutPage = ({ cartItems = [], onBackToShopping, onOrderSuccess }) => {
  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    province: 'Hà Nội',
    district: '',
    note: '',
    paymentMethod: 'cod', // 'cod' | 'vnpay' | 'momo' | 'banking'
    couponCode: '',
  });

  // Errors state for validation test
  const [errors, setErrors] = useState({});
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subTotal >= 500000 || subTotal === 0 ? 0 : 30000;
  const grandTotal = Math.max(0, subTotal + shippingFee - appliedDiscount);

  // Validate form
  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Vui lòng nhập họ và tên quý khách';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại liên hệ';
    } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.phone.trim())) {
      errs.phone = 'Số điện thoại không đúng định dạng 10 số (VD: 0912345678)';
    }
    if (!formData.email.trim()) {
      errs.email = 'Vui lòng nhập email nhận thông báo đơn hàng';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errs.email = 'Email không hợp lệ (VD: quyong@gmail.com)';
    }
    if (!formData.address.trim()) {
      errs.address = 'Vui lòng cung cấp địa chỉ số nhà, tên đường';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!formData.couponCode.trim()) return;

    if (formData.couponCode.trim().toUpperCase() === 'MENSTYLE20') {
      const discount = Math.round(subTotal * 0.2);
      setAppliedDiscount(discount);
      setCouponSuccess('Áp dụng mã MENSTYLE20 thành công: Giảm 20%!');
      setCouponError('');
    } else {
      setCouponError('Mã voucher không hợp lệ hoặc đã hết hạn!');
      setCouponSuccess('');
      setAppliedDiscount(0);
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (onOrderSuccess) {
        onOrderSuccess({
          ...formData,
          cartItems,
          grandTotal,
          orderCode: 'MS-' + Math.floor(100000 + Math.random() * 900000),
          createdAt: new Date().toLocaleDateString('vi-VN')
        });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Back button */}
      <button 
        onClick={onBackToShopping}
        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-950 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại mua sắm
      </button>

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950">Tiến Hành Thanh Toán</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Hoàn tất đơn hàng của bạn chỉ với vài bước đơn giản</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cột trái (7 cols): Form Thông tin giao hàng & Phương thức thanh toán */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Địa chỉ giao nhận */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-neutral-200 shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" /> 1. Thông Tin Nhận Hàng
            </h2>

            <form className="space-y-4">
              {/* Họ tên */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Họ và tên người nhận <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: null });
                    }}
                    placeholder="Nguyễn Văn A"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                      errors.fullName 
                        ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20 text-rose-950' 
                        : 'border-neutral-200 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* SĐT & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: null });
                      }}
                      placeholder="0912345678"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                        errors.phone 
                          ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20 text-rose-950' 
                          : 'border-neutral-200 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Email nhận đơn <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      placeholder="quyong@gmail.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                        errors.email 
                          ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20 text-rose-950' 
                          : 'border-neutral-200 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Địa chỉ chi tiết */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Địa chỉ giao hàng (Số nhà, Tên đường, Phường/Xã) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: null });
                  }}
                  placeholder="Số 88 Phố Huế, P. Hàng Bài, Q. Hoàn Kiếm"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    errors.address 
                      ? 'border-rose-500 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20 text-rose-950' 
                      : 'border-neutral-200 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10'
                  }`}
                />
                {errors.address && (
                  <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.address}
                  </p>
                )}
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Ghi chú cho shipper (Tùy chọn)
                </label>
                <textarea
                  rows="2"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Giao giờ hành chính, gọi trước khi giao..."
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 resize-none"
                />
              </div>
            </form>
          </div>

          {/* 2. Phương thức thanh toán */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-neutral-200 shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" /> 2. Phương Thức Thanh Toán
            </h2>

            <div className="space-y-3">
              {/* COD */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                formData.paymentMethod === 'cod' ? 'border-neutral-950 bg-neutral-50 shadow-2xs ring-1 ring-neutral-950' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className="accent-neutral-950 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-sm text-neutral-900">Thanh toán khi nhận hàng (COD)</span>
                    <p className="text-xs text-neutral-500">Kiểm tra sản phẩm vừa vặn ưng ý trước khi thanh toán</p>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-neutral-400" />
              </label>

              {/* Chuyển khoản QR */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                formData.paymentMethod === 'banking' ? 'border-neutral-950 bg-neutral-50 shadow-2xs ring-1 ring-neutral-950' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'banking'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'banking' })}
                    className="accent-neutral-950 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-sm text-neutral-900">Chuyển khoản Ngân hàng (Quét mã VietQR)</span>
                    <p className="text-xs text-neutral-500">Tự động xác nhận giao dịch qua hệ thống ngân hàng 24/7</p>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Khuyên dùng</span>
              </label>

              {/* VNPay / MoMo */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                formData.paymentMethod === 'vnpay' ? 'border-neutral-950 bg-neutral-50 shadow-2xs ring-1 ring-neutral-950' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'vnpay'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'vnpay' })}
                    className="accent-neutral-950 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-sm text-neutral-900">Ví điện tử VNPay / MoMo</span>
                    <p className="text-xs text-neutral-500">Giảm thêm 15.000đ khi thanh toán qua cổng VNPay</p>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-neutral-400" />
              </label>
            </div>
          </div>
        </div>

        {/* Cột phải (5 cols): Tóm tắt đơn hàng + Mã giảm giá + Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-neutral-200 shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
              Đơn Hàng Của Bạn ({cartItems.length} món)
            </h2>

            {/* List items mini */}
            <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="py-3 flex gap-3 items-center">
                  <img 
                    src={item.images?.[0] || item.image} 
                    alt={item.name} 
                    className="w-14 h-16 object-cover rounded-lg border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-neutral-900 line-clamp-1">{item.name}</p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Size: {item.selectedSize} | SL: x{item.quantity}
                    </p>
                    <p className="font-bold text-neutral-950 mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Voucher Box */}
            <div className="pt-4 border-t border-neutral-100 mt-3">
              <label className="block text-xs font-semibold text-neutral-700 mb-2 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-amber-600" /> Mã ưu đãi / Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="VD: MENSTYLE20"
                  value={formData.couponCode}
                  onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs uppercase outline-none focus:border-neutral-950"
                />
                <Button 
                  onClick={handleApplyCoupon}
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl font-bold px-4 text-xs"
                >
                  Áp Dụng
                </Button>
              </div>

              {couponSuccess && (
                <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-xs text-rose-500 font-semibold mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="pt-5 border-t border-neutral-200 mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-medium text-neutral-900">{formatPrice(subTotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Phí vận chuyển:</span>
                <span className="font-medium text-neutral-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600">Miễn phí</strong> : formatPrice(shippingFee)}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Giảm giá Voucher:</span>
                  <span>-{formatPrice(appliedDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-black text-neutral-950 pt-3 border-t border-neutral-100">
                <span>Tổng tiền thanh toán:</span>
                <span className="text-lg sm:text-xl text-amber-600">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Nút Đặt Hàng */}
            <Button
              onClick={handleSubmitOrder}
              className="w-full justify-center bg-neutral-950 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl mt-6 shadow-md text-sm transition"
            >
              Xác Nhận Đặt Hàng Ngay
            </Button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bảo mật thanh toán chuẩn SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
