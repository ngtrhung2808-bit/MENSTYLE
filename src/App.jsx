import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { FeaturedCategories } from './components/home/FeaturedCategories';
import { ProductCard } from './components/product/ProductCard';
import { ProductListingPage } from './components/product/ProductListingPage';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { MiniCartDrawer } from './components/cart/MiniCartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { UserProfilePage } from './components/profile/UserProfilePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { AuthModal } from './components/auth/AuthModal';
import { ChatbotWidget } from './components/chatbot/ChatbotWidget';
import { Toast } from './components/common/Toast';
import { Button } from './components/common/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from './data/mockProducts';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); // Mặc định luôn là Trang Chủ ('home') dành cho Khách hàng
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('menstyle_user');
    return saved ? JSON.parse(saved) : null; // Mặc định là null (Khách vãng lai)
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('menstyle_admin_auth') === 'true';
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Giỏ hàng state giả lập
  const [cartItems, setCartItems] = useState([
    {
      ...MOCK_PRODUCTS[0],
      selectedSize: 'L',
      selectedColor: 'Đen Sang Trọng',
      quantity: 1,
    },
    {
      ...MOCK_PRODUCTS[2],
      selectedSize: 'M',
      selectedColor: 'Đen Huyền Bí',
      quantity: 1,
    }
  ]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Mở modal chi tiết sản phẩm
  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = (productToAdd) => {
    setCartItems(prev => {
      const size = productToAdd.selectedSize || productToAdd.sizes?.[0] || 'L';
      const color = productToAdd.selectedColor || productToAdd.colors?.[0]?.name || '';
      
      const existingIndex = prev.findIndex(
        item => item.id === productToAdd.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += (productToAdd.quantity || 1);
        return updated;
      }

      return [
        ...prev,
        {
          ...productToAdd,
          selectedSize: size,
          selectedColor: color,
          quantity: productToAdd.quantity || 1,
        }
      ];
    });

    setIsDetailOpen(false);
    setIsCartOpen(true);
    addToast('Đã Thêm Vào Giỏ Hàng', `"${productToAdd.name}" đã được đưa vào giỏ.`);
  };

  // Cập nhật số lượng
  const handleUpdateQuantity = (targetItem, newQuantity) => {
    setCartItems(prev => 
      prev.map(item => {
        if (
          item.id === targetItem.id && 
          item.selectedSize === targetItem.selectedSize && 
          item.selectedColor === targetItem.selectedColor
        ) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Xóa món khỏi giỏ
  const handleRemoveItem = (targetItem) => {
    setCartItems(prev => 
      prev.filter(item => !(
        item.id === targetItem.id && 
        item.selectedSize === targetItem.selectedSize && 
        item.selectedColor === targetItem.selectedColor
      ))
    );
    addToast('Đã Xóa Khỏi Giỏ', 'Sản phẩm đã được xóa khỏi giỏ hàng của bạn.', 'info');
  };

  // Kiểm tra môi trường Localhost & URL Admin
  const isLocalHost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );
  
  // Kiểm tra nếu url có admin (?admin, #admin, hoặc pathname /admin)
  const isTryingAdmin = typeof window !== 'undefined' && (
    window.location.search.includes('admin') || 
    window.location.hash.includes('admin') ||
    window.location.pathname.includes('admin') ||
    currentTab === 'admin'
  );

  // Xử lý luồng Quản Trị: Chỉ áp dụng trên Localhost
  if (isLocalHost && isTryingAdmin) {
    // Nếu chưa đăng nhập => Bắt buộc qua trang Login
    if (!isAdminLoggedIn) {
      return (
        <AdminLogin 
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            localStorage.setItem('menstyle_admin_auth', 'true');
          }}
          onBackToClient={() => {
            window.history.replaceState(null, '', window.location.pathname.replace('/admin', '') || '/');
            setCurrentTab('home');
          }}
        />
      );
    }

    // Đã đăng nhập => Vào thẳng Dashboard
    return (
      <AdminDashboard 
        onBackToClient={() => {
          window.history.replaceState(null, '', window.location.pathname.replace('/admin', '') || '/');
          setCurrentTab('home');
        }}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          localStorage.removeItem('menstyle_admin_auth');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 selection:bg-amber-500 selection:text-neutral-950 font-sans overflow-x-hidden w-full relative">
      {/* 1. Header Navigation */}
      <Header 
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        currentTab={currentTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigate={(tab) => {
          if (tab === 'profile' && !currentUser) {
            setIsAuthOpen(true);
            return;
          }
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {currentTab === 'checkout' ? (
          /* TRANG CHECKOUT THANH TOÁN (TUẦN 3) */
          <CheckoutPage 
            cartItems={cartItems}
            onBackToShopping={() => setCurrentTab('products')}
            onOrderSuccess={(orderData) => {
              addToast('Đặt Hàng Thành Công', `Mã đơn hàng: ${orderData.orderCode}`);
              setCartItems([]);
              setCurrentTab(currentUser ? 'profile' : 'home');
            }}
          />
        ) : currentTab === 'profile' ? (
          /* TRANG PROFILE & LỊCH SỬ ĐƠN HÀNG (TUẦN 3) */
          <UserProfilePage 
            user={currentUser}
            onBackToShopping={() => setCurrentTab('home')}
            onLogout={() => {
              setCurrentUser(null);
              localStorage.removeItem('menstyle_user');
              setCurrentTab('home');
              addToast('Đã Đăng Xuất', 'Bạn đã quay trở lại giao diện khách vãng lai.', 'info');
            }}
          />
        ) : currentTab === 'products' ? (
          /* TRANG DANH SÁCH SẢN PHẨM & BỘ LỌC (PLP) */
          <ProductListingPage 
            onQuickView={handleOpenDetail}
            onAddToCart={handleAddToCart}
          />
        ) : (
          /* TRANG CHỦ (HOME) */
          <>
            {/* 2. Hero Banner */}
            <HeroBanner />

            {/* 3. Featured Categories (Nam) */}
            <FeaturedCategories />

            {/* 4. Best Seller Men Products */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Bán chạy nhất tuần
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-neutral-900 mt-1">Được Phái Mạnh Ưa Chuộng</h2>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  <Button variant="secondary" size="sm" className="rounded-full text-xs shrink-0">Mới nhất</Button>
                  <Button variant="outline" size="sm" className="rounded-full text-xs shrink-0">Bán chạy</Button>
                  <Button variant="ghost" size="sm" className="rounded-full text-rose-600 font-semibold text-xs shrink-0">Khuyến mãi</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
                {MOCK_PRODUCTS.slice(0, 4).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onQuickView={handleOpenDetail}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              <div className="mt-8 sm:mt-12 text-center">
                <Button 
                  onClick={() => {
                    setCurrentTab('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  variant="outline" 
                  size="lg" 
                  className="rounded-full border-neutral-300 px-6 sm:px-8 hover:border-neutral-900 font-bold text-xs sm:text-base w-full sm:w-auto cursor-pointer"
                >
                  Xem toàn bộ 180+ sản phẩm Nam <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </section>

            {/* 5. Newsletter Promotion Bar Nam Tính */}
            <section className="bg-neutral-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 border-t border-neutral-800">
              <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Gia Nhập Cộng Đồng Quý Ông MENSTYLE</h2>
                <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto">
                  Nhận voucher <strong>100.000đ</strong> cho đơn hàng đầu tiên cùng những cẩm nang phối đồ nam định kỳ từ stylist chuyên nghiệp.
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2 sm:pt-4">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 text-white"
                  />
                  <Button variant="primary" size="md" className="rounded-xl px-6 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold justify-center">
                    Đăng ký ngay
                  </Button>
                </form>
              </div>
            </section>
          </>
        )}
      </main>

      {/* 6. Footer */}
      <Footer onNavigate={(tab) => {
        setCurrentTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* 7. Modal Chi Tiết Sản Phẩm (PDP) */}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* 8. Drawer Giỏ Hàng Mini (Mini Cart) */}
      <MiniCartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 9. Cửa Sổ Chatbot Trợ Lý Stylist (Tuần 4) */}
      <ChatbotWidget />

      {/* 10. Toast Thông Báo Góc Màn Hình (Tuần 4) */}
      <Toast 
        toasts={toasts} 
        onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} 
      />

      {/* 11. Modal Đăng Nhập / Đăng Ký Khách Hàng */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => {
          setCurrentUser(userData);
          localStorage.setItem('menstyle_user', JSON.stringify(userData));
          addToast('Chào Mừng Trở Lại', `Xin chào quý ông ${userData.name}!`);
        }}
      />
    </div>
  );
}
