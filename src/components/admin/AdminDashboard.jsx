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
  Sparkles,
  Ticket,
  MapPin,
  Calendar,
  Percent,
  CheckCircle,
  XCircle,
  PackageCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import { MOCK_PRODUCTS, CATEGORIES } from '../../data/mockProducts';
import { ORDER_STATUSES, getOrderStatusInfo } from '../../data/orderStatuses';
import { getStoredVouchers, saveStoredVouchers } from '../../data/voucherConfig';

export const AdminDashboard = ({ 
  onBackToClient, 
  onLogout,
  products = MOCK_PRODUCTS,
  onUpdateProducts
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders' | 'customers' | 'vouchers'
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
    discount: 22,
    stock: 50,
    rating: 5.0,
    reviewCount: 1,
    image: '',
    description: '',
    isNew: true,
  });

  // Tìm kiếm đơn hàng
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Danh sách đơn hàng đồng bộ thời gian thực từ Khách hàng
  const [ordersList, setOrdersList] = useState(() => {
    const saved = localStorage.getItem('menstyle_orders');
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

  // ================= QUẢN LÝ MÃ KHUYẾN MÃI (VOUCHERS) =================
  const [vouchersList, setVouchersList] = useState(() => getStoredVouchers());
  const [voucherSearch, setVoucherSearch] = useState('');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    title: '',
    discountType: 'amount', // 'amount' | 'percent'
    discountAmount: 50000,
    percent: 10,
    minOrder: 500000,
    totalCount: 100,
    usedCount: 0,
    expiry: '2026-12-31',
    isActive: true,
    condition: 'Đơn hàng từ 500.000₫'
  });

  // Lưu vouchers khi danh sách thay đổi
  const handleUpdateVouchersList = (newList) => {
    setVouchersList(newList);
    saveStoredVouchers(newList);
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

  // Tính toán số liệu thống kê THỰC TẾ
  const totalRevenue = ordersList
    .filter(o => o.status !== 'cancelled' && o.status !== 'returned')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const stats = [
    {
      title: 'Doanh Thu Thực Tế',
      value: formatPrice(totalRevenue),
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
      title: 'Tổng Mã Khuyến Mãi',
      value: `${vouchersList.length} mã`,
      change: `${vouchersList.reduce((acc, v) => acc + (v.usedCount || 0), 0)} lượt dùng`,
      isPositive: true,
      icon: Ticket,
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
      stock: 50,
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
      name: prod.name || '',
      category: prod.category || 'Áo Sơ Mi',
      price: prod.price || 0,
      originalPrice: prod.originalPrice || prod.price || 0,
      discount: prod.discount || 0,
      stock: prod.totalStock !== undefined ? prod.totalStock : (prod.stock !== undefined ? prod.stock : 50),
      image: prod.images?.[0] || prod.image || '',
      description: prod.description || '',
      isNew: !!prod.isNew,
    });
    setIsProductModalOpen(true);
  };

  // Tính toán chuẩn xác Giá & % Giảm Giá hai chiều
  const handleDiscountChange = (newDiscount) => {
    const d = Math.max(0, Math.min(99, Number(newDiscount) || 0));
    const orig = Number(productForm.originalPrice) || 0;
    const calcPrice = orig > 0 ? Math.round((orig * (1 - d / 100)) / 1000) * 1000 : productForm.price;
    setProductForm(prev => ({
      ...prev,
      discount: d,
      price: calcPrice
    }));
  };

  const handleOriginalPriceChange = (newOriginal) => {
    const orig = Math.max(0, Number(newOriginal) || 0);
    const d = Number(productForm.discount) || 0;
    const calcPrice = orig > 0 && d > 0 ? Math.round((orig * (1 - d / 100)) / 1000) * 1000 : orig;
    setProductForm(prev => ({
      ...prev,
      originalPrice: orig,
      price: d > 0 ? calcPrice : prev.price
    }));
  };

  const handlePriceChange = (newPrice) => {
    const pr = Math.max(0, Number(newPrice) || 0);
    const orig = Number(productForm.originalPrice) || 0;
    let d = 0;
    if (orig > 0 && pr <= orig) {
      d = Math.round(((orig - pr) / orig) * 100);
    }
    setProductForm(prev => ({
      ...prev,
      price: pr,
      discount: d
    }));
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

    const stockVal = Math.max(0, Number(productForm.stock) || 0);

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
            stock: stockVal,
            totalStock: stockVal,
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
        stock: stockVal,
        totalStock: stockVal,
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
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const sInfo = getOrderStatusInfo(newStatus);
    const updated = ordersList.map(o => o.id === orderId ? { ...o, status: newStatus, statusText: sInfo.label } : o);
    setOrdersList(updated);
    localStorage.setItem('menstyle_orders', JSON.stringify(updated));
  };

  const handleClearAllOrders = () => {
    if (window.confirm('Quý khách có chắc chắn muốn làm sạch toàn bộ đơn hàng trong hệ thống không?')) {
      setOrdersList([]);
      localStorage.setItem('menstyle_orders', JSON.stringify([]));
    }
  };

  // ================= CÁC TÍNH NĂNG THAO TÁC MÃ KHUYẾN MÃI =================
  const handleOpenAddVoucher = () => {
    setEditingVoucher(null);
    setVoucherForm({
      code: '',
      title: '',
      discountType: 'amount',
      discountAmount: 50000,
      percent: 10,
      minOrder: 500000,
      totalCount: 100,
      usedCount: 0,
      expiry: '2026-12-31',
      isActive: true,
      condition: 'Đơn hàng từ 500.000₫'
    });
    setIsVoucherModalOpen(true);
  };

  const handleOpenEditVoucher = (v) => {
    setEditingVoucher(v);
    setVoucherForm({
      code: v.code || '',
      title: v.title || '',
      discountType: v.percent && v.percent > 0 ? 'percent' : 'amount',
      discountAmount: v.discountAmount || 0,
      percent: v.percent || 0,
      minOrder: v.minOrder || 0,
      totalCount: v.totalCount || 100,
      usedCount: v.usedCount || 0,
      expiry: v.expiry || '2026-12-31',
      isActive: v.isActive !== false,
      condition: v.condition || ''
    });
    setIsVoucherModalOpen(true);
  };

  const handleSaveVoucher = (e) => {
    e.preventDefault();
    if (!voucherForm.code.trim()) {
      alert('Vui lòng nhập mã khuyến mãi!');
      return;
    }
    const cleanCode = voucherForm.code.trim().toUpperCase();

    // Check trùng mã nếu tạo mới
    if (!editingVoucher && vouchersList.some(v => v.code.toUpperCase() === cleanCode)) {
      alert('Mã khuyến mãi này đã tồn tại! Vui lòng chọn mã khác.');
      return;
    }

    const payload = {
      id: editingVoucher ? editingVoucher.id : 'v-' + Date.now(),
      code: cleanCode,
      title: voucherForm.title.trim() || `Ưu đãi ${cleanCode}`,
      discountAmount: voucherForm.discountType === 'amount' ? Number(voucherForm.discountAmount) : 0,
      percent: voucherForm.discountType === 'percent' ? Number(voucherForm.percent) : 0,
      minOrder: Number(voucherForm.minOrder) || 0,
      totalCount: Number(voucherForm.totalCount) || 100,
      usedCount: editingVoucher ? (editingVoucher.usedCount || 0) : 0,
      expiry: voucherForm.expiry,
      isActive: voucherForm.isActive,
      condition: voucherForm.condition || (voucherForm.minOrder > 0 ? `Đơn hàng từ ${formatPrice(voucherForm.minOrder)}` : 'Áp dụng cho mọi đơn hàng')
    };

    let updated;
    if (editingVoucher) {
      updated = vouchersList.map(v => v.id === editingVoucher.id ? { ...payload, usedCount: v.usedCount } : v);
    } else {
      updated = [payload, ...vouchersList];
    }

    handleUpdateVouchersList(updated);
    setIsVoucherModalOpen(false);
  };

  const handleDeleteVoucher = (vId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mã khuyến mãi này không?')) {
      const updated = vouchersList.filter(v => v.id !== vId);
      handleUpdateVouchersList(updated);
    }
  };

  const handleToggleVoucherStatus = (vId) => {
    const updated = vouchersList.map(v => {
      if (v.id === vId) {
        return { ...v, isActive: !v.isActive };
      }
      return v;
    });
    handleUpdateVouchersList(updated);
  };

  // Bộ lọc sản phẩm
  const filteredAdminProducts = adminProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                        p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = productCategoryFilter === 'Tất cả' || p.category === productCategoryFilter;
    return matchSearch && matchCat;
  });

  // Bộ lọc đơn hàng
  const filteredOrdersList = ordersList.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                        o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        (o.phone && o.phone.includes(orderSearch)) ||
                        (o.address && o.address.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  // Bộ lọc voucher
  const filteredVouchers = vouchersList.filter(v => {
    return v.code.toLowerCase().includes(voucherSearch.toLowerCase()) ||
           (v.title && v.title.toLowerCase().includes(voucherSearch.toLowerCase()));
  });

  // Thống kê Vouchers
  const totalVouchersCount = vouchersList.length;
  const activeVouchersCount = vouchersList.filter(v => v.isActive !== false).length;
  const totalVoucherUses = vouchersList.reduce((acc, v) => acc + (v.usedCount || 0), 0);
  const totalRemainingVoucherUses = vouchersList.reduce((acc, v) => acc + Math.max(0, (v.totalCount || 0) - (v.usedCount || 0)), 0);

  return (
    <div className="min-h-screen bg-neutral-100 flex font-sans text-neutral-800">
      {/* 1. SIDEBAR QUẢN TRỊ VIÊN */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-950 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xl">
                M
              </div>
              <div>
                <span className="text-lg font-black tracking-widest text-white uppercase block leading-none">MENSTYLE</span>
                <span className="text-[10px] tracking-wider text-amber-400 font-bold uppercase mt-1 block">Hệ Thống Quản Trị</span>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveAdminTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeAdminTab === 'dashboard' 
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tổng Quan Hệ Thống</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeAdminTab === 'products' 
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <div className="flex-1 text-left flex justify-between items-center">
                <span>Quản Lý Sản Phẩm</span>
                <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full">{adminProducts.length}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeAdminTab === 'orders' 
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <div className="flex-1 text-left flex justify-between items-center">
                <span>Quản Lý Đơn Hàng</span>
                {ordersList.length > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">{ordersList.length}</span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('vouchers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeAdminTab === 'vouchers' 
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <div className="flex-1 text-left flex justify-between items-center">
                <span>Quản Lý Mã Khuyến Mãi</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">{vouchersList.length}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveAdminTab('customers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
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

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <button
            onClick={onBackToClient}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold transition border border-neutral-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Về Cửa Hàng
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 text-xs font-semibold transition cursor-pointer"
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
              <span className="text-neutral-900 capitalize">
                {activeAdminTab === 'dashboard' ? 'Tổng quan' :
                 activeAdminTab === 'products' ? 'Sản phẩm' :
                 activeAdminTab === 'orders' ? 'Đơn hàng' :
                 activeAdminTab === 'vouchers' ? 'Mã khuyến mãi' : 'Khách hàng'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-3 border-l border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-neutral-900 block leading-tight">Admin Quản Trị</span>
                <span className="text-[10px] text-neutral-400">Chủ sở hữu hệ thống</span>
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

              {/* RECENT ORDERS TABLE */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">Đơn Hàng Mới Nhất</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Danh sách các đơn mới đặt trong ngày</p>
                  </div>
                  <Button 
                    onClick={() => setActiveAdminTab('orders')}
                    size="sm" 
                    className="bg-neutral-950 text-white rounded-xl text-xs font-bold px-4 cursor-pointer"
                  >
                    Xem Toàn Bộ Đơn Hàng ({ordersList.length})
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">Mã Đơn</th>
                        <th className="p-4">Khách Hàng</th>
                        <th className="p-4">Địa Chỉ Giao Hàng</th>
                        <th className="p-4">Tổng Tiền</th>
                        <th className="p-4">Trạng Thái</th>
                        <th className="p-4">Ngày Đặt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {ordersList.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-neutral-400">
                            Chưa có đơn hàng nào từ khách hàng. Dữ liệu sẽ xuất hiện tại đây ngay khi có đơn mới!
                          </td>
                        </tr>
                      ) : (
                        ordersList.slice(0, 5).map((ord) => {
                          const sInfo = getOrderStatusInfo(ord.status);
                          return (
                            <tr key={ord.id} className="hover:bg-neutral-50/70 transition">
                              <td className="p-4 font-bold text-neutral-900">{ord.id}</td>
                              <td className="p-4 font-medium text-neutral-800">
                                <div>{ord.customer}</div>
                                {ord.phone && <div className="text-[11px] text-neutral-400">{ord.phone}</div>}
                              </td>
                              <td className="p-4 text-neutral-600 max-w-xs">
                                <div className="flex items-start gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <span className="line-clamp-2">{ord.address || 'Chưa cung cấp'}</span>
                                </div>
                              </td>
                              <td className="p-4 font-bold text-neutral-950">{formatPrice(ord.total)}</td>
                              <td className="p-4">
                                <span className={`font-bold px-2.5 py-1 rounded-full border text-[11px] inline-flex items-center gap-1 ${sInfo.color}`}>
                                  {sInfo.label}
                                </span>
                              </td>
                              <td className="p-4 text-neutral-400">{ord.date}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB QUẢN LÝ SẢN PHẨM */}
          {activeAdminTab === 'products' && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Quản Lý Sản Phẩm Kho Hàng</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Thêm mới, sửa giá, điều chỉnh giảm giá & cập nhật tồn kho thời gian thực</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="pl-8 pr-3 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-950 w-full sm:w-48"
                    />
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none bg-white font-medium"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <Button 
                    onClick={handleOpenAddProduct}
                    size="sm" 
                    className="bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-xl text-xs font-bold px-3.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Thêm Sản Phẩm
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
                      <th className="p-4">Giảm Giá</th>
                      <th className="p-4">Tồn Kho</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredAdminProducts.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-10 text-center text-neutral-400">
                          Không tìm thấy sản phẩm nào phù hợp với bộ lọc tìm kiếm!
                        </td>
                      </tr>
                    ) : (
                      filteredAdminProducts.map((p) => {
                        const stockCount = p.totalStock !== undefined ? p.totalStock : (p.stock !== undefined ? p.stock : 50);
                        return (
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
                            <td className="p-4">
                              <div className="font-bold text-neutral-950">{formatPrice(p.price)}</div>
                              {p.originalPrice > p.price && (
                                <div className="text-[10px] text-neutral-400 line-through">{formatPrice(p.originalPrice)}</div>
                              )}
                            </td>
                            <td className="p-4">
                              {p.discount > 0 ? (
                                <span className="bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold">
                                  -{p.discount}%
                                </span>
                              ) : (
                                <span className="text-neutral-400 text-[11px]">-</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                                stockCount <= 0 
                                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                                  : stockCount <= 5 
                                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                {stockCount <= 0 ? 'Hết hàng (0)' : `${stockCount} sản phẩm`}
                              </span>
                            </td>
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
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB QUẢN LÝ ĐƠN HÀNG - ĐẦY ĐỦ 8 TRẠNG THÁI & HIỂN THỊ ĐỊA CHỈ KHÁCH HÀNG */}
          {activeAdminTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Quản Lý Toàn Bộ Đơn Hàng</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Đồng bộ đầy đủ địa chỉ giao hàng & luồng 8 trạng thái đơn</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Tìm mã đơn, tên, sđt, địa chỉ..."
                      className="pl-8 pr-3 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-950 w-52"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none bg-white font-medium"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    {ORDER_STATUSES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>

                  {ordersList.length > 0 && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleClearAllOrders}
                      className="text-xs rounded-xl font-bold text-rose-600 hover:bg-rose-50 border-rose-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
                    </Button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Mã Đơn</th>
                      <th className="p-4">Khách Hàng</th>
                      <th className="p-4">Địa Chỉ Giao Hàng Đầy Đủ</th>
                      <th className="p-4">Sản Phẩm Đặt</th>
                      <th className="p-4">Tổng Tiền</th>
                      <th className="p-4">Trạng Thái Đơn</th>
                      <th className="p-4">Ngày Đặt</th>
                      <th className="p-4 text-right">Cập Nhật Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredOrdersList.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-12 text-center text-neutral-400">
                          {ordersList.length === 0 
                            ? 'Hệ thống hiện tại chưa có đơn hàng nào từ khách. Toàn bộ đơn hàng thật sẽ tự động cập nhật ngay tại đây!' 
                            : 'Không tìm thấy đơn hàng nào phù hợp với từ khóa!'}
                        </td>
                      </tr>
                    ) : (
                      filteredOrdersList.map((ord) => {
                        const sInfo = getOrderStatusInfo(ord.status);
                        return (
                          <tr key={ord.id} className="hover:bg-neutral-50/70 transition">
                            <td className="p-4 font-bold text-neutral-900 whitespace-nowrap">#{ord.id}</td>
                            <td className="p-4 font-semibold text-neutral-800 whitespace-nowrap">
                              <div>{ord.customer}</div>
                              {ord.phone && <div className="text-[11px] text-neutral-400 font-normal">{ord.phone}</div>}
                              {ord.email && <div className="text-[10px] text-neutral-400 font-normal">{ord.email}</div>}
                            </td>
                            <td className="p-4 text-neutral-700 max-w-xs">
                              <div className="flex items-start gap-1.5 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <span className="font-medium text-[11px] leading-relaxed">
                                  {ord.address || 'Chưa cung cấp thông tin địa chỉ'}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-neutral-600 max-w-xs">
                              <p className="line-clamp-2">{ord.items}</p>
                              {ord.paymentMethod && (
                                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                                  PT: {ord.paymentMethod === 'cod' ? 'COD (Tiền mặt)' : ord.paymentMethod === 'banking' ? 'VietQR' : ord.paymentMethod.toUpperCase()}
                                </span>
                              )}
                            </td>
                            <td className="p-4 font-bold text-neutral-950 whitespace-nowrap">{formatPrice(ord.total)}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={`font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${sInfo.color}`}>
                                {sInfo.label}
                              </span>
                            </td>
                            <td className="p-4 text-neutral-400 whitespace-nowrap">{ord.date}</td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <select 
                                value={ord.status || 'pending'}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className="bg-white border border-neutral-300 rounded-lg text-xs px-2.5 py-1.5 outline-none font-semibold cursor-pointer shadow-2xs hover:border-neutral-500"
                              >
                                {ORDER_STATUSES.map(s => (
                                  <option key={s.id} value={s.id}>{s.label}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB QUẢN LÝ MÃ KHUYẾN MÃI (VOUCHERS) */}
          {activeAdminTab === 'vouchers' && (
            <div className="space-y-6">
              {/* Thống kê Voucher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Tổng Số Loại Mã</span>
                  <div className="text-2xl font-black text-neutral-950">{totalVouchersCount} Mã</div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Đang lưu trữ trên hệ thống</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Mã Đang Kích Hoạt</span>
                  <div className="text-2xl font-black text-emerald-600">{activeVouchersCount} Mã</div>
                  <span className="text-[11px] text-emerald-600 mt-1 block">Sẵn sàng để khách nhập</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Tổng Lượt Đã Sử Dụng</span>
                  <div className="text-2xl font-black text-amber-600">{totalVoucherUses} Lượt</div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Khách đã áp dụng vào đơn</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Tổng Lượt Còn Lại (Chưa Dùng)</span>
                  <div className="text-2xl font-black text-purple-600">{totalRemainingVoucherUses} Lượt</div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Hạn mức phát hành còn tồn</span>
                </div>
              </div>

              {/* Bảng danh sách Vouchers */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Danh Sách Mã Khuyến Mãi (Voucher)</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Quy tắc: <strong>Mỗi khách hàng chỉ được sử dụng mã khuyến mãi 1 lần cho từng loại mã</strong>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={voucherSearch}
                        onChange={(e) => setVoucherSearch(e.target.value)}
                        placeholder="Tìm kiếm mã code..."
                        className="pl-8 pr-3 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-950 w-full sm:w-48"
                      />
                    </div>
                    <Button 
                      onClick={handleOpenAddVoucher}
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold px-3.5 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" /> Thêm Mã Khuyến Mãi Mới
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">Mã Code</th>
                        <th className="p-4">Tên Chương Trình</th>
                        <th className="p-4">Giá Trị Giảm</th>
                        <th className="p-4">Đơn Tối Thiểu</th>
                        <th className="p-4">Số Lượng Phát Hành</th>
                        <th className="p-4">Đã Dùng / Còn Lại</th>
                        <th className="p-4">Hạn Sử Dụng</th>
                        <th className="p-4">Trạng Thái</th>
                        <th className="p-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredVouchers.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="p-10 text-center text-neutral-400">
                            Không tìm thấy mã khuyến mãi nào phù hợp!
                          </td>
                        </tr>
                      ) : (
                        filteredVouchers.map((v) => {
                          const remaining = Math.max(0, (v.totalCount || 0) - (v.usedCount || 0));
                          return (
                            <tr key={v.id} className="hover:bg-neutral-50/70 transition">
                              <td className="p-4 font-black text-purple-700 font-mono text-sm tracking-wider">
                                {v.code}
                              </td>
                              <td className="p-4 font-semibold text-neutral-800">{v.title}</td>
                              <td className="p-4 font-bold text-neutral-950">
                                {v.percent && v.percent > 0 ? (
                                  <span className="text-rose-600">Giảm {v.percent}%</span>
                                ) : (
                                  <span className="text-emerald-600">Giảm {formatPrice(v.discountAmount)}</span>
                                )}
                              </td>
                              <td className="p-4 text-neutral-600">{v.minOrder > 0 ? formatPrice(v.minOrder) : '0₫ (Mọi đơn)'}</td>
                              <td className="p-4 font-semibold text-neutral-800">{v.totalCount} lượt</td>
                              <td className="p-4">
                                <div className="font-semibold text-neutral-900">
                                  <span className="text-amber-600 font-bold">{v.usedCount || 0}</span> đã dùng / <span className="text-emerald-600 font-bold">{remaining}</span> còn lại
                                </div>
                                <div className="w-24 bg-neutral-200 h-1.5 rounded-full overflow-hidden mt-1">
                                  <div 
                                    className="bg-purple-600 h-full" 
                                    style={{ width: `${Math.min(100, Math.round(((v.usedCount || 0) / (v.totalCount || 1)) * 100))}%` }}
                                  />
                                </div>
                              </td>
                              <td className="p-4 text-neutral-500 font-medium">{v.expiry}</td>
                              <td className="p-4">
                                <button
                                  type="button"
                                  onClick={() => handleToggleVoucherStatus(v.id)}
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                                    v.isActive !== false 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                      : 'bg-neutral-100 text-neutral-500 border-neutral-300 hover:bg-neutral-200'
                                  }`}
                                >
                                  {v.isActive !== false ? '● Đang kích hoạt' : '○ Tạm khóa'}
                                </button>
                              </td>
                              <td className="p-4 text-right whitespace-nowrap">
                                <button 
                                  onClick={() => handleOpenEditVoucher(v)}
                                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 mr-3 cursor-pointer"
                                >
                                  Sửa
                                </button>
                                <button 
                                  onClick={() => handleDeleteVoucher(v.id)}
                                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
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
                      <th className="p-4">Số Điện Thoại</th>
                      <th className="p-4">Hạng Thành Viên</th>
                      <th className="p-4">Điểm Tích Lũy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {customersList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-10 text-center text-neutral-400">
                          Chưa có tài khoản khách hàng nào đăng ký mới. Dữ liệu sẽ tự động xuất hiện khi người dùng đăng ký tài khoản!
                        </td>
                      </tr>
                    ) : (
                      customersList.map((user, i) => (
                        <tr key={i} className="hover:bg-neutral-50/70 transition">
                          <td className="p-4 font-bold text-neutral-900 flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-neutral-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                              {user.name ? user.name[0].toUpperCase() : 'U'}
                            </div>
                            <span>{user.name || 'Quý Khách'}</span>
                          </td>
                          <td className="p-4 text-neutral-600">{user.email}</td>
                          <td className="p-4 text-neutral-600">{user.phone || 'Chưa cung cấp'}</td>
                          <td className="p-4">
                            <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                              {user.memberLevel || 'VIP Standard'}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-neutral-950">{user.points || 0} điểm</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= MODAL THÊM / SỬA SẢN PHẨM ================= */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
              <div 
                className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm"
                onClick={() => setIsProductModalOpen(false)}
              />

              <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <h3 className="text-base font-bold text-neutral-950">
                    {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới Vào Hệ Thống'}
                  </h3>
                  <button 
                    onClick={() => setIsProductModalOpen(false)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Tên Sản Phẩm <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="VD: Áo Sơ Mi Oxford Cotton Cao Cấp..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500"
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
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Số Lượng Tồn Kho <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="number"
                        min="0"
                        required
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 font-bold"
                      />
                    </div>
                  </div>

                  {/* KHỐI TÍNH TOÁN GIÁ & GIẢM GIÁ TỰ ĐỘNG CHUẨN XÁC */}
                  <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5 text-amber-600" /> Thiết Lập Giá Bán & Giảm Giá (%)
                      </span>
                      {productForm.discount > 0 && (
                        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Tiết kiệm: {formatPrice(Math.max(0, productForm.originalPrice - productForm.price))}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">Giá Gốc Niêm Yết (₫)</label>
                        <input 
                          type="number" 
                          step="1000"
                          min="0"
                          value={productForm.originalPrice}
                          onChange={(e) => handleOriginalPriceChange(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs outline-none focus:border-amber-500 bg-white font-medium text-neutral-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">Giảm Giá (%)</label>
                        <input 
                          type="number"
                          min="0"
                          max="99"
                          value={productForm.discount}
                          onChange={(e) => handleDiscountChange(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs outline-none focus:border-amber-500 bg-white font-bold text-rose-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-900 mb-1">Giá Bán Thực Tế (₫) *</label>
                        <input 
                          type="number" 
                          required
                          step="1000"
                          min="0"
                          value={productForm.price}
                          onChange={(e) => handlePriceChange(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-amber-400 rounded-lg text-xs outline-none focus:border-amber-600 bg-white font-black text-neutral-950"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-400 italic">
                      * Giá bán và % giảm giá tự động cập nhật đồng bộ theo thời gian thực khi bạn thay đổi một trong hai ô.
                    </p>
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

          {/* ================= MODAL THÊM / SỬA MÃ KHUYẾN MÃI (VOUCHER) ================= */}
          {isVoucherModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
              <div 
                className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm"
                onClick={() => setIsVoucherModalOpen(false)}
              />

              <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-bold text-neutral-950">
                      {editingVoucher ? 'Chỉnh Sửa Mã Khuyến Mãi' : 'Thêm Mã Khuyến Mãi Mới'}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsVoucherModalOpen(false)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveVoucher} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Mã Code Khuyến Mãi <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={voucherForm.code}
                        onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                        placeholder="VD: MEN50, VIPMEN, TET2026..."
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs uppercase font-mono font-bold outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Số Lượng Mã Phát Hành <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={voucherForm.totalCount}
                        onChange={(e) => setVoucherForm({ ...voucherForm, totalCount: Number(e.target.value) })}
                        placeholder="VD: 100"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-purple-600 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Tên Chương Trình Khuyến Mãi <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={voucherForm.title}
                      onChange={(e) => setVoucherForm({ ...voucherForm, title: e.target.value })}
                      placeholder="VD: Giảm ngay 50.000₫ cho khách hàng mới..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 space-y-3">
                    <label className="block text-xs font-bold text-neutral-800">Loại Hình Giảm Giá</label>
                    
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                        <input 
                          type="radio"
                          name="discountType"
                          value="amount"
                          checked={voucherForm.discountType === 'amount'}
                          onChange={() => setVoucherForm({ ...voucherForm, discountType: 'amount' })}
                          className="accent-purple-600 cursor-pointer"
                        />
                        <span>Giảm theo số tiền (VNĐ)</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                        <input 
                          type="radio"
                          name="discountType"
                          value="percent"
                          checked={voucherForm.discountType === 'percent'}
                          onChange={() => setVoucherForm({ ...voucherForm, discountType: 'percent' })}
                          className="accent-purple-600 cursor-pointer"
                        />
                        <span>Giảm theo phần trăm (%)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {voucherForm.discountType === 'amount' ? (
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">Số Tiền Giảm (₫)</label>
                          <input 
                            type="number"
                            step="1000"
                            min="1000"
                            required
                            value={voucherForm.discountAmount}
                            onChange={(e) => setVoucherForm({ ...voucherForm, discountAmount: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 border border-purple-300 rounded-lg text-xs bg-white font-bold text-purple-900 outline-none"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">Phần Trăm Giảm (%)</label>
                          <input 
                            type="number"
                            min="1"
                            max="90"
                            required
                            value={voucherForm.percent}
                            onChange={(e) => setVoucherForm({ ...voucherForm, percent: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 border border-purple-300 rounded-lg text-xs bg-white font-bold text-purple-900 outline-none"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">Đơn Tối Thiểu Áp Dụng (₫)</label>
                        <input 
                          type="number"
                          step="1000"
                          min="0"
                          value={voucherForm.minOrder}
                          onChange={(e) => setVoucherForm({ ...voucherForm, minOrder: Number(e.target.value) })}
                          placeholder="0 = Mọi đơn"
                          className="w-full px-3 py-1.5 border border-purple-300 rounded-lg text-xs bg-white font-medium outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Hạn Sử Dụng (Ngày hết hạn)</label>
                      <input 
                        type="date"
                        required
                        value={voucherForm.expiry}
                        onChange={(e) => setVoucherForm({ ...voucherForm, expiry: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-purple-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Trạng Thái Kích Hoạt</label>
                      <select 
                        value={voucherForm.isActive ? 'true' : 'false'}
                        onChange={(e) => setVoucherForm({ ...voucherForm, isActive: e.target.value === 'true' })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-purple-600 bg-white font-medium"
                      >
                        <option value="true">Đang kích hoạt (Cho phép dùng)</option>
                        <option value="false">Tạm khóa (Không cho dùng)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Hệ thống tự động thực thi quy tắc: <strong>Mỗi khách hàng chỉ được sử dụng mã này duy nhất 1 lần</strong> trên toàn bộ lịch sử mua sắm.
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsVoucherModalOpen(false)}
                      className="text-xs px-4 rounded-xl cursor-pointer"
                    >
                      Hủy Bỏ
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" /> {editingVoucher ? 'Cập Nhật Voucher' : 'Lưu & Phát Hành Mã'}
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
