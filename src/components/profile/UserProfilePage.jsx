import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';
import { Button } from '../common/Button';

export const UserProfilePage = ({ onBackToShopping, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'password'

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

  // Mock Lịch sử đơn hàng
  const orders = [
    {
      id: 'MS-892140',
      date: '20/09/2026',
      total: 1250000,
      status: 'delivering', // 'delivering' | 'completed' | 'cancelled'
      statusLabel: 'Đang giao hàng',
      items: [
        {
          name: 'Áo Blazer Nam Italian Wool Dáng Slim-fit',
          size: 'L',
          color: 'Đen Sang Trọng',
          price: 1250000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
        }
      ]
    },
    {
      id: 'MS-771239',
      date: '05/09/2026',
      total: 830000,
      status: 'completed',
      statusLabel: 'Đã giao thành công',
      items: [
        {
          name: 'Áo Sơ Mi Trắng Kháng Khuẩn Chống Nhăn Luxury',
          size: 'M',
          color: 'Trắng Tinh Khôi',
          price: 450000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1620012253295-c15c429fbb3e?q=80&w=600&auto=format&fit=crop',
        },
        {
          name: 'Áo Polo Nam Pima Cotton Bo Dệt Cao Cấp',
          size: 'M',
          color: 'Xanh Rêu',
          price: 380000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop',
        }
      ]
    }
  ];

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
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="rounded-lg text-xs flex-1 sm:flex-none">
                        Xem chi tiết
                      </Button>
                      <Button variant="primary" size="sm" className="rounded-lg text-xs bg-neutral-950 text-white flex-1 sm:flex-none">
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
    </div>
  );
};
