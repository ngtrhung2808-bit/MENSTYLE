import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Trash2,
  Edit,
  Save,
  Image as ImageIcon,
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';
import { MOCK_PRODUCTS, CATEGORIES } from '../../data/mockProducts';
import axiosInstance from '../../api/axiosInstance';

export const AdminDashboard = ({ 
  onBackToClient, 
  onLogout,
  products = MOCK_PRODUCTS,
  onUpdateProducts
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders' | 'customers'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Quản lý sản phẩm cục bộ và đồng bộ
  const [adminProducts, setAdminProducts] = useState(products);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Tất cả');

  // Luôn đồng bộ khi products prop thay đổi
  useEffect(() => {
    if (products && Array.isArray(products)) {
      setAdminProducts(products);
    }
  }, [products]);

  // Modal Thêm / Sửa Sản Phẩm
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Áo Sơ Mi',
    price: 350000,
    originalPrice: 450000,
    discount: 20,
    rating: 5.0,
    reviewCount: 1,
    image: '',
    description: '',
    isNew: true,
  });

  // Tìm kiếm đơn hàng
  const [orderSearch, setOrderSearch] = useState('');

  const [ordersList, setOrdersList] = useState([]);
  const [ordersError, setOrdersError] = useState('');

  const loadOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/orders/admin');
      setOrdersList((data.data || []).map((order) => ({
        ...order, id: order._id || order.id, orderCode: order.orderCode,
        customer: order.customerInfo?.fullName || '', email: order.customerInfo?.email || '', phone: order.customerInfo?.phone || '',
        items: (order.items || []).map((item) => `${item.name} (${item.selectedSize}, x${item.quantity})`).join(', '),
        total: order.grandTotal, status: order.orderStatus, statusText: ({ pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', processing: 'Đang xử lý', delivering: 'Đang giao', completed: 'Hoàn thành', cancelled: 'Đã hủy' })[order.orderStatus] || order.orderStatus,
        date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
      })));
      setOrdersError('');
    } catch (error) { setOrdersError(error.response?.data?.message || 'Không thể tải đơn hàng từ Backend.'); }
  };

  useEffect(() => { loadOrders(); }, []);

  // Danh sách khách hàng đã đăng ký từ hệ thống
  const [customersList, setCustomersList] = useState(() => {
    const saved = localStorage.getItem('menstyle_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Tính toán số liệu thống kê THỰC TẾ 100% không dùng số liệu ảo
  const totalRevenue = ordersList
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const stats = [
    {
      title: 'Doanh Thu Thực Tế',
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue),
      change: ordersList.length > 0 ? `${ordersList.length} đơn` : 'Chưa có đơn',
      isPositive: totalRevenue > 0,
      icon: DollarSign,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: 'Tổng Đơn Hàng',
      value: `${ordersList.length} đơn`,
      change: `${ordersList.filter(o => o.status === 'completed').length} hoàn thành`,
      isPositive: ordersList.length > 0,
      icon: ShoppingBag,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'Khách Hàng Đã Đăng Ký',
      value: `${customersList.length} tài khoản`,
      change: 'Hệ thống thật',
      isPositive: customersList.length > 0,
      icon: Users,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: 'Tổng Sản Phẩm Đang Bán',
      value: `${adminProducts.length} sản phẩm`,
      change: 'Đang hoạt động',
      isPositive: true,
      icon: Layers,
      color: 'text-purple-500 bg-purple-500/10',
    }
  ];

  // ================= CÁC TÍNH NĂNG THAO TÁC SẢN PHẨM =================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Áo Sơ Mi',
      price: 450000,
      originalPrice: 550000,
      discount: 18,
      rating: 5.0,
      reviewCount: 1,
      image: 'https://product.hstatic.net/200000690725/product/47f06833-d647-42a7-a354-f43b10f7e684_80df1a6a0d944bd08335670341d1aa59.jpg',
      description: 'Sản phẩm thời trang nam cao cấp MENSTYLE thiết kế hiện đại...',
      isNew: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category || 'Áo Sơ Mi',
      price: prod.price || 0,
      originalPrice: prod.originalPrice || prod.price || 0,
      discount: prod.discount || 0,
      rating: prod.rating || 5.0,
      reviewCount: prod.reviewCount || 1,
      image: prod.images?.[0] || prod.image || '',
      description: prod.description || '',
      isNew: !!prod.isNew,
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống không?')) {
      const updated = adminProducts.filter(p => p.id !== productId);
      setAdminProducts(updated);
      if (onUpdateProducts) onUpdateProducts(updated);
      localStorage.setItem('menstyle_products', JSON.stringify(updated));
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      alert('Vui lòng nhập tên sản phẩm');
      return;
    }

    let updated;
    if (editingProduct) {
      // Sửa sản phẩm hiện có
      updated = adminProducts.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: productForm.name.trim(),
            category: productForm.category,
            price: Number(productForm.price),
            originalPrice: Number(productForm.originalPrice),
            discount: Number(productForm.discount),
            description: productForm.description,
            images: [productForm.image || p.images?.[0] || 'https://product.hstatic.net/200000690725/product/47f06833-d647-42a7-a354-f43b10f7e684_80df1a6a0d944bd08335670341d1aa59.jpg']
          };
        }
        return p;
      });
    } else {
      // Thêm sản phẩm mới
      const newProd = {
        id: Date.now(),
        name: productForm.name.trim(),
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discount: Number(productForm.discount),
        rating: 5.0,
        reviewCount: 1,
        images: [productForm.image || 'https://product.hstatic.net/200000690725/product/47f06833-d647-42a7-a354-f43b10f7e684_80df1a6a0d944bd08335670341d1aa59.jpg'],
        isNew: true,
        colors: [{ name: 'Đen Sang Trọng', hex: '#1c1917' }],
        sizes: ['S', 'M', 'L', 'XL'],
        description: productForm.description
      };
      updated = [newProd, ...adminProducts];
    }

    setAdminProducts(updated);
    if (onUpdateProducts) onUpdateProducts(updated);
    localStorage.setItem('menstyle_products', JSON.stringify(updated));
    setIsProductModalOpen(false);
  };

  // ================= CÁC TÍNH NĂNG THAO TÁC ĐƠN HÀNG =================
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`/orders/admin/${orderId}/status`, { status: newStatus });
      await loadOrders();
    } catch (error) { setOrdersError(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng.'); }
  };



  // Lọc sản phẩm theo từ khóa và danh mục
  const filteredAdminProducts = adminProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase().trim());
    const matchCat = productCategoryFilter === 'Tất cả' || p.category === productCategoryFilter;
    return matchSearch && matchCat;
  });

  // Lọc đơn hàng theo từ khóa
  const filteredOrdersList = ordersList.filter(o => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase().trim();
    return (o.id && o.id.toLowerCase().includes(q)) || (o.customer && o.customer.toLowerCase().includes(q));
  });

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
              onClick={() => setActiveAdminTab('customers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeAdminTab === 'customers' 
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Khách Hàng (CRM)</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar: Quay lại Client & Đăng xuất */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <button
            onClick={onBackToClient}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold transition border border-neutral-700"
          >
            <ArrowLeft className="w-4 h-4" /> Về Cửa Hàng
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 text-xs font-semibold transition"
            >
              Đăng xuất Admin
            </button>
          )}
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

              {/* BIỂU ĐỒ DOANH THU & ĐƠN HÀNG THỰC TẾ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-100">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">Biểu Đồ Doanh Thu Thực Tế (Theo Đơn Đặt)</h3>
                      <p className="text-xs text-neutral-400">Dữ liệu đơn hàng thực tế ghi nhận từ hệ thống</p>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                      Tổng {ordersList.length} đơn hàng
                    </span>
                  </div>

                  {ordersList.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-2">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-neutral-600">Chưa phát sinh doanh thu từ đơn hàng nào</p>
                      <p className="text-[11px] text-neutral-400 mt-1 max-w-sm">
                        Khi khách hàng đặt hàng tại trang thanh toán, dữ liệu doanh thu thực tế sẽ tự động thống kê lên biểu đồ tại đây.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                          <span className="text-[11px] text-neutral-500 font-medium block">Doanh thu chốt (Hoàn thành)</span>
                          <span className="text-base font-black text-emerald-600">
                            {formatPrice(ordersList.filter(o => o.status === 'completed').reduce((s, o) => s + (Number(o.total) || 0), 0))}
                          </span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                          <span className="text-[11px] text-neutral-500 font-medium block">Đang giao & Chờ duyệt</span>
                          <span className="text-base font-black text-amber-600">
                            {formatPrice(ordersList.filter(o => o.status === 'pending' || o.status === 'delivering').reduce((s, o) => s + (Number(o.total) || 0), 0))}
                          </span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                          <span className="text-[11px] text-neutral-500 font-medium block">Đơn hủy</span>
                          <span className="text-base font-black text-rose-600">
                            {ordersList.filter(o => o.status === 'cancelled').length} đơn
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-xs font-bold text-neutral-700 mb-1.5">
                          <span>Tỷ lệ hoàn thành đơn:</span>
                          <span className="text-emerald-600 font-black">
                            {ordersList.length > 0 
                              ? Math.round((ordersList.filter(o => o.status === 'completed').length / ordersList.length) * 100) 
                              : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-500" 
                            style={{ 
                              width: `${ordersList.length > 0 ? (ordersList.filter(o => o.status === 'completed').length / ordersList.length) * 100 : 0}%` 
                            }} 
                          />
                          <div 
                            className="bg-amber-500 h-full transition-all duration-500" 
                            style={{ 
                              width: `${ordersList.length > 0 ? (ordersList.filter(o => o.status === 'pending' || o.status === 'delivering').length / ordersList.length) * 100 : 0}%` 
                            }} 
                          />
                          <div 
                            className="bg-rose-500 h-full transition-all duration-500" 
                            style={{ 
                              width: `${ordersList.length > 0 ? (ordersList.filter(o => o.status === 'cancelled').length / ordersList.length) * 100 : 0}%` 
                            }} 
                          />
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-neutral-500 mt-2 font-medium">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Hoàn thành</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Đang xử lý</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Đã hủy</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Phân loại tỷ trọng danh mục THỰC TẾ theo số lượng sản phẩm */}
                <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 mb-1">Tỷ Trọng Danh Mục Thực Tế</h3>
                    <p className="text-xs text-neutral-400 mb-4">Dựa trên {adminProducts.length} sản phẩm thực tế trong kho</p>
                    
                    <div className="space-y-3.5 text-xs">
                      {CATEGORIES.filter(c => c !== 'Tất cả').slice(0, 5).map((catName) => {
                        const count = adminProducts.filter(p => p.category === catName).length;
                        const percent = adminProducts.length > 0 ? Math.round((count / adminProducts.length) * 100) : 0;
                        return (
                          <div key={catName}>
                            <div className="flex justify-between font-semibold mb-1">
                              <span>{catName}</span>
                              <span className="font-bold text-neutral-950">{count} món ({percent}%)</span>
                            </div>
                            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-amber-500 h-full transition-all duration-500" 
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 mt-4 text-center">
                    <span className="text-xs text-neutral-500">Dữ liệu tự động cập nhật theo kho hàng</span>
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
                      {ordersError && <tr><td colSpan="7" className="p-3 text-rose-600">{ordersError}</td></tr>}
                      {ordersList.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-neutral-400">
                            Chưa có đơn hàng nào từ khách hàng. Dữ liệu sẽ xuất hiện tại đây ngay khi có đơn mới!
                          </td>
                        </tr>
                      ) : (
                        ordersList.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-neutral-50/70 transition">
                            <td className="p-4 font-bold text-neutral-900">{ord.orderCode || ord.id}</td>
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
                        ))
                      )}
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
                  <h3 className="text-lg font-bold text-neutral-900">Quản Lý Danh Sách Sản Phẩm ({filteredAdminProducts.length} món)</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Thêm mới, sửa giá, điều chỉnh danh mục và xóa sản phẩm tức thì</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  {/* Tìm kiếm */}
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input 
                      type="text" 
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Tìm sản phẩm..."
                      className="w-full pl-8 pr-3 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-950"
                    />
                  </div>
                  {/* Lọc danh mục */}
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none bg-white font-medium"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {/* Nút Thêm */}
                  <Button 
                    onClick={handleOpenAddProduct}
                    size="sm" 
                    className="bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-xl text-xs font-bold px-3.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px] sticky top-0 z-10">
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
                    {filteredAdminProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-10 text-center text-neutral-400">
                          Không tìm thấy sản phẩm nào phù hợp với bộ lọc tìm kiếm!
                        </td>
                      </tr>
                    ) : (
                      filteredAdminProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50/70 transition">
                          <td className="p-4">
                            <img 
                              src={p.images?.[0] || 'https://product.hstatic.net/200000690725/product/47f06833-d647-42a7-a354-f43b10f7e684_80df1a6a0d944bd08335670341d1aa59.jpg'} 
                              alt={p.name} 
                              className="w-10 h-12 rounded-lg object-cover border border-neutral-200" 
                            />
                          </td>
                          <td className="p-4 font-semibold text-neutral-900 max-w-xs">{p.name}</td>
                          <td className="p-4 text-neutral-500 font-medium">{p.category}</td>
                          <td className="p-4 font-bold text-neutral-950">{formatPrice(p.price)}</td>
                          <td className="p-4 font-semibold text-neutral-700">50 cái</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Đang bán
                            </span>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <button 
                              onClick={() => handleOpenEditProduct(p)}
                              className="text-xs font-semibold text-amber-600 hover:text-amber-800 mr-3 cursor-pointer"
                            >
                              Sửa
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
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
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Tìm mã đơn hoặc khách..."
                      className="pl-8 pr-3 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-950"
                    />
                  </div>
                  <Button size="sm" variant="outline" onClick={loadOrders} className="text-xs rounded-xl font-bold">Làm mới</Button>
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
                    {filteredOrdersList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-12 text-center text-neutral-400">
                          {ordersList.length === 0 
                            ? 'Hệ thống hiện tại chưa có đơn hàng nào từ khách. Toàn bộ đơn hàng thật sẽ tự động cập nhật ngay tại đây!' 
                            : 'Không tìm thấy đơn hàng nào phù hợp với từ khóa!'}
                        </td>
                      </tr>
                    ) : (
                      filteredOrdersList.map((ord) => (
                        <tr key={ord.id} className="hover:bg-neutral-50/70 transition">
                          <td className="p-4 font-bold text-neutral-900">{ord.orderCode || ord.id}</td>
                          <td className="p-4 font-semibold text-neutral-800">
                            <div>{ord.customer}</div>
                            {ord.phone && <div className="text-[11px] text-neutral-400 font-normal">{ord.phone}</div>}
                          </td>
                          <td className="p-4 text-neutral-600 max-w-sm">
                            <p className="line-clamp-2">{ord.items}</p>
                            {ord.paymentMethod && (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                                PT: {ord.paymentMethod === 'cod' ? 'COD' : ord.paymentMethod === 'banking' ? 'VietQR' : 'VNPay'}
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-bold text-neutral-950">{formatPrice(ord.total)}</td>
                          <td className="p-4">
                            <span className={`font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${
                              ord.status === 'completed' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : ord.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {ord.statusText || 'Chờ xác nhận'}
                            </span>
                          </td>
                          <td className="p-4 text-neutral-400">{ord.date}</td>
                          <td className="p-4 text-right">
                            <select 
                              value={ord.status || 'pending'}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="bg-neutral-100 border border-neutral-300 rounded-lg text-xs px-2 py-1 outline-none font-medium cursor-pointer"
                            >
                              <option value="pending">Chờ xác nhận</option>
                              <option value="delivering">Đang giao</option>
                              <option value="completed">Hoàn thành</option>
                              <option value="cancelled">Hủy đơn</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB QUẢN LÝ KHÁCH HÀNG (CRM THỰC TẾ) */}
          {activeAdminTab === 'customers' && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Danh Sách Khách Hàng Đăng Ký</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Tài khoản khách hàng thực tế được lưu trữ trên hệ thống</p>
                </div>
                <div className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  Tổng: {customersList.length} khách hàng
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Khách Hàng</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Hạng Thành Viên</th>
                      <th className="p-4">Điểm Tích Lũy</th>
                      <th className="p-4">Ngày Đăng Ký</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {customersList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-12 text-center text-neutral-400">
                          Chưa có tài khoản khách hàng nào đăng ký. Khi khách đăng ký tài khoản mới, dữ liệu sẽ tự động xuất hiện tại đây!
                        </td>
                      </tr>
                    ) : (
                      customersList.map((c, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/70 transition">
                          <td className="p-4 font-bold text-neutral-900 flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-neutral-950 text-amber-400 flex items-center justify-center font-bold text-xs">
                              {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span>{c.name}</span>
                          </td>
                          <td className="p-4 text-neutral-600 font-mono">{c.email}</td>
                          <td className="p-4">
                            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px]">
                              {c.memberLevel || 'Thành Viên Bạc'}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-neutral-950">{c.points || 100} pts</td>
                          <td className="p-4 text-neutral-400">{c.createdAt || 'Mới'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODAL THÊM / SỬA SẢN PHẨM */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div 
                className="bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center">
                      {editingProduct ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">
                        {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {editingProduct ? `ID: ${editingProduct.id}` : 'Nhập thông tin sản phẩm cần đưa lên hệ thống'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsProductModalOpen(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveProduct} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Tên Sản Phẩm <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Ví dụ: Áo Sơ Mi MENSTYLE Oxford Slimfit..."
                      className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Danh Mục</label>
                      <select 
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 bg-white"
                      >
                        {CATEGORIES.filter(c => c !== 'Tất cả').map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Giảm Giá (%)</label>
                      <input 
                        type="number"
                        min="0"
                        max="90"
                        value={productForm.discount}
                        onChange={(e) => setProductForm({ ...productForm, discount: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Giá Bán Hiện Tại (VNĐ) <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        required
                        step="1000"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 font-bold text-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Giá Gốc / Giá Niêm Yết (VNĐ)</label>
                      <input 
                        type="number" 
                        step="1000"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 text-neutral-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Link Ảnh Sản Phẩm (URL)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        placeholder="https://product.hstatic.net/..."
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 font-mono text-[11px]"
                      />
                      {productForm.image && (
                        <img 
                          src={productForm.image} 
                          alt="Preview" 
                          className="w-9 h-9 object-cover rounded-lg border border-neutral-300 shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Mô Tả Sản Phẩm</label>
                    <textarea 
                      rows="3"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Mô tả chất liệu, form dáng, tính năng nổi bật..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 resize-none"
                    ></textarea>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsProductModalOpen(false)}
                      className="text-xs px-4 rounded-xl cursor-pointer"
                    >
                      Hủy Bỏ
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs px-5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> {editingProduct ? 'Cập Nhật Thay Đổi' : 'Lưu Sản Phẩm Mới'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
