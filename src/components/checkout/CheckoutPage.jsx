import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  QrCode,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Bookmark,
  ChevronDown,
  Plus,
  Trash2,
  Minus
} from 'lucide-react';
import { Button } from '../common/Button';
import { validateVoucher, getStoredVouchers } from '../../data/voucherConfig';
import { EWalletGatewayModal } from './EWalletGatewayModal';
import { VIETNAM_PROVINCES } from '../../data/vietnamLocations';

export const CheckoutPage = ({ 
  cartItems = [], 
  onBackToShopping, 
  onOrderSuccess,
  currentUser = null,
  onRequireAuth,
  onRemoveItem,
  onUpdateQuantity
}) => {
  // Danh sách địa chỉ đã lưu trong máy
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('menstyle_saved_addresses');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'addr-default-1',
        fullName: 'Nguyễn Trường Hùng',
        phone: '0915683837',
        province: 'Hà Nội',
        district: 'Quận Nam Từ Liêm',
        address: 'Số 18 Đường Mễ Trì Hạ, P. Mễ Trì',
        isDefault: true
      },
      {
        id: 'addr-default-2',
        fullName: 'Nguyễn Trường Hùng (Văn phòng)',
        phone: '0915683837',
        province: 'Hà Nội',
        district: 'Quận Cầu Giấy',
        address: 'Tòa nhà FPT Tower, Số 10 Phạm Văn Bạch',
        isDefault: false
      }
    ];
  });

  const [selectedSavedId, setSelectedSavedId] = useState('addr-default-1');

  // Form fields
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || 'Nguyễn Trường Hùng',
    phone: currentUser?.phone || '0915683837',
    email: currentUser?.email || 'ngtrhung2808@gmail.com',
    province: 'Hà Nội',
    district: 'Quận Nam Từ Liêm',
    address: 'Số 18 Đường Mễ Trì Hạ, P. Mễ Trì',
    note: '',
    paymentMethod: 'cod', // 'cod' | 'vnpay' | 'momo' | 'zalopay' | 'banking'
    couponCode: '',
  });

  // Tự động đồng bộ khi currentUser thay đổi hoặc nạp từ địa chỉ đã lưu
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || '',
        address: prev.address || currentUser.address || ''
      }));
    }
  }, [currentUser]);

  // Cập nhật danh sách quận/huyện dựa trên tỉnh/thành đã chọn
  const currentProvinceData = VIETNAM_PROVINCES.find(p => p.name === formData.province) || VIETNAM_PROVINCES[0];
  const availableDistricts = currentProvinceData.districts;

  // Khi đổi tỉnh thành, tự động reset quận huyện nếu quận cũ không nằm trong danh sách
  const handleProvinceChange = (newProvince) => {
    const pData = VIETNAM_PROVINCES.find(p => p.name === newProvince) || VIETNAM_PROVINCES[0];
    setFormData(prev => ({
      ...prev,
      province: newProvince,
      district: pData.districts[0] || ''
    }));
    setSelectedSavedId('');
  };

  // Chọn từ sổ địa chỉ đã lưu
  const handleSelectSavedAddress = (savedItem) => {
    setSelectedSavedId(savedItem.id);
    setFormData(prev => ({
      ...prev,
      fullName: savedItem.fullName || prev.fullName,
      phone: savedItem.phone || prev.phone,
      province: savedItem.province,
      district: savedItem.district,
      address: savedItem.address
    }));
  };

  // Lưu địa chỉ hiện tại vào danh sách đã lưu
  const handleSaveCurrentAddress = () => {
    if (!formData.address.trim()) {
      alert('Vui lòng nhập địa chỉ cụ thể trước khi lưu!');
      return;
    }
    const newAddr = {
      id: 'addr-' + Date.now(),
      fullName: formData.fullName || 'Người nhận',
      phone: formData.phone || '',
      province: formData.province,
      district: formData.district,
      address: formData.address,
      isDefault: false
    };
    const updated = [newAddr, ...savedAddresses];
    setSavedAddresses(updated);
    setSelectedSavedId(newAddr.id);
    localStorage.setItem('menstyle_saved_addresses', JSON.stringify(updated));
    alert('Đã lưu địa chỉ vào sổ địa chỉ thành công!');
  };

  // Errors state for validation test
  const [errors, setErrors] = useState({});
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [copiedField, setCopiedField] = useState(null);

  // State Modal Cổng Thanh Toán Ví Điện Tử
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [pendingOrderPayload, setPendingOrderPayload] = useState(null);

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subTotal >= 500000 || subTotal === 0 ? 0 : 30000;
  
  // Ưu đãi giảm 15.000đ khi thanh toán qua ví điện tử
  const isEWallet = ['momo', 'zalopay', 'vnpay'].includes(formData.paymentMethod);
  const paymentMethodDiscount = isEWallet ? 15000 : 0;
  const grandTotal = Math.max(0, subTotal + shippingFee - appliedDiscount - paymentMethodDiscount);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

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
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.couponCode.trim()) {
      setCouponError('Vui lòng nhập mã voucher!');
      setCouponSuccess('');
      return;
    }

    const userIdentifier = currentUser?.email || currentUser?.phone || formData.email || formData.phone;
    const result = validateVoucher(formData.couponCode, subTotal, userIdentifier);
    if (result.valid) {
      setAppliedDiscount(result.discount);
      setCouponSuccess(result.message);
      setCouponError('');
    } else {
      setCouponError(result.message);
      setCouponSuccess('');
      setAppliedDiscount(0);
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    if (validateForm()) {
      if (cartItems.length === 0) {
        alert('Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.');
        return;
      }

      const orderPayload = {
        ...formData,
        cartItems,
        total: grandTotal,
        grandTotal: grandTotal,
        orderCode: 'MS-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toLocaleDateString('vi-VN')
      };

      // Nếu chọn Ví điện tử (MoMo, ZaloPay, VNPAY) -> Mở cổng thanh toán liên kết
      if (['momo', 'zalopay', 'vnpay'].includes(formData.paymentMethod)) {
        setPendingOrderPayload(orderPayload);
        setIsWalletModalOpen(true);
        return;
      }

      if (onOrderSuccess) {
        onOrderSuccess(orderPayload);
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

            {currentUser ? (
              <div className="mb-5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-neutral-950 text-amber-400 font-bold flex items-center justify-center shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">
                      Tài khoản đặt hàng: <span className="text-amber-700">{currentUser.name}</span>
                    </p>
                    <p className="text-neutral-500 text-[11px]">{currentUser.email}</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã xác thực
                </span>
              </div>
            ) : (
              <div className="mb-5 p-4 rounded-xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div>
                  <p className="font-bold text-sm text-amber-400">Quý khách chưa đăng nhập tài khoản?</p>
                  <p className="text-xs text-neutral-300">Vui lòng đăng nhập hoặc tạo tài khoản để hoàn tất đặt hàng.</p>
                </div>
                <Button 
                  type="button"
                  variant="primary" 
                  size="sm" 
                  onClick={onRequireAuth}
                  className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg text-xs shrink-0"
                >
                  Đăng nhập / Đăng ký ngay
                </Button>
              </div>
            )}

            {/* SỔ ĐỊA CHỈ ĐÃ LƯU TỪ LẦN TRƯỚC / TỰ THÊM VÀO */}
            <div className="mb-5 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 uppercase">
                  <Bookmark className="w-3.5 h-3.5 text-amber-600" /> Sổ địa chỉ nhận hàng đã lưu
                </span>
                <button
                  type="button"
                  onClick={handleSaveCurrentAddress}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Lưu địa chỉ hiện tại
                </button>
              </div>

              {savedAddresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedSavedId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition relative ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600 shadow-2xs'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-neutral-900">{addr.fullName}</span>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                              Đang chọn
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-600 text-[11px] font-medium">{addr.phone}</p>
                        <p className="text-neutral-500 text-[11px] mt-0.5 line-clamp-1">
                          {addr.address}, {addr.district}, {addr.province}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">Chưa có địa chỉ lưu. Khi điền thông tin bên dưới, bấm "Lưu địa chỉ hiện tại" để dùng lại cho các lần mua sắm sau.</p>
              )}
            </div>

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

              {/* BỘ CHỌN TỈNH/THÀNH VÀ QUẬN/HUYỆN (VD: Nam Từ Liêm, Hà Nội) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Tỉnh / Thành Phố <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.province}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 appearance-none cursor-pointer"
                    >
                      {VIETNAM_PROVINCES.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Quận / Huyện <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.district}
                      onChange={(e) => {
                        setFormData({ ...formData, district: e.target.value });
                        setSelectedSavedId('');
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 appearance-none cursor-pointer"
                    >
                      <option value="">-- Chọn Quận / Huyện --</option>
                      {availableDistricts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Địa chỉ chi tiết */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Địa chỉ số nhà, tên đường, ngõ ngách <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: null });
                    setSelectedSavedId('');
                  }}
                  placeholder="VD: Số 18 Đường Mễ Trì Hạ, P. Mễ Trì"
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
                <p className="text-[11px] text-neutral-500 mt-1">
                  Địa chỉ nhận hàng đầy đủ: <strong className="text-neutral-800">{formData.address ? `${formData.address}, ` : ''}{formData.district ? `${formData.district}, ` : ''}{formData.province}</strong>
                </p>
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

              {/* Ví MoMo */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                formData.paymentMethod === 'momo' ? 'border-[#A50064] bg-pink-50/40 shadow-2xs ring-1 ring-[#A50064]' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'momo'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'momo' })}
                    className="accent-[#A50064] w-4 h-4"
                  />
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#A50064] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-2xs">
                      <img 
                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png" 
                        alt="MoMo" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                        className="w-full h-full object-contain rounded-lg" 
                      />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-neutral-900">Ví MoMo</span>
                      <p className="text-xs text-neutral-500">Thanh toán tức thì qua App MoMo hoặc quét mã QR</p>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">-15.000đ</span>
              </label>

              {/* Ví ZaloPay */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                formData.paymentMethod === 'zalopay' ? 'border-[#0068FF] bg-blue-50/40 shadow-2xs ring-1 ring-[#0068FF]' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'zalopay'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'zalopay' })}
                    className="accent-[#0068FF] w-4 h-4"
                  />
                  <div className="flex items-center gap-2.5">
                    <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" alt="ZaloPay" className="w-6 h-6 object-contain rounded-md" />
                    <div>
                      <span className="font-bold text-sm text-neutral-900">Ví ZaloPay</span>
                      <p className="text-xs text-neutral-500">Mở App Zalo / ZaloPay quét mã QR hoặc liên kết tài khoản</p>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">-15.000đ</span>
              </label>

              {/* VNPAY */}
              <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                formData.paymentMethod === 'vnpay' ? 'border-[#005BAA] bg-blue-50/40 shadow-2xs ring-1 ring-[#005BAA]' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'vnpay'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'vnpay' })}
                    className="accent-[#005BAA] w-4 h-4"
                  />
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-[#005BAA] rounded text-white font-black text-[9px] flex items-center justify-center">VN</div>
                    <div>
                      <span className="font-bold text-sm text-neutral-900">Cổng VNPAY-QR</span>
                      <p className="text-xs text-neutral-500">Hỗ trợ 30+ App Ngân Hàng và Ví điện tử VNPAY</p>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">-15.000đ</span>
              </label>
            </div>

            {/* KHUNG HƯỚNG DẪN THANH TOÁN CHI TIẾT TƯƠNG TÁC */}
            {formData.paymentMethod === 'banking' && (
              <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <QrCode className="w-4 h-4 text-amber-600" /> Quét mã VietQR chuyển khoản nhanh 24/7
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Khớp lệnh tự động
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* VietQR Dynamic Code */}
                  <div className="p-2.5 bg-white rounded-xl border border-neutral-200 shadow-xs shrink-0 text-center">
                    <img 
                      src={`https://api.vietqr.io/image/970422-0988776655-compact2.jpg?amount=${grandTotal}&addInfo=MENSTYLE%20DH&accountName=MENSTYLE%20STORE`}
                      alt="Mã VietQR Thanh Toán"
                      className="w-36 h-36 object-contain rounded-lg mx-auto"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1 font-medium">Quét bằng App Ngân Hàng</p>
                  </div>

                  {/* Thông tin số tài khoản */}
                  <div className="space-y-2 text-xs flex-1 w-full">
                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-neutral-200">
                      <span className="text-neutral-500">Ngân hàng:</span>
                      <strong className="text-neutral-900">MB Bank (Quân Đội)</strong>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-neutral-200">
                      <span className="text-neutral-500">Số tài khoản:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-amber-800 font-mono">0988776655</strong>
                        <button 
                          type="button"
                          onClick={() => handleCopy('0988776655', 'stk')}
                          className="p-1 hover:bg-neutral-100 rounded text-neutral-600 transition"
                          title="Sao chép STK"
                        >
                          {copiedField === 'stk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-neutral-200">
                      <span className="text-neutral-500">Chủ tài khoản:</span>
                      <strong className="text-neutral-900">MENSTYLE STORE</strong>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-neutral-200">
                      <span className="text-neutral-500">Số tiền:</span>
                      <strong className="text-amber-600 font-bold">{formatPrice(grandTotal)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isEWallet && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-neutral-50 to-amber-50/30 border border-neutral-200 space-y-3 animate-in fade-in duration-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    Cổng liên kết thanh toán: {formData.paymentMethod === 'momo' ? 'Ví MoMo' : formData.paymentMethod === 'zalopay' ? 'Ví ZaloPay' : 'Cổng VNPAY-QR'}
                  </span>
                  <span className="text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded-full text-[11px]">
                    Ưu đãi -15.000đ
                  </span>
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  Khi bấm <strong>"Xác Nhận Đặt Hàng Ngay"</strong>, hệ thống sẽ mở trực tiếp giao diện cổng thanh toán và đường dẫn đăng nhập ứng dụng <strong>{formData.paymentMethod === 'momo' ? 'MoMo' : formData.paymentMethod === 'zalopay' ? 'ZaloPay' : 'VNPAY'}</strong> để bạn quét mã hoặc thanh toán trên App an toàn.
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Liên kết bảo mật thời gian thực
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const url = formData.paymentMethod === 'momo' ? 'https://momo.vn/' : formData.paymentMethod === 'zalopay' ? 'https://zalopay.vn/' : 'https://vnpay.vn/';
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Mở trước trang web ví</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải (5 cols): Tóm tắt đơn hàng + Mã giảm giá + Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-neutral-200 shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
              Đơn Hàng Của Bạn ({cartItems.length} món)
            </h2>

            {/* List items mini */}
            <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  <p>Chưa có sản phẩm nào trong đơn hàng.</p>
                  <button 
                    onClick={onBackToShopping} 
                    className="mt-2 text-amber-600 font-bold hover:underline"
                  >
                    Quay lại chọn sản phẩm
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => {
                  const itemImg = item.images?.[0] || item.image;
                  const itemColor = item.selectedColor || item.colors?.[0]?.name || '';
                  const itemSize = item.selectedSize || item.sizes?.[0] || 'L';

                  return (
                    <div key={`${item.id}-${itemSize}-${itemColor}-${idx}`} className="py-3 flex gap-3 items-center group">
                      <img 
                        src={itemImg} 
                        alt={item.name} 
                        className="w-14 h-16 object-cover rounded-lg border border-neutral-200 shrink-0 bg-neutral-50"
                      />
                      <div className="flex-1 text-xs min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-semibold text-neutral-900 truncate" title={item.name}>
                            {item.name}
                          </p>
                          {onRemoveItem && (
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item)}
                              className="text-neutral-400 hover:text-rose-600 p-1 transition shrink-0 cursor-pointer"
                              title="Xóa món này khỏi đơn hàng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Variant: Size & Màu sắc rõ ràng */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-neutral-600">
                          <span className="bg-neutral-100 font-semibold px-2 py-0.5 rounded text-neutral-800 border border-neutral-200">
                            Size: {itemSize}
                          </span>
                          {itemColor && (
                            <span className="bg-amber-50 font-medium px-2 py-0.5 rounded text-amber-900 border border-amber-200 truncate max-w-[140px]">
                              Màu: {itemColor}
                            </span>
                          )}
                        </div>

                        {/* Đơn giá & Tăng giảm số lượng */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-50">
                          <div className="flex items-center border border-neutral-200 rounded-md bg-white">
                            {onUpdateQuantity && (
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item, Math.max(1, item.quantity - 1))}
                                className="px-1.5 py-0.5 text-neutral-500 hover:bg-neutral-100 cursor-pointer"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                            )}
                            <span className="px-2 text-[11px] font-bold text-neutral-900">
                              {item.quantity}
                            </span>
                            {onUpdateQuantity && (
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                                className="px-1.5 py-0.5 text-neutral-500 hover:bg-neutral-100 cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                          <span className="font-bold text-neutral-950 text-xs">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Voucher Box */}
            <div className="pt-4 border-t border-neutral-100 mt-3">
              <label className="block text-xs font-semibold text-neutral-700 mb-2 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-amber-600" /> Mã ưu đãi / Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập MEN30, MEN60, MEN100, VIPMEN..."
                  value={formData.couponCode}
                  onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs uppercase outline-none focus:border-neutral-950"
                />
                <Button 
                  onClick={handleApplyCoupon}
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl font-bold px-4 text-xs cursor-pointer"
                >
                  Áp Dụng
                </Button>
              </div>

              {/* Gợi ý chọn nhanh mã voucher */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {getStoredVouchers().filter(v => v.isActive !== false).map(v => (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, couponCode: v.code }));
                      const userIdentifier = currentUser?.email || currentUser?.phone || formData.email || formData.phone;
                      const res = validateVoucher(v.code, subTotal, userIdentifier);
                      if (res.valid) {
                        setAppliedDiscount(res.discount);
                        setCouponSuccess(res.message);
                        setCouponError('');
                      } else {
                        setCouponError(res.message);
                        setCouponSuccess('');
                        setAppliedDiscount(0);
                      }
                    }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                      formData.couponCode.toUpperCase() === v.code
                        ? 'bg-amber-500 text-neutral-950 border-amber-500'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-900'
                    }`}
                  >
                    {v.code} ({v.percent ? `-${v.percent}%` : `-${Math.round((v.discountAmount || 0) / 1000)}k`})
                  </button>
                ))}
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
              {paymentMethodDiscount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Ưu đãi VNPay / MoMo:</span>
                  <span>-{formatPrice(paymentMethodDiscount)}</span>
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

      {/* Cổng thanh toán liên kết Ví Điện Tử (MoMo, ZaloPay, VNPAY) */}
      <EWalletGatewayModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletType={formData.paymentMethod}
        orderInfo={pendingOrderPayload || {
          orderCode: 'MS-' + Math.floor(100000 + Math.random() * 900000),
          total: grandTotal
        }}
        onPaymentSuccess={() => {
          setIsWalletModalOpen(false);
          if (onOrderSuccess && pendingOrderPayload) {
            onOrderSuccess({
              ...pendingOrderPayload,
              paymentStatus: 'Đã thanh toán (Ví điện tử)'
            });
          }
        }}
      />
    </div>
  );
};
