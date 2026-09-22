import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Menu,
  X,
  Bell,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../common/Button';

export const AdminDashboard = ({ onBackToClient }) => {
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock stats
  const stats = [
    {
      title: 'Doanh Thu Tháng Này',
      value: '186.450.000đ',
      change: '+18.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: 'Đơn Hàng Mới',
      value: '428',
      change: '+8.5%',
      isPositive: true,
      icon: ShoppingBag,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'Khách Hàng Mới',
      value: '1,240',
      change: '+24.1%',
      isPositive: true,
      icon: Users,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: 'Sản Phẩm Tồn Kho Thấp',
      value: '12 món',
      change: '-4 món',
      isPositive: false,
      icon: AlertTriangle,
      color: 'text-rose-500 bg-rose-500/10',
    }
  ];

  // Mock Recent Orders table
  const recentOrders = [
    { id: 'MS-892140', customer: 'Lê Hoàng Nam', items: 'Áo Blazer Italian Wool (x1)', total: 1250000, status: 'delivering', statusText: 'Đang giao', date: '22/09/2026' },
    { id: 'MS-892139', customer: 'Trần Minh Đức', items: 'Áo Polo Pima Cotton (x2)', total: 760000, status: 'completed', statusText: 'Hoàn thành', date: '22/09/2026' },
    { id: 'MS-892138', customer: 'Vũ Quốc Khánh', items: 'Quần Tây 4 Chiều (x1)', total: 520000, status: 'pending', statusText: 'Chờ xác nhận', date: '21/09/2026' },
    { id: 'MS-892137', customer: 'Nguyễn Thành Long', items: 'Áo Sơ Mi Trắng Nano (x1)', total: 450000, status: 'completed', statusText: 'Hoàn thành', date: '21/09/2026' },
  ];

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <div className="min-h-screen bg-neutral-100 flex font-sans text-neutral-900">
      {/* 1. SIDEBAR ADMIN */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-950 text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Logo Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800">
            <div className="flex items-center gap-2 font-black text-xl tracking-wider">
              <span className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center text-sm font-black">
                M
              </span>
              <span>MENSTYLE <span className="text-xs text-neutral-400 font-normal">ADMIN</span></span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <button
              onClick={() => setActiveAdminTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeAdminTab === 'dashboard' 
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tổng Quan (Dashboard)</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeAdminTab === 'products' 
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Quản Lý Sản Phẩm</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeAdminTab === 'orders' 
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Quản Lý Đơn Hàng</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-neutral-400 hover:bg-neutral-900 hover:text-white transition"
            >
              <Users className="w-4 h-4" />
              <span>Khách Hàng (CRM)</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar: Quay lại Client */}
        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={onBackToClient}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold transition border border-neutral-700"
          >
            <ArrowLeft className="w-4 h-4" /> Về Giao Diện Bán Hàng
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* TOPBAR ADMIN */}
        <header className="h-16 bg-white border-b border-neutral-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-neutral-400">
              <span>Hệ Thống Quản Trị</span>
              <span>/</span>
              <span className="text-neutral-900 capitalize">{activeAdminTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-neutral-100 text-neutral-600">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-neutral-900 block leading-tight">Admin Hưng</span>
                <span className="text-[10px] text-neutral-400">Quản trị viên cấp cao</span>
              </div>
            </div>
          </div>
        </header>

        {/* ADMIN BODY */}
        <main className="p-4 sm:p-8 flex-1">
          {activeAdminTab === 'dashboard' && (
            <>
              {/* STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-neutral-500">{stat.title}</span>
                        <div className={`p-2 rounded-xl ${stat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-xl sm:text-2xl font-black text-neutral-950">{stat.value}</h3>
                        <span className={`text-xs font-bold flex items-center ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {stat.isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MOCK BIỂU ĐỒ DOANH THU & ĐƠN HÀNG */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-100">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">Biểu Đồ Tăng Trưởng Doanh Thu (2026)</h3>
                      <p className="text-xs text-neutral-400">Cập nhật theo dữ liệu quý gần nhất</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      +24.8% So với tháng trước
                    </span>
                  </div>

                  {/* Fake CSS Chart Bars */}
                  <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
                    {[
                      { month: 'T1', val: 40 },
                      { month: 'T2', val: 55 },
                      { month: 'T3', val: 35 },
                      { month: 'T4', val: 65 },
                      { month: 'T5', val: 50 },
                      { month: 'T6', val: 78 },
                      { month: 'T7', val: 90 },
                      { month: 'T8', val: 68 },
                      { month: 'T9', val: 95 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <div className="text-[10px] font-bold text-neutral-700 opacity-0 group-hover:opacity-100 transition">
                          {item.val}M
                        </div>
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110 ${
                            idx === 8 ? 'bg-amber-500 shadow-md' : 'bg-neutral-900'
                          }`}
                          style={{ height: `${item.val}%` }}
                        />
                        <span className="text-[11px] font-medium text-neutral-500">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phân loại bán chạy */}
                <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 mb-1">Tỷ Trọng Danh Mục</h3>
                    <p className="text-xs text-neutral-400 mb-4">Mặt hàng nam bán chạy nhất</p>
                    
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Blazer & Suit Nam</span>
                          <span>42%</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-neutral-950 h-full w-[42%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Áo Sơ Mi & Polo</span>
                          <span>35%</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[35%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Quần Âu & Jean</span>
                          <span>15%</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full w-[15%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span>Phụ Kiện Đồ Da</span>
                          <span>8%</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[8%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 mt-4 text-center">
                    <span className="text-xs text-neutral-500">Dữ liệu được cập nhật tự động mỗi 15 phút</span>
                  </div>
                </div>
              </div>

              {/* RECENT ORDERS TABLE */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">Đơn Hàng Gần Đây Cần Xử Lý</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Danh sách các đơn mới đặt trong ngày</p>
                  </div>
                  <Button 
                    onClick={() => setActiveAdminTab('orders')}
                    size="sm" 
                    className="bg-neutral-950 text-white rounded-xl text-xs font-bold px-4 cursor-pointer"
                  >
                    Xem Toàn Bộ Đơn Hàng
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">Mã Đơn</th>
                        <th className="p-4">Khách Hàng</th>
                        <th className="p-4">Sản Phẩm</th>
                        <th className="p-4">Tổng Tiền</th>
                        <th className="p-4">Trạng Thái</th>
                        <th className="p-4">Ngày Đặt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-neutral-50/70 transition">
                          <td className="p-4 font-bold text-neutral-900">{ord.id}</td>
                          <td className="p-4 font-semibold text-neutral-800">{ord.customer}</td>
                          <td className="p-4 text-neutral-600 max-w-xs truncate">{ord.items}</td>
                          <td className="p-4 font-bold text-neutral-950">{formatPrice(ord.total)}</td>
                          <td className="p-4">
                            {ord.status === 'completed' && (
                              <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {ord.statusText}
                              </span>
                            )}
                            {ord.status === 'delivering' && (
                              <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {ord.statusText}
                              </span>
                            )}
                            {ord.status === 'pending' && (
                              <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {ord.statusText}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-neutral-400">{ord.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB QUẢN LÝ SẢN PHẨM (TUẦN 4) */}
          {activeAdminTab === 'products' && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Quản Lý Danh Sách Sản Phẩm</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Thêm mới, sửa giá, điều chỉnh tồn kho và phân loại</p>
                </div>
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-xl text-xs font-bold px-4 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Hình Ảnh</th>
                      <th className="p-4">Tên Sản Phẩm</th>
                      <th className="p-4">Danh Mục</th>
                      <th className="p-4">Giá Bán</th>
                      <th className="p-4">Tồn Kho</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {[
                      { name: 'Áo Blazer Nam Italian Wool Dáng Slim-fit', category: 'Blazer & Suit', price: 1250000, stock: 45, status: 'Đang bán', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&auto=format&fit=crop' },
                      { name: 'Áo Sơ Mi Trắng Kháng Khuẩn Chống Nhăn', category: 'Áo Sơ Mi', price: 450000, stock: 120, status: 'Đang bán', img: 'https://images.unsplash.com/photo-1620012253295-c15c429fbb3e?q=80&w=200&auto=format&fit=crop' },
                      { name: 'Áo Polo Nam Pima Cotton Bo Dệt', category: 'Áo Polo', price: 380000, stock: 85, status: 'Đang bán', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=200&auto=format&fit=crop' },
                      { name: 'Quần Tây Nam Co Giãn 4 Chiều Xếp Ly', category: 'Quần Âu & Jean', price: 520000, stock: 8, status: 'Sắp hết hàng', img: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=200&auto=format&fit=crop' },
                      { name: 'Áo Khoác Bomber Nam Da Lộn Minimalist', category: 'Blazer & Suit', price: 890000, stock: 24, status: 'Đang bán', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=200&auto=format&fit=crop' },
                    ].map((p, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/70 transition">
                        <td className="p-4">
                          <img src={p.img} alt="p" className="w-10 h-12 rounded-lg object-cover border border-neutral-200" />
                        </td>
                        <td className="p-4 font-semibold text-neutral-900 max-w-xs">{p.name}</td>
                        <td className="p-4 text-neutral-500 font-medium">{p.category}</td>
                        <td className="p-4 font-bold text-neutral-950">{formatPrice(p.price)}</td>
                        <td className="p-4 font-semibold text-neutral-700">{p.stock} cái</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                            p.stock <= 10 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-xs font-semibold text-amber-600 hover:text-amber-700 mr-3">Sửa</button>
                          <button className="text-xs font-semibold text-rose-600 hover:text-rose-700">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB QUẢN LÝ ĐƠN HÀNG (TUẦN 4) */}
          {activeAdminTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Quản Lý Toàn Bộ Đơn Hàng</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Theo dõi luồng đơn hàng từ đặt cọc, đóng gói đến giao nhận</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tìm mã đơn hoặc khách..."
                    className="px-3 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none"
                  />
                  <Button size="sm" variant="outline" className="text-xs rounded-xl font-bold">
                    <Filter className="w-3.5 h-3.5 mr-1" /> Lọc đơn
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Mã Đơn</th>
                      <th className="p-4">Khách Hàng</th>
                      <th className="p-4">Sản Phẩm</th>
                      <th className="p-4">Tổng Tiền</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4">Ngày Đặt</th>
                      <th className="p-4 text-right">Cập Nhật</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50/70 transition">
                        <td className="p-4 font-bold text-neutral-900">{ord.id}</td>
                        <td className="p-4 font-semibold text-neutral-800">{ord.customer}</td>
                        <td className="p-4 text-neutral-600">{ord.items}</td>
                        <td className="p-4 font-bold text-neutral-950">{formatPrice(ord.total)}</td>
                        <td className="p-4">
                          <span className={`font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${
                            ord.status === 'completed' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {ord.statusText}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-400">{ord.date}</td>
                        <td className="p-4 text-right">
                          <select className="bg-neutral-100 border border-neutral-300 rounded-lg text-xs px-2 py-1 outline-none">
                            <option>Đang giao</option>
                            <option>Hoàn thành</option>
                            <option>Hủy đơn</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
