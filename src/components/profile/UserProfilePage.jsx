import React, { useEffect, useState } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  KeyRound, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  RotateCcw,
  X
} from 'lucide-react';
import { Button } from '../common/Button';
import axiosInstance from '../../api/axiosInstance';

export const UserProfilePage = ({ onBackToShopping, user, onLogout, onReorder }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'password'
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState('Kích cỡ mặc không vừa, muốn đổi size khác');
  const [returnDesiredSize, setReturnDesiredSize] = useState('L');
  const [returnSuccessMsg, setReturnSuccessMsg] = useState('');

  // Mock User Info
  const [profile, setProfile] = useState({
    name: user?.name || 'Nguyễn Trường Hưng',
    email: user?.email || 'hung.menstyle@gmail.com',
    phone: user?.phone || '0988776655',
    gender: 'Nam',
    address: 'Tòa nhà Landmark 81, P. 22, Q. Bình Thạnh, TP. Hồ Chí Minh',
    memberLevel: user?.memberLevel || 'VIP Platinum',
    points: user?.points || 1250,
  });

  const [profileSuccess, setProfileSuccess] = useState('');

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    let active = true;
    setOrdersLoading(true);
    axiosInstance.get('/orders/my-orders').then(({ data }) => {
      if (!active) return;
      setOrders((data.data || []).map((order) => ({
        id: order.orderCode, status: order.orderStatus, statusLabel: ({ pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', processing: 'Đang xử lý', delivering: 'Đang giao', completed: 'Hoàn thành', cancelled: 'Đã hủy' })[order.orderStatus] || order.orderStatus,
        date: new Date(order.createdAt).toLocaleDateString('vi-VN'), total: order.grandTotal,
        items: (order.items || []).map((item) => ({ name: item.name, size: item.selectedSize || 'L', color: item.selectedColor || 'Mặc định', price: item.price, quantity: item.quantity, image: item.image || '' })),
        cartItems: (order.items || []).map((item) => ({ id: String(item.productId), _id: String(item.productId), productId: String(item.productId), selectedVariantId: item.variantId || null, name: item.name, selectedSize: item.selectedSize || 'L', selectedColor: item.selectedColor || 'Mặc định', price: item.price, quantity: item.quantity, image: item.image || '' })),
      })));
    }).catch((error) => { if (active) setOrdersError(error.response?.data?.message || 'Không thể tải lịch sử đơn hàng.'); })
      .finally(() => { if (active) setOrdersLoading(false); });
    return () => { active = false; };
  }, []);

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileSuccess('Cập nhật thông tin tài khoản thành công!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header Profile */}
      <div className="bg-neutral-950 text-white rounded-2xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500 text-neutral-950 font-black text-2xl flex items-center justify-center border-2 border-neutral-800 shadow-md">
            H
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h1>
              <span className="bg-amber-400/20 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                {profile.memberLevel}
              </span>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm mt-0.5">{profile.email} • {profile.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-xl w-full md:w-auto justify-between md:justify-start">
          <div>
            <span className="text-neutral-400 text-xs block">Điểm thưởng tích lũy</span>
            <span className="text-lg sm:text-xl font-black text-amber-400">{profile.points} Điểm</span>
          </div>
          <ShieldCheck className="w-8 h-8 text-amber-400/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-2xs space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'orders' 
                ? 'bg-neutral-950 text-amber-400' 
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Lịch Sử Đơn Hàng</span>
            </div>
            <span className="text-xs bg-neutral-800 text-white px-2 py-0.5 rounded-full">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'profile' 
                ? 'bg-neutral-950 text-amber-400' 
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span>Thông Tin Cá Nhân</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'password' 
                ? 'bg-neutral-950 text-amber-400' 
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <KeyRound className="w-4 h-4" />
              <span>Đổi Mật Khẩu</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <div className="pt-3 border-t border-neutral-100 mt-2">
            <button
              onClick={onLogout || onBackToShopping}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </div>

        {/* Nội dung chi tiết từng Tab */}
        <div className="lg:col-span-8">
          {/* TAB 1: LỊCH SỬ ĐƠN HÀNG */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-neutral-900">Danh Sách Đơn Hàng Đã Đặt</h2>
                <span className="text-xs text-neutral-500">Tất cả thời gian</span>
              </div>

              {ordersLoading && <p className="text-sm text-neutral-500">Đang tải lịch sử đơn hàng...</p>}
              {ordersError && <p className="text-sm text-rose-600">{ordersError}</p>}
              {!ordersLoading && !ordersError && orders.length === 0 && <p className="text-sm text-neutral-500">Bạn chưa có đơn hàng nào.</p>}
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                    <div>
                      <span className="font-bold text-sm text-neutral-950">Mã đơn: #{order.id}</span>
                      <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" /> Đặt ngày: {order.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {order.status === 'delivering' && (
                        <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-200">
                          <Truck className="w-3.5 h-3.5" /> {order.statusLabel}
                        </span>
                      )}
                      {order.status === 'completed' && (
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {order.statusLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* List sản phẩm trong đơn */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3.5 items-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-20 object-cover rounded-xl border border-neutral-200"
                        />
                        <div className="flex-1 text-xs">
                          <h4 className="font-semibold text-neutral-900 text-sm">{item.name}</h4>
                          <p className="text-neutral-500 mt-1">Phân loại: Size {item.size} • {item.color}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-neutral-500">Số lượng: x{item.quantity}</span>
                            <span className="font-bold text-neutral-950 text-sm">{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                    {/* Tổng tiền & Chi tiết */}
                    <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-xs text-neutral-500">
                        Tổng thanh toán: <strong className="text-base font-black text-neutral-950 ml-1">{formatPrice(order.total)}</strong>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {order.status === 'completed' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderForReturn(order);
                              setIsReturnModalOpen(true);
                              setReturnSuccessMsg('');
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Đổi size / Trả hàng (7 ngày)
                          </button>
                        )}
                        <Button variant="outline" size="sm" className="rounded-lg text-xs flex-1 sm:flex-none">
                          Xem chi tiết
                        </Button>
                        <Button onClick={() => onReorder?.(order.cartItems)} variant="primary" size="sm" className="rounded-lg text-xs bg-neutral-950 text-white flex-1 sm:flex-none">
                          Mua lại đơn này
                        </Button>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: THÔNG TIN CÁ NHÂN */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
              <h2 className="text-lg font-bold text-neutral-900 mb-6 pb-3 border-b border-neutral-100">
                Chỉnh Sửa Thông Tin Cá Nhân
              </h2>

              {profileSuccess && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-950 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-950 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm bg-neutral-100 text-neutral-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Địa chỉ mặc định</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-950 outline-none"
                  />
                </div>

                <Button type="submit" className="bg-neutral-950 text-white font-bold text-xs px-6 py-2.5 rounded-xl mt-4">
                  Lưu Thay Đổi
                </Button>
              </form>
            </div>
          )}

          {/* TAB 3: ĐỔI MẬT KHẨU */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
              <h2 className="text-lg font-bold text-neutral-900 mb-6 pb-3 border-b border-neutral-100">
                Đổi Mật Khẩu Bảo Mật
              </h2>

              <form onSubmit={(e) => { e.preventDefault(); alert('Đổi mật khẩu thành công!'); }} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-950 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-950 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Nhập lại mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-950 outline-none"
                  />
                </div>

                <Button type="submit" className="bg-neutral-950 text-white font-bold text-xs px-6 py-2.5 rounded-xl mt-4">
                  Cập Nhật Mật Khẩu
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Modal Yêu Cầu Đổi Trả Hàng (Order Return trong 7 ngày) */}
      {isReturnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div 
            className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm"
            onClick={() => setIsReturnModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-7 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsReturnModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-neutral-950">Yêu Cầu Đổi Trả Đơn Hàng</h3>
                <p className="text-xs text-neutral-500">Mã đơn: <strong>#{selectedOrderForReturn.id}</strong> (Hỗ trợ 7 ngày miễn phí)</p>
              </div>
            </div>

            {returnSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 space-y-2 text-center my-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold">{returnSuccessMsg}</p>
                <p className="text-neutral-500 font-normal">Shipper MENSTYLE sẽ liên hệ trong 24h để mang size mới đến tận nơi đổi cho bạn.</p>
                <Button 
                  onClick={() => setIsReturnModalOpen(false)}
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg mt-2 text-xs"
                >
                  Đóng cửa sổ
                </Button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setReturnSuccessMsg('Yêu cầu đổi hàng đã được gửi thành công đến bộ phận CSKH!');
                }} 
                className="space-y-3.5 mt-2"
              >
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Lý do yêu cầu đổi trả:
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 outline-none focus:border-neutral-950 bg-neutral-50 font-medium"
                  >
                    <option value="Kích cỡ mặc không vừa, muốn đổi size khác">Kích cỡ mặc không vừa, muốn đổi size khác</option>
                    <option value="Màu sắc không hợp gu, muốn đổi màu khác">Màu sắc không hợp gu, muốn đổi màu khác</option>
                    <option value="Sản phẩm lỗi đường may / lỗi chỉ">Sản phẩm lỗi đường may / lỗi chỉ</option>
                    <option value="Khác (Hoàn tiền trong chính sách 7 ngày)">Khác (Hoàn tiền trong chính sách 7 ngày)</option>
                  </select>
                </div>

                {returnReason.includes('đổi size') && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Size mong muốn đổi sang:
                    </label>
                    <div className="flex gap-2">
                      {['S', 'M', 'L', 'XL', '2XL'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReturnDesiredSize(s)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                            returnDesiredSize === s 
                              ? 'bg-neutral-950 text-white border-neutral-950' 
                              : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-950'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Ghi chú thêm cho CSKH & Shipper:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="VD: Giao buổi chiều sau 17h giúp mình nhé..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 outline-none focus:border-neutral-950"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsReturnModalOpen(false)}
                    className="flex-1 rounded-xl text-xs"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="flex-1 rounded-xl text-xs bg-neutral-950 hover:bg-amber-600 text-white font-bold"
                  >
                    Xác nhận gửi yêu cầu
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
