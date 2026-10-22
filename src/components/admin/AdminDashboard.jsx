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
  PackageCheck,
  ShieldCheck,
  RotateCcw,
  Star,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  Bot,
  Palette,
  Settings,
  Warehouse,
  Truck,
  Eye,
  EyeOff,
  UserCheck,
  History,
  Lock,
  Tag,
  Sliders,
  Send,
  CornerDownRight,
  HelpCircle,
  Award,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '../common/Button';
import { MOCK_PRODUCTS, CATEGORIES } from '../../data/mockProducts';
import { ORDER_STATUSES, getOrderStatusInfo } from '../../data/orderStatuses';
import { getStoredVouchers, saveStoredVouchers } from '../../data/voucherConfig';
import { getStoredReviews, saveStoredReviews } from '../../data/reviewData';
import { getStoredStaff, saveStoredStaff, getStoredAuditLogs, logAdminAction } from '../../data/settingsData';
import { getStoredBanners, saveStoredBanners, getStoredStorefrontConfig, saveStoredStorefrontConfig } from '../../data/storefrontData';

export const AdminDashboard = ({ 
  onBackToClient, 
  onLogout,
  products = MOCK_PRODUCTS,
  onUpdateProducts
}) => {
  // 12 Mục Menu Chuẩn Sidebar theo yêu cầu:
  // 'dashboard' | 'products' | 'inventory' | 'orders' | 'returns' | 'customers' | 'vouchers' | 'reviews' | 'reports' | 'ai-assistant' | 'storefront' | 'settings'
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
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
  const [customersList] = useState(() => {
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

  // ================= 4. QUẢN LÝ ĐÁNH GIÁ SẢN PHẨM (REVIEWS) =================
  const [reviewsList, setReviewsList] = useState(() => getStoredReviews());
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewFilterRating, setReviewFilterRating] = useState('ALL');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReviewForReply, setSelectedReviewForReply] = useState(null);
  const [replyText, setReplyText] = useState('');

  // ================= 5. CÀI ĐẶT & PHÂN QUYỀN (SETTINGS) =================
  const [staffList, setStaffList] = useState(() => getStoredStaff());
  const [auditLogsList, setAuditLogsList] = useState(() => getStoredAuditLogs());
  const [adminPasswordForm, setAdminPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // ================= 6. QUẢN LÝ GIAO DIỆN CỬA HÀNG (STOREFRONT CMS) =================
  const [bannersList, setBannersList] = useState(() => getStoredBanners());
  const [storefrontConfig, setStorefrontConfig] = useState(() => getStoredStorefrontConfig());
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    desc: '',
    image: '',
    category: 'Áo Sơ Mi',
    ctaText: 'Mua Ngay'
  });
  const [storefrontSuccess, setStorefrontSuccess] = useState('');

  // Format tiền tệ
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
      title: 'Đánh Giá Khách Hàng',
      value: `${reviewsList.length} lượt`,
      change: `${reviewsList.filter(r => r.rating >= 4).length} tích cực`,
      isPositive: true,
      icon: Star,
      color: 'text-amber-500 bg-amber-500/10',
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

  const handleDiscountChange = (newDiscount) => {
    const d = Math.max(0, Math.min(99, Number(newDiscount) || 0));
    const orig = Number(productForm.originalPrice) || 0;
    const calcPrice = orig > 0 ? Math.round((orig * (1 - d / 100)) / 1000) * 1000 : productForm.price;
    setProductForm(prev => ({ ...prev, discount: d, price: calcPrice }));
  };

  const handleOriginalPriceChange = (newOriginal) => {
    const orig = Math.max(0, Number(newOriginal) || 0);
    const d = Number(productForm.discount) || 0;
    const calcPrice = orig > 0 && d > 0 ? Math.round((orig * (1 - d / 100)) / 1000) * 1000 : orig;
    setProductForm(prev => ({ ...prev, originalPrice: orig, price: d > 0 ? calcPrice : prev.price }));
  };

  const handlePriceChange = (newPrice) => {
    const pr = Math.max(0, Number(newPrice) || 0);
    const orig = Number(productForm.originalPrice) || 0;
    let d = 0;
    if (orig > 0 && pr <= orig) {
      d = Math.round(((orig - pr) / orig) * 100);
    }
    setProductForm(prev => ({ ...prev, price: pr, discount: d }));
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống không?')) {
      const updated = adminProducts.filter(p => p.id !== productId);
      setAdminProducts(updated);
      if (onUpdateProducts) onUpdateProducts(updated);
      localStorage.setItem('menstyle_products', JSON.stringify(updated));
      logAdminAction('Admin', 'Xóa sản phẩm', `Xóa sản phẩm ID: ${productId}`, 'danger');
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
      logAdminAction('Admin', 'Chỉnh sửa sản phẩm', productForm.name, 'warning');
    } else {
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
      logAdminAction('Admin', 'Thêm sản phẩm mới', productForm.name, 'success');
    }

    setAdminProducts(updated);
    if (onUpdateProducts) onUpdateProducts(updated);
    localStorage.setItem('menstyle_products', JSON.stringify(updated));
    setIsProductModalOpen(false);
  };

  // Cập nhật tồn kho nhanh từ tab Quản lý Kho Hàng
  const handleQuickUpdateStock = (productId, newStock) => {
    const val = Math.max(0, Number(newStock) || 0);
    const updated = adminProducts.map(p => p.id === productId ? { ...p, stock: val, totalStock: val } : p);
    setAdminProducts(updated);
    if (onUpdateProducts) onUpdateProducts(updated);
    localStorage.setItem('menstyle_products', JSON.stringify(updated));
  };

  // ================= CÁC TÍNH NĂNG THAO TÁC ĐƠN HÀNG =================
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const sInfo = getOrderStatusInfo(newStatus);
    const updated = ordersList.map(o => o.id === orderId ? { ...o, status: newStatus, statusText: sInfo.label } : o);
    setOrdersList(updated);
    localStorage.setItem('menstyle_orders', JSON.stringify(updated));
    logAdminAction('Admin', 'Cập nhật trạng thái đơn', `Đơn #${orderId} -> ${sInfo.label}`, 'info');
  };

  const handleClearAllOrders = () => {
    if (window.confirm('Quý khách có chắc chắn muốn làm sạch toàn bộ đơn hàng trong hệ thống không?')) {
      setOrdersList([]);
      localStorage.setItem('menstyle_orders', JSON.stringify([]));
      logAdminAction('Admin', 'Xóa tất cả đơn hàng', 'Toàn bộ đơn hàng đã dọn dẹp', 'danger');
    }
  };

  // ================= THAO TÁC MÃ KHUYẾN MÃI (VOUCHERS) =================
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

    setVouchersList(updated);
    saveStoredVouchers(updated);
    logAdminAction('Admin', editingVoucher ? 'Cập nhật mã voucher' : 'Tạo mới mã voucher', cleanCode, 'primary');
    setIsVoucherModalOpen(false);
  };

  const handleDeleteVoucher = (vId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mã khuyến mãi này không?')) {
      const updated = vouchersList.filter(v => v.id !== vId);
      setVouchersList(updated);
      saveStoredVouchers(updated);
    }
  };

  const handleToggleVoucherStatus = (vId) => {
    const updated = vouchersList.map(v => v.id === vId ? { ...v, isActive: !v.isActive } : v);
    setVouchersList(updated);
    saveStoredVouchers(updated);
  };

  // ================= 4. THAO TÁC ĐÁNH GIÁ (REVIEWS) =================
  const handleToggleReviewStatus = (reviewId) => {
    const updated = reviewsList.map(r => {
      if (r.id === reviewId) {
        const nextStatus = r.status === 'visible' ? 'hidden' : 'visible';
        logAdminAction('Admin', nextStatus === 'hidden' ? 'Ẩn đánh giá vi phạm' : 'Hiện lại đánh giá', `Review ID: ${reviewId}`, 'warning');
        return { ...r, status: nextStatus };
      }
      return r;
    });
    setReviewsList(updated);
    saveStoredReviews(updated);
  };

  const handleOpenReplyReview = (review) => {
    setSelectedReviewForReply(review);
    setReplyText(review.adminReply || '');
    setReplyModalOpen(true);
  };

  const handleSaveReviewReply = (e) => {
    e.preventDefault();
    if (!selectedReviewForReply) return;
    const updated = reviewsList.map(r => {
      if (r.id === selectedReviewForReply.id) {
        return { ...r, adminReply: replyText.trim() };
      }
      return r;
    });
    setReviewsList(updated);
    saveStoredReviews(updated);
    logAdminAction('Admin', 'Phản hồi đánh giá khách hàng', `Khách: ${selectedReviewForReply.customerName}`, 'info');
    setReplyModalOpen(false);
  };

  // Top sản phẩm có đánh giá thấp (Rating <= 3 sao)
  const lowRatingReviews = reviewsList.filter(r => r.rating <= 3);

  // ================= 5. CÀI ĐẶT & PHÂN QUYỀN (SETTINGS) =================
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (adminPasswordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    if (adminPasswordForm.newPassword !== adminPasswordForm.confirmPassword) {
      setPasswordError('Xác nhận mật khẩu mới không trùng khớp!');
      return;
    }
    setPasswordSuccess('Đổi mật khẩu tài khoản Admin thành công!');
    setAdminPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    logAdminAction('Admin', 'Đổi mật khẩu Admin', 'Thay đổi mật khẩu quản trị viên', 'success');
  };

  const handleToggleStaffPermission = (staffId, permKey) => {
    const updated = staffList.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          permissions: {
            ...s.permissions,
            [permKey]: !s.permissions[permKey]
          }
        };
      }
      return s;
    });
    setStaffList(updated);
    saveStoredStaff(updated);
    logAdminAction('Super Admin', 'Cập nhật phân quyền nhân viên', `Staff ID: ${staffId}`, 'warning');
  };

  // ================= THAO TÁC BANNER SLIDE =================
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: '',
      subtitle: '',
      desc: '',
      image: '',
      category: 'Áo Sơ Mi',
      ctaText: 'Mua Ngay'
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (ban) => {
    setEditingBanner(ban);
    setBannerForm({
      title: ban.title || '',
      subtitle: ban.subtitle || '',
      desc: ban.desc || '',
      image: ban.image || '',
      category: ban.category || 'Áo Sơ Mi',
      ctaText: ban.ctaText || 'Mua Ngay'
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!bannerForm.title.trim() || !bannerForm.image.trim()) {
      alert('Vui lòng nhập tiêu đề và chọn ảnh cho Banner!');
      return;
    }

    let updated;
    if (editingBanner) {
      updated = bannersList.map(b => b.id === editingBanner.id ? { ...b, ...bannerForm } : b);
      logAdminAction('Admin', 'Chỉnh sửa Banner slide', bannerForm.title, 'warning');
    } else {
      const newBanner = {
        id: Date.now(),
        ...bannerForm,
        isActive: true,
        displayOrder: bannersList.length + 1
      };
      updated = [...bannersList, newBanner];
      logAdminAction('Admin', 'Thêm mới Banner slide', bannerForm.title, 'success');
    }

    setBannersList(updated);
    saveStoredBanners(updated);
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = (bannerId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa Banner này khỏi trang chủ không?')) {
      const updated = bannersList.filter(b => b.id !== bannerId);
      setBannersList(updated);
      saveStoredBanners(updated);
      logAdminAction('Admin', 'Xóa Banner slide', `Banner ID: ${bannerId}`, 'danger');
    }
  };

  // Upload ảnh trực tiếp từ máy tính (hỗ trợ chuyển file thành DataURL base64)
  const handleFileUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng ảnh tối đa là 5MB!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        callback(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ================= 6. GIAO DIỆN CỬA HÀNG (STOREFRONT CMS) =================
  const handleToggleBannerActive = (bannerId) => {
    const updated = bannersList.map(b => b.id === bannerId ? { ...b, isActive: !b.isActive } : b);
    setBannersList(updated);
    saveStoredBanners(updated);
  };

  const handleSaveStorefrontConfig = (e) => {
    e.preventDefault();
    saveStoredStorefrontConfig(storefrontConfig);
    setStorefrontSuccess('Đã lưu cài đặt giao diện cửa hàng thành công!');
    setTimeout(() => setStorefrontSuccess(''), 3000);
    logAdminAction('Admin', 'Cập nhật giao diện cửa hàng', 'Banner & Announcement Bar', 'info');
  };

  // Bộ lọc
  const filteredAdminProducts = adminProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                        p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = productCategoryFilter === 'Tất cả' || p.category === productCategoryFilter;
    return matchSearch && matchCat;
  });

  const filteredOrdersList = ordersList.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                        o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        (o.phone && o.phone.includes(orderSearch)) ||
                        (o.address && o.address.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredReviews = reviewsList.filter(r => {
    const matchSearch = r.productName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
                        r.customerName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
                        r.comment.toLowerCase().includes(reviewSearch.toLowerCase());
    const matchRating = reviewFilterRating === 'ALL' || r.rating === Number(reviewFilterRating);
    return matchSearch && matchRating;
  });

  const filteredVouchers = vouchersList.filter(v => {
    return v.code.toLowerCase().includes(voucherSearch.toLowerCase()) ||
           (v.title && v.title.toLowerCase().includes(voucherSearch.toLowerCase()));
  });

  // DANH SÁCH 12 MỤC SIDEBAR THEO ĐÚNG ẢNH YÊU CẦU
  const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: 'Tổng quan hệ thống', icon: LayoutDashboard },
    { id: 'products', label: 'Quản lý sản phẩm', icon: Layers, badge: adminProducts.length },
    { id: 'inventory', label: 'Quản lý kho hàng', icon: Warehouse },
    { id: 'orders', label: 'Quản lý đơn hàng', icon: ShoppingBag, badge: ordersList.length > 0 ? ordersList.length : null, badgeColor: 'bg-rose-500' },
    { id: 'returns', label: 'Vận chuyển và đổi trả', icon: Truck },
    { id: 'customers', label: 'Khách hàng (CRM)', icon: Users, badge: customersList.length },
    { id: 'vouchers', label: 'Khuyến mãi', icon: Ticket, badge: vouchersList.length },
    { id: 'reviews', label: 'Đánh giá sản phẩm', icon: Star, badge: reviewsList.length },
    { id: 'reports', label: 'Báo cáo kinh doanh', icon: BarChart3 },
    { id: 'ai-assistant', label: 'AI trợ lý quản trị', icon: Sparkles },
    { id: 'storefront', label: 'Quản lý giao diện cửa hàng', icon: Palette },
    { id: 'settings', label: 'Cài đặt và phân quyền', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex font-sans text-neutral-800">
      {/* 1. SIDEBAR QUẢN TRỊ VIÊN CHUẨN 12 MỤC */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-950 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 flex-1 flex flex-col overflow-y-auto">
          {/* Logo Brand */}
          <div className="flex items-center justify-between mb-6 shrink-0">
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

          {/* 12 Menu Items */}
          <nav className="space-y-1 text-xs font-semibold flex-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveAdminTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer text-left ${
                    isActive 
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' 
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge !== null && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive 
                        ? 'bg-neutral-950 text-white' 
                        : (item.badgeColor || 'bg-neutral-800 text-neutral-300')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-neutral-800 space-y-2 shrink-0">
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
              <span className="text-neutral-900 font-bold">
                {SIDEBAR_ITEMS.find(i => i.id === activeAdminTab)?.label || 'Quản trị'}
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
          
          {/* TAB 1: TỔNG QUAN HỆ THỐNG */}
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
                              <td className="p-4 font-bold text-neutral-900">#{ord.id}</td>
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

          {/* TAB 2: QUẢN LÝ SẢN PHẨM */}
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

          {/* TAB 3: QUẢN LÝ KHO HÀNG (INVENTORY) */}
          {activeAdminTab === 'inventory' && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Quản Lý Tồn Kho Nhanh</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Theo dõi cảnh báo hàng sắp hết và chỉnh sửa số lượng tồn kho trực tiếp</p>
                </div>
                <div className="text-xs font-bold text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200">
                  Tổng {adminProducts.reduce((sum, p) => sum + (p.totalStock ?? p.stock ?? 50), 0)} sản phẩm trong kho
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Sản Phẩm</th>
                      <th className="p-4">Danh Mục</th>
                      <th className="p-4">Giá Bán</th>
                      <th className="p-4">Số Lượng Tồn Kho</th>
                      <th className="p-4">Tình Trạng</th>
                      <th className="p-4 text-right">Cập Nhật Nhanh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {adminProducts.map((p) => {
                      const curStock = p.totalStock !== undefined ? p.totalStock : (p.stock !== undefined ? p.stock : 50);
                      return (
                        <tr key={p.id} className="hover:bg-neutral-50/70 transition">
                          <td className="p-4 font-semibold text-neutral-900 flex items-center gap-3">
                            <img src={p.images?.[0] || p.image} alt={p.name} className="w-9 h-11 object-cover rounded-md border" />
                            <span>{p.name}</span>
                          </td>
                          <td className="p-4 text-neutral-500 font-medium">{p.category}</td>
                          <td className="p-4 font-bold text-neutral-950">{formatPrice(p.price)}</td>
                          <td className="p-4 font-bold text-base text-neutral-900">{curStock} chiếc</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              curStock <= 0 
                                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                                : curStock <= 5 
                                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {curStock <= 0 ? 'Hết hàng' : curStock <= 5 ? 'Cảnh báo sắp hết' : 'Đầy đủ'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <input 
                              type="number"
                              min="0"
                              defaultValue={curStock}
                              onBlur={(e) => handleQuickUpdateStock(p.id, e.target.value)}
                              className="w-20 px-2 py-1 text-center font-bold border border-neutral-300 rounded-lg text-xs outline-none focus:border-amber-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: QUẢN LÝ ĐƠN HÀNG */}
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

          {/* TAB 5: VẬN CHUYỂN VÀ ĐỔI TRẢ (RETURNS) */}
          {activeAdminTab === 'returns' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Đơn Hàng Đang Đổi Size</span>
                  <div className="text-2xl font-black text-teal-600">
                    {ordersList.filter(o => o.status === 'exchanged').length} đơn
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Shipper đang giao size mới</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Đơn Yêu Cầu Hoàn Hàng</span>
                  <div className="text-2xl font-black text-purple-600">
                    {ordersList.filter(o => o.status === 'returned').length} đơn
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Đang hoàn về kho kiểm tra</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Đang Giao Hàng Cho ĐVVC</span>
                  <div className="text-2xl font-black text-indigo-600">
                    {ordersList.filter(o => o.status === 'handed_over' || o.status === 'delivering').length} đơn
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Viettel Post / GHTK</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-2">Quy Trình Kiểm Tra Sản Phẩm Đổi Trả Nhập Kho</h3>
                <p className="text-xs text-neutral-500 mb-4">Các tiêu chuẩn bắt buộc thủ kho phải kiểm tra trước khi hoàn tiền hoặc đổi size cho khách:</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <strong>1. Tem Mác (Tag)</strong>
                    <p className="text-neutral-500 mt-1">Còn nguyên vẹn tem vải và tag giấy đính kèm áo/quần.</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <strong>2. Chưa Giặt Tẩy</strong>
                    <p className="text-neutral-500 mt-1">Vải không có mùi xà phòng hoặc dấu vết giặt tẩy nhiệt độ cao.</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <strong>3. Mùi Cơ Thể</strong>
                    <p className="text-neutral-500 mt-1">Không dính nước hoa hoặc mùi mồ hôi sử dụng kéo dài.</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <strong>4. Hóa Đơn / Mã Đơn</strong>
                    <p className="text-neutral-500 mt-1">Khớp đúng mã đơn hàng trong hệ thống MENSTYLE.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: KHÁCH HÀNG (CRM) */}
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

          {/* TAB 7: KHUYẾN MÃI (VOUCHERS) */}
          {activeAdminTab === 'vouchers' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Tổng Số Loại Mã</span>
                  <div className="text-2xl font-black text-neutral-950">{vouchersList.length} Mã</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Mã Đang Kích Hoạt</span>
                  <div className="text-2xl font-black text-emerald-600">{vouchersList.filter(v => v.isActive !== false).length} Mã</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Tổng Lượt Đã Sử Dụng</span>
                  <div className="text-2xl font-black text-amber-600">{vouchersList.reduce((acc, v) => acc + (v.usedCount || 0), 0)} Lượt</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Tổng Lượt Còn Lại</span>
                  <div className="text-2xl font-black text-purple-600">{vouchersList.reduce((acc, v) => acc + Math.max(0, (v.totalCount || 0) - (v.usedCount || 0)), 0)} Lượt</div>
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
                      <Plus className="w-4 h-4" /> Thêm Mã Khuyến Mãi
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
                      {filteredVouchers.map((v) => {
                        const remaining = Math.max(0, (v.totalCount || 0) - (v.usedCount || 0));
                        return (
                          <tr key={v.id} className="hover:bg-neutral-50/70 transition">
                            <td className="p-4 font-black text-purple-700 font-mono text-sm tracking-wider">{v.code}</td>
                            <td className="p-4 font-semibold text-neutral-800">{v.title}</td>
                            <td className="p-4 font-bold text-neutral-950">
                              {v.percent && v.percent > 0 ? <span className="text-rose-600">Giảm {v.percent}%</span> : <span className="text-emerald-600">Giảm {formatPrice(v.discountAmount)}</span>}
                            </td>
                            <td className="p-4 text-neutral-600">{v.minOrder > 0 ? formatPrice(v.minOrder) : '0₫ (Mọi đơn)'}</td>
                            <td className="p-4 font-semibold text-neutral-800">{v.totalCount} lượt</td>
                            <td className="p-4 font-semibold text-neutral-900">
                              <span className="text-amber-600 font-bold">{v.usedCount || 0}</span> / <span className="text-emerald-600 font-bold">{remaining}</span>
                            </td>
                            <td className="p-4 text-neutral-500 font-medium">{v.expiry}</td>
                            <td className="p-4">
                              <button
                                type="button"
                                onClick={() => handleToggleVoucherStatus(v.id)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                                  v.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-neutral-100 text-neutral-500 border-neutral-300'
                                }`}
                              >
                                {v.isActive !== false ? '● Đang kích hoạt' : '○ Tạm khóa'}
                              </button>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <button onClick={() => handleOpenEditVoucher(v)} className="text-xs font-semibold text-purple-600 hover:text-purple-800 mr-3 cursor-pointer">Sửa</button>
                              <button onClick={() => handleDeleteVoucher(v.id)} className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer">Xóa</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: QUẢN LÝ ĐÁNH GIÁ SẢN PHẨM (YÊU CẦU 4) */}
          {activeAdminTab === 'reviews' && (
            <div className="space-y-6">
              {/* Thống kê cảnh báo sao thấp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Điểm Đánh Giá Trung Bình</span>
                  <div className="text-2xl font-black text-amber-500 flex items-center gap-1.5">
                    <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                    <span>
                      {(reviewsList.reduce((sum, r) => sum + r.rating, 0) / (reviewsList.length || 1)).toFixed(1)} / 5.0
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Dựa trên {reviewsList.length} đánh giá khách hàng</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs bg-rose-50/20">
                  <span className="text-xs font-semibold text-rose-600 block mb-1">Sản Phẩm Bị Đánh Giá Thấp (≤ 3★)</span>
                  <div className="text-2xl font-black text-rose-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-6 h-6 text-rose-600" />
                    <span>{lowRatingReviews.length} lượt chê</span>
                  </div>
                  <span className="text-[11px] text-rose-600/80 mt-1 block">Cần kiểm tra chất lượng kho và đổi trả</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Đánh Giá Đã Ẩn Do Vi Phạm</span>
                  <div className="text-2xl font-black text-neutral-700">
                    {reviewsList.filter(r => r.status === 'hidden').length} bình luận
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Spam hoặc từ ngữ không phù hợp</span>
                </div>
              </div>

              {/* Bảng danh sách đánh giá */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Quản Lý Đánh Giá & Bình Luận</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Duyệt đánh giá, ẩn bình luận vi phạm và phản hồi trực tiếp khách hàng</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={reviewSearch}
                        onChange={(e) => setReviewSearch(e.target.value)}
                        placeholder="Tìm sản phẩm, tên khách..."
                        className="pl-8 pr-3 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-950 w-52"
                      />
                    </div>

                    <select
                      value={reviewFilterRating}
                      onChange={(e) => setReviewFilterRating(e.target.value)}
                      className="px-2.5 py-1.5 border border-neutral-200 rounded-xl text-xs outline-none bg-white font-medium"
                    >
                      <option value="ALL">Tất cả số sao</option>
                      <option value="5">5 Sao (Rất tốt)</option>
                      <option value="4">4 Sao (Tốt)</option>
                      <option value="3">3 Sao (Bình thường)</option>
                      <option value="2">2 Sao (Kém)</option>
                      <option value="1">1 Sao (Rất tệ)</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">Khách Hàng</th>
                        <th className="p-4">Sản Phẩm</th>
                        <th className="p-4">Đánh Giá (Sao)</th>
                        <th className="p-4">Nội Dung Bình Luận</th>
                        <th className="p-4">Phản Hồi Từ Shop</th>
                        <th className="p-4">Trạng Thái</th>
                        <th className="p-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredReviews.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-10 text-center text-neutral-400">
                            Không tìm thấy đánh giá nào phù hợp với bộ lọc!
                          </td>
                        </tr>
                      ) : (
                        filteredReviews.map((rev) => (
                          <tr key={rev.id} className={`hover:bg-neutral-50/70 transition ${rev.status === 'hidden' ? 'bg-neutral-50 opacity-60' : ''}`}>
                            <td className="p-4 font-semibold text-neutral-800 whitespace-nowrap">
                              <div>{rev.customerName}</div>
                              <div className="text-[10px] text-neutral-400">{rev.date}</div>
                            </td>
                            <td className="p-4 font-medium text-neutral-900 max-w-xs">{rev.productName}</td>
                            <td className="p-4 whitespace-nowrap">
                              <div className="flex items-center gap-1 font-bold text-amber-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                                ))}
                                <span className="ml-1 text-neutral-800">({rev.rating}★)</span>
                              </div>
                            </td>
                            <td className="p-4 text-neutral-700 max-w-sm">
                              <p className="line-clamp-2">{rev.comment}</p>
                            </td>
                            <td className="p-4 text-neutral-600 max-w-xs">
                              {rev.adminReply ? (
                                <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                                  <div className="font-bold flex items-center gap-1 mb-0.5">
                                    <CornerDownRight className="w-3 h-3 text-amber-600" /> Shop trả lời:
                                  </div>
                                  <p className="line-clamp-2">{rev.adminReply}</p>
                                </div>
                              ) : (
                                <span className="text-neutral-400 italic">Chưa phản hồi</span>
                              )}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                rev.status === 'visible' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}>
                                {rev.status === 'visible' ? 'Hiển thị' : 'Đã ẩn vi phạm'}
                              </span>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleOpenReplyReview(rev)}
                                className="text-xs font-semibold text-amber-600 hover:text-amber-800 mr-2.5 cursor-pointer"
                              >
                                {rev.adminReply ? 'Sửa trả lời' : 'Trả lời'}
                              </button>
                              <button
                                onClick={() => handleToggleReviewStatus(rev.id)}
                                className={`text-xs font-semibold cursor-pointer ${
                                  rev.status === 'visible' ? 'text-rose-600 hover:text-rose-800' : 'text-emerald-600 hover:text-emerald-800'
                                }`}
                              >
                                {rev.status === 'visible' ? 'Ẩn đi' : 'Hiện lại'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BÁO CÁO KINH DOANH (REPORTS) */}
          {activeAdminTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Doanh Thu Chốt Thành Công</span>
                  <div className="text-2xl font-black text-emerald-600">
                    {formatPrice(ordersList.filter(o => o.status === 'completed').reduce((sum, o) => sum + (Number(o.total) || 0), 0))}
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Từ các đơn đã hoàn thành</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Giá Trị Đơn Trung Bình (AOV)</span>
                  <div className="text-2xl font-black text-neutral-900">
                    {formatPrice(ordersList.length > 0 ? Math.round(totalRevenue / ordersList.length) : 0)}
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Mức chi tiêu trung bình / khách</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                  <span className="text-xs font-semibold text-neutral-500 block mb-1">Tỷ Lệ Chuyển Đổi Đơn Thành Công</span>
                  <div className="text-2xl font-black text-blue-600">
                    {ordersList.length > 0 ? Math.round((ordersList.filter(o => o.status === 'completed').length / ordersList.length) * 100) : 0}%
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">Duy trì tỷ lệ hoàn trả thấp</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-4">Phân Bổ Doanh Thu Theo Danh Mục Quần Áo</h3>
                <div className="space-y-4">
                  {CATEGORIES.filter(c => c !== 'Tất cả').map((cat) => {
                    const count = adminProducts.filter(p => p.category === cat).length;
                    const percent = adminProducts.length > 0 ? Math.round((count / adminProducts.length) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span>{cat}</span>
                          <span className="text-neutral-500">{count} mẫu ({percent}%)</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: AI TRỢ LÝ QUẢN TRỊ (AI ASSISTANT) */}
          {activeAdminTab === 'ai-assistant' && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-950">AI Trợ Lý Quản Trị Cửa Hàng</h3>
                  <p className="text-xs text-neutral-400">Phân tích xu hướng kinh doanh và đề xuất gợi ý bán hàng</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" /> Gợi Ý Nhập Hàng Tồn Kho
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Theo thống kê, danh mục <strong>Áo Polo</strong> và <strong>Áo Sơ Mi</strong> đang có tỷ lệ đặt hàng cao nhất trong tuần. Bạn nên tăng tồn kho các mẫu Polo Pima cotton thêm 50 sản phẩm để chuẩn bị cho đợt khuyến mãi sắp tới.
                  </p>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" /> Đề Xuất Chiến Dịch Marketing
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Có <strong>{vouchersList.filter(v => v.usedCount > 30).length} mã voucher</strong> đạt tỷ lệ áp dụng trên 70%. Bạn có thể gia hạn mã <em>VIPMEN</em> đến cuối tháng 12 để kích thích tệp khách hàng mua combo Blazer & Quần Âu.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: QUẢN LÝ GIAO DIỆN CỬA HÀNG (YÊU CẦU 6) */}
          {activeAdminTab === 'storefront' && (
            <div className="space-y-6">
              {/* Thông báo cập nhật */}
              {storefrontSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{storefrontSuccess}</span>
                </div>
              )}

              {/* 1. Dải thông báo chạy trên cùng (Top Marquee) */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-1">Dải Chạy Thông Báo Khuyến Mãi Trên Cùng Web (Top Marquee)</h3>
                <p className="text-xs text-neutral-400 mb-4">Dòng chữ khuyến mãi thu hút khách hàng chạy trên thanh Header</p>

                <form onSubmit={handleSaveStorefrontConfig} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Nội Dung Chữ Chạy</label>
                    <textarea 
                      rows="2"
                      value={storefrontConfig.announcementText}
                      onChange={(e) => setStorefrontConfig({ ...storefrontConfig, announcementText: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={storefrontConfig.isAnnouncementActive}
                        onChange={(e) => setStorefrontConfig({ ...storefrontConfig, isAnnouncementActive: e.target.checked })}
                        className="rounded accent-amber-500 cursor-pointer"
                      />
                      <span>Bật hiển thị thanh thông báo này ngoài trang chủ</span>
                    </label>

                    <Button type="submit" size="sm" className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl px-4 cursor-pointer">
                      Lưu Thiết Lập
                    </Button>
                  </div>
                </form>
              </div>

              {/* 2. Quản lý Banner Slide Trang Chủ */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">Danh Sách Slide Banner Trang Chủ</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Thêm ảnh mới từ máy tính, thay ảnh banner và cập nhật chữ hiển thị ngoài trang chủ</p>
                  </div>
                  <Button 
                    onClick={handleOpenAddBanner}
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl px-3.5 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Thêm Banner Mới
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">Thứ Tự</th>
                        <th className="p-4">Hình Ảnh Banner</th>
                        <th className="p-4">Tiêu Đề Lớn</th>
                        <th className="p-4">Phụ Đề (Subtitle)</th>
                        <th className="p-4">Nút Bấm (CTA)</th>
                        <th className="p-4">Trạng Thái</th>
                        <th className="p-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {bannersList.map((ban, idx) => (
                        <tr key={ban.id} className="hover:bg-neutral-50/70 transition">
                          <td className="p-4 font-bold text-neutral-900">#{idx + 1}</td>
                          <td className="p-4">
                            <img src={ban.image} alt={ban.title} className="w-24 h-12 object-cover rounded-lg border border-neutral-200" />
                          </td>
                          <td className="p-4 font-bold text-neutral-900 max-w-xs">{ban.title}</td>
                          <td className="p-4 text-neutral-500 max-w-xs">{ban.subtitle}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-neutral-100 font-bold rounded border text-[11px]">
                              {ban.ctaText}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => handleToggleBannerActive(ban.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                                ban.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-neutral-100 text-neutral-500 border-neutral-300'
                              }`}
                            >
                              {ban.isActive !== false ? '● Đang chiếu' : '○ Tạm ẩn'}
                            </button>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <button 
                              onClick={() => handleOpenEditBanner(ban)}
                              className="text-xs font-semibold text-amber-600 hover:text-amber-800 mr-2.5 cursor-pointer"
                            >
                              Sửa ảnh & chữ
                            </button>
                            <button 
                              onClick={() => handleDeleteBanner(ban.id)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: CÀI ĐẶT VÀ PHÂN QUYỀN (YÊU CẦU 5) */}
          {activeAdminTab === 'settings' && (
            <div className="space-y-6">
              {/* Form Đổi Mật Khẩu Admin */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-1">Đổi Mật Khẩu Tài Khoản Admin</h3>
                <p className="text-xs text-neutral-400 mb-4">Cập nhật mật khẩu bảo mật cho tài khoản quản trị viên hiện tại</p>

                {passwordSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Mật khẩu hiện tại</label>
                    <input 
                      type="password"
                      required
                      value={adminPasswordForm.oldPassword}
                      onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, oldPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Mật khẩu mới (Tối thiểu 6 ký tự)</label>
                    <input 
                      type="password"
                      required
                      value={adminPasswordForm.newPassword}
                      onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input 
                      type="password"
                      required
                      value={adminPasswordForm.confirmPassword}
                      onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  <Button type="submit" size="sm" className="bg-neutral-950 text-white font-bold text-xs rounded-xl px-5 py-2 mt-2 cursor-pointer">
                    Cập Nhật Mật Khẩu
                  </Button>
                </form>
              </div>

              {/* Bảng Danh Sách & Phân Quyền Nhân Viên (RBAC) */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-neutral-200">
                  <h3 className="text-base font-bold text-neutral-900">Phân Quyền Quản Trị Viên & Nhân Viên (RBAC)</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Giới hạn quyền xem Doanh thu, quyền Sửa sản phẩm, quyền Duyệt đơn hàng</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">Tài Khoản Nhân Viên</th>
                        <th className="p-4">Chức Vụ</th>
                        <th className="p-4 text-center">Xem Doanh Thu</th>
                        <th className="p-4 text-center">Sửa Sản Phẩm</th>
                        <th className="p-4 text-center">Xử Lý Đơn Hàng</th>
                        <th className="p-4 text-center">Duyệt Đánh Giá</th>
                        <th className="p-4">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-neutral-50/70 transition">
                          <td className="p-4 font-semibold text-neutral-900">
                            <div>{staff.name}</div>
                            <div className="text-[11px] text-neutral-400 font-normal">{staff.email}</div>
                          </td>
                          <td className="p-4 font-medium text-amber-700 bg-amber-50/40 rounded">{staff.roleTitle}</td>
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox"
                              checked={staff.permissions.canViewRevenue}
                              onChange={() => handleToggleStaffPermission(staff.id, 'canViewRevenue')}
                              disabled={staff.role === 'super_admin'}
                              className="accent-amber-500 cursor-pointer w-4 h-4"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox"
                              checked={staff.permissions.canEditProducts}
                              onChange={() => handleToggleStaffPermission(staff.id, 'canEditProducts')}
                              disabled={staff.role === 'super_admin'}
                              className="accent-amber-500 cursor-pointer w-4 h-4"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox"
                              checked={staff.permissions.canProcessOrders}
                              onChange={() => handleToggleStaffPermission(staff.id, 'canProcessOrders')}
                              disabled={staff.role === 'super_admin'}
                              className="accent-amber-500 cursor-pointer w-4 h-4"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox"
                              checked={staff.permissions.canManageReviews}
                              onChange={() => handleToggleStaffPermission(staff.id, 'canManageReviews')}
                              disabled={staff.role === 'super_admin'}
                              className="accent-amber-500 cursor-pointer w-4 h-4"
                            />
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Đang hoạt động
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Nhật Ký Lịch Sử Thao Tác Quan Trọng (Audit Log) */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">Nhật Ký Thao Tác Quan Trọng (Audit Logs)</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Ghi lại lịch sử chỉnh sửa giá, duyệt đơn và thay đổi phân quyền</p>
                  </div>
                  <History className="w-5 h-5 text-neutral-400" />
                </div>

                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[11px] sticky top-0">
                      <tr>
                        <th className="p-4">Thời Gian</th>
                        <th className="p-4">Người Thực Hiện</th>
                        <th className="p-4">Hành Động</th>
                        <th className="p-4">Chi Tiết / Đối Tượng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {auditLogsList.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-50/70 transition">
                          <td className="p-4 text-neutral-400 font-mono text-[11px] whitespace-nowrap">{log.time}</td>
                          <td className="p-4 font-bold text-neutral-900">{log.userName}</td>
                          <td className="p-4 font-medium text-neutral-800">{log.action}</td>
                          <td className="p-4 text-neutral-600 font-mono text-[11px]">{log.target}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* ================= MODAL THÊM / SỬA BANNER SLIDE TRANG CHỦ ================= */}
          {isBannerModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
              <div className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm" onClick={() => setIsBannerModalOpen(false)} />
              <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-600" />
                    <h3 className="text-base font-bold text-neutral-950">
                      {editingBanner ? 'Chỉnh Sửa Slide Banner Trang Chủ' : 'Thêm Slide Banner Mới Lên Trang Chủ'}
                    </h3>
                  </div>
                  <button onClick={() => setIsBannerModalOpen(false)} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveBanner} className="space-y-4 mt-4">
                  {/* Tải ảnh từ máy tính hoặc dán Link URL */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Hình Ảnh Banner <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          required
                          value={bannerForm.image}
                          onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                          placeholder="Dán link ảnh (https://...) hoặc tải ảnh từ máy tính..."
                          className="flex-1 px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 font-mono text-[11px]"
                        />
                        <label className="px-3 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5 transition">
                          <span>Tải Ảnh Lên</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (dataUrl) => setBannerForm(prev => ({ ...prev, image: dataUrl })))}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {bannerForm.image && (
                        <div className="relative rounded-xl overflow-hidden border border-neutral-200 aspect-[16/7] bg-neutral-900 flex items-center justify-center">
                          <img 
                            src={bannerForm.image} 
                            alt="Banner Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                            Xem trước tỷ lệ Banner
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Tiêu Đề Lớn (Title) <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      placeholder="VD: BỘ SƯU TẬP THU ĐÔNG 2026..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Phụ Đề (Subtitle)
                    </label>
                    <input 
                      type="text" 
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      placeholder="VD: URBAN ELEGANCE • ĐẲNG CẤP PHÁI MẠNH..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 uppercase text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Danh Mục Liên Kết</label>
                      <select 
                        value={bannerForm.category}
                        onChange={(e) => setBannerForm({ ...bannerForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 bg-white"
                      >
                        {CATEGORIES.filter(c => c !== 'Tất cả').map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Chữ Trên Nút (CTA)</label>
                      <input 
                        type="text" 
                        value={bannerForm.ctaText}
                        onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                        placeholder="VD: Mua Ngay, Xem BST..."
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Đoạn Mô Tả Ngắn</label>
                    <textarea 
                      rows="2"
                      value={bannerForm.desc}
                      onChange={(e) => setBannerForm({ ...bannerForm, desc: e.target.value })}
                      placeholder="Mô tả chất liệu, thiết kế nổi bật của bộ sưu tập..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
                    <Button type="button" variant="outline" onClick={() => setIsBannerModalOpen(false)} className="text-xs px-4 rounded-xl cursor-pointer">
                      Hủy Bỏ
                    </Button>
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs px-5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <Save className="w-4 h-4" /> {editingBanner ? 'Cập Nhật Banner' : 'Lưu & Đăng Banner'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= MODAL PHẢN HỒI ĐÁNH GIÁ ================= */}
          {replyModalOpen && selectedReviewForReply && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
              <div className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm" onClick={() => setReplyModalOpen(false)} />
              <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <h3 className="text-base font-bold text-neutral-950">Phản Hồi Đánh Giá Của Khách Hàng</h3>
                  <button onClick={() => setReplyModalOpen(false)} className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
                  <div className="font-bold text-neutral-900">{selectedReviewForReply.customerName} ({selectedReviewForReply.rating}★)</div>
                  <p className="text-neutral-600 italic">"{selectedReviewForReply.comment}"</p>
                </div>

                <form onSubmit={handleSaveReviewReply} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Nội Dung Phản Hồi Từ Shop</label>
                    <textarea 
                      rows="4"
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Nhập lời cảm ơn hoặc giải đáp thắc mắc..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setReplyModalOpen(false)} className="text-xs rounded-xl">
                      Hủy Bỏ
                    </Button>
                    <Button type="submit" size="sm" className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl px-4 flex items-center gap-1.5 cursor-pointer">
                      <Send className="w-3.5 h-3.5" /> Gửi Phản Hồi
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= MODAL THÊM / SỬA SẢN PHẨM ================= */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
              <div className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
              <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <h3 className="text-base font-bold text-neutral-950">
                    {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới Vào Hệ Thống'}
                  </h3>
                  <button onClick={() => setIsProductModalOpen(false)} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition">
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

                  {/* KHỐI TÍNH TOÁN GIÁ & GIẢM GIÁ TỰ ĐỘNG */}
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
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">Giá Gốc (₫)</label>
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
                        <label className="block text-[11px] font-bold text-neutral-900 mb-1">Giá Bán (₫) *</label>
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
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Hình Ảnh Sản Phẩm</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          placeholder="Dán link ảnh (https://...) hoặc chọn file từ máy tính..."
                          className="flex-1 px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-amber-500 font-mono text-[11px]"
                        />
                        <label className="px-3 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5 transition">
                          <span>Chọn Ảnh Từ Máy</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (dataUrl) => setProductForm(prev => ({ ...prev, image: dataUrl })))}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {productForm.image && (
                        <div className="flex items-center gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-200">
                          <img src={productForm.image} alt="Preview" className="w-12 h-14 object-cover rounded-lg border border-neutral-300 shrink-0" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          <div className="text-[11px] text-neutral-500">
                            Ảnh đã được nạp thành công. Bạn có thể nhấn <strong className="text-neutral-800">Lưu Sản Phẩm</strong> để áp dụng.
                          </div>
                        </div>
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
                    />
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
                    <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)} className="text-xs px-4 rounded-xl cursor-pointer">
                      Hủy Bỏ
                    </Button>
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs px-5 rounded-xl flex items-center gap-1.5 cursor-pointer">
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
              <div className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm" onClick={() => setIsVoucherModalOpen(false)} />
              <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-bold text-neutral-950">{editingVoucher ? 'Chỉnh Sửa Mã Khuyến Mãi' : 'Thêm Mã Khuyến Mãi Mới'}</h3>
                  </div>
                  <button onClick={() => setIsVoucherModalOpen(false)} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveVoucher} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Mã Code Khuyến Mãi *</label>
                      <input 
                        type="text" 
                        required
                        value={voucherForm.code}
                        onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                        placeholder="VD: MEN50, VIPMEN..."
                        className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs uppercase font-mono font-bold outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Số Lượng Phát Hành *</label>
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
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Tên Chương Trình Khuyến Mãi *</label>
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
                        <input type="radio" name="discountType" value="amount" checked={voucherForm.discountType === 'amount'} onChange={() => setVoucherForm({ ...voucherForm, discountType: 'amount' })} className="accent-purple-600 cursor-pointer" />
                        <span>Giảm theo số tiền (VNĐ)</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                        <input type="radio" name="discountType" value="percent" checked={voucherForm.discountType === 'percent'} onChange={() => setVoucherForm({ ...voucherForm, discountType: 'percent' })} className="accent-purple-600 cursor-pointer" />
                        <span>Giảm theo phần trăm (%)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {voucherForm.discountType === 'amount' ? (
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">Số Tiền Giảm (₫)</label>
                          <input type="number" step="1000" min="1000" required value={voucherForm.discountAmount} onChange={(e) => setVoucherForm({ ...voucherForm, discountAmount: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-purple-300 rounded-lg text-xs bg-white font-bold text-purple-900 outline-none" />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">Phần Trăm Giảm (%)</label>
                          <input type="number" min="1" max="90" required value={voucherForm.percent} onChange={(e) => setVoucherForm({ ...voucherForm, percent: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-purple-300 rounded-lg text-xs bg-white font-bold text-purple-900 outline-none" />
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">Đơn Tối Thiểu Áp Dụng (₫)</label>
                        <input type="number" step="1000" min="0" value={voucherForm.minOrder} onChange={(e) => setVoucherForm({ ...voucherForm, minOrder: Number(e.target.value) })} placeholder="0 = Mọi đơn" className="w-full px-3 py-1.5 border border-purple-300 rounded-lg text-xs bg-white font-medium outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Hạn Sử Dụng</label>
                      <input type="date" required value={voucherForm.expiry} onChange={(e) => setVoucherForm({ ...voucherForm, expiry: e.target.value })} className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-purple-600 bg-white" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Trạng Thái Kích Hoạt</label>
                      <select value={voucherForm.isActive ? 'true' : 'false'} onChange={(e) => setVoucherForm({ ...voucherForm, isActive: e.target.value === 'true' })} className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-purple-600 bg-white font-medium">
                        <option value="true">Đang kích hoạt</option>
                        <option value="false">Tạm khóa</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Mỗi khách hàng chỉ được sử dụng mã này duy nhất 1 lần trên toàn bộ lịch sử mua sắm.</span>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
                    <Button type="button" variant="outline" onClick={() => setIsVoucherModalOpen(false)} className="text-xs px-4 rounded-xl cursor-pointer">
                      Hủy Bỏ
                    </Button>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs">
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
