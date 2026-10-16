import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { FeaturedCategories } from './components/home/FeaturedCategories';
import { ProductCard } from './components/product/ProductCard';
import { ProductListingPage } from './components/product/ProductListingPage';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { MiniCartDrawer } from './components/cart/MiniCartDrawer';
import { WishlistDrawer } from './components/cart/WishlistDrawer';
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
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('menstyle_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return MOCK_PRODUCTS;
  });

  const [currentTab, setCurrentTab] = useState('home'); // Mặc định luôn là Trang Chủ ('home') dành cho Khách hàng
  const [filterCategory, setFilterCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('menstyle_user');
    return saved ? JSON.parse(saved) : null; // Mặc định là null (Khách vãng lai)
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPendingCheckout, setIsPendingCheckout] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('menstyle_admin_auth') === 'true';
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('menstyle_wishlist');
    return saved ? JSON.parse(saved) : []; // Mặc định rỗng khi khách mới vào web
  });
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleNavigateWithCategory = (catName) => {
    setFilterCategory(catName);
    setCurrentTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Giỏ hàng state (mặc định trống khi khách mới vào web)
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('menstyle_cart');
    return saved ? JSON.parse(saved) : [];
  });

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

      let updated;
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].quantity += (productToAdd.quantity || 1);
      } else {
        updated = [
          ...prev,
          {
            ...productToAdd,
            selectedSize: size,
            selectedColor: color,
            quantity: productToAdd.quantity || 1,
          }
        ];
      }
      localStorage.setItem('menstyle_cart', JSON.stringify(updated));
      return updated;
    });

    setIsDetailOpen(false);
    setIsCartOpen(true);
    addToast('Đã Thêm Vào Giỏ Hàng', `"${productToAdd.name}" đã được đưa vào giỏ.`);
  };

  // Cập nhật số lượng
  const handleUpdateQuantity = (targetItem, newQuantity) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (
          item.id === targetItem.id && 
          item.selectedSize === targetItem.selectedSize && 
          item.selectedColor === targetItem.selectedColor
        ) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      localStorage.setItem('menstyle_cart', JSON.stringify(updated));
      return updated;
    });
  };

  // Xóa món khỏi giỏ
  const handleRemoveItem = (targetItem) => {
    setCartItems(prev => {
      const updated = prev.filter(item => !(
        item.id === targetItem.id && 
        item.selectedSize === targetItem.selectedSize && 
        item.selectedColor === targetItem.selectedColor
      ));
      localStorage.setItem('menstyle_cart', JSON.stringify(updated));
      return updated;
    });
    addToast('Đã Xóa Khỏi Giỏ', 'Sản phẩm đã được xóa khỏi giỏ hàng của bạn.', 'info');
  };

  // Quản lý Yêu thích (Wishlist)
  const handleToggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter(item => item.id !== product.id);
        addToast('Đã Bỏ Yêu Thích', `Đã xóa "${product.name}" khỏi danh sách lưu.`, 'info');
      } else {
        updated = [product, ...prev];
        addToast('Đã Thêm Yêu Thích', `Đã lưu "${product.name}" vào danh sách yêu thích!`, 'success');
      }
      localStorage.setItem('menstyle_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlistItems(prev => {
      const updated = prev.filter(item => item.id !== productId);
      localStorage.setItem('menstyle_wishlist', JSON.stringify(updated));
      return updated;
    });
    addToast('Đã Xóa Yêu Thích', 'Đã xóa sản phẩm khỏi danh sách yêu thích.', 'info');
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
        products={products}
        onUpdateProducts={(updatedProducts) => {
          setProducts(updatedProducts);
          localStorage.setItem('menstyle_products', JSON.stringify(updatedProducts));
        }}
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
        activeCategory={filterCategory}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          if (val.trim() !== '' && currentTab !== 'products') {
            setCurrentTab('products');
          }
        }}
        wishlistCount={wishlistItems.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onNavigate={(tab, catName) => {
          if (tab === 'profile' && !currentUser) {
            setIsAuthOpen(true);
            return;
          }
          if (catName) {
            setFilterCategory(catName);
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
            currentUser={currentUser}
            onRequireAuth={() => setIsAuthOpen(true)}
            onBackToShopping={() => setCurrentTab('products')}
            onOrderSuccess={(orderData) => {
              addToast('Đặt Hàng Thành Công', `Mã đơn hàng: ${orderData.orderCode}. Đơn hàng đã được đồng bộ vào hệ thống quản trị!`);
              
              // Lưu vào danh sách đơn hàng toàn hệ thống
              const existingOrders = JSON.parse(localStorage.getItem('menstyle_orders') || '[]');
              const newOrder = {
                id: orderData.orderCode,
                customer: orderData.fullName || currentUser?.name || 'Quý Ông Khách Hàng',
                email: orderData.email || currentUser?.email || '',
                phone: orderData.phone || '',
                address: `${orderData.address}, ${orderData.district ? orderData.district + ', ' : ''}${orderData.province}`,
                items: orderData.cartItems.map(i => `${i.name} (${i.selectedSize || 'L'}, x${i.quantity})`).join(', '),
                cartItems: orderData.cartItems,
                total: orderData.grandTotal,
                paymentMethod: orderData.paymentMethod,
                paymentStatus: orderData.paymentMethod === 'cod' ? 'Chưa thanh toán' : 'Đã thanh toán (Chờ khớp)',
                status: 'pending',
                statusText: 'Chờ xác nhận',
                date: orderData.createdAt
              };
              
              const updatedOrders = [newOrder, ...existingOrders];
              localStorage.setItem('menstyle_orders', JSON.stringify(updatedOrders));

              setCartItems([]);
              localStorage.removeItem('menstyle_cart');
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
            products={products}
            onQuickView={handleOpenDetail}
            onAddToCart={handleAddToCart}
            initialCategory={filterCategory}
            onCategoryChange={(cat) => setFilterCategory(cat)}
            searchQuery={searchQuery}
            wishlistIds={wishlistItems.map(w => w.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : (
          /* TRANG CHỦ (HOME) */
          <>
            {/* 2. Hero Banner */}
            <HeroBanner 
              onExplore={() => {
                setFilterCategory('Tất cả');
                setCurrentTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />

            {/* 3. Featured Categories (Nam) */}
            <FeaturedCategories 
              onSelectCategory={(catName) => {
                setFilterCategory(catName);
                setCurrentTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />

            {/* 4. Best Seller Men Products - Chuẩn Catalog MENSTYLE */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-14">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Bán chạy nhất tuần • MENSTYLE Premium
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mt-1">Được Phái Mạnh Ưa Chuộng Nhất</h2>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  <Button 
                    onClick={() => handleNavigateWithCategory('Tất cả')}
                    variant="secondary" 
                    size="sm" 
                    className="rounded-full text-xs shrink-0 cursor-pointer"
                  >
                    Tất cả
                  </Button>
                  <Button 
                    onClick={() => handleNavigateWithCategory('Áo Polo')}
                    variant="outline" 
                    size="sm" 
                    className="rounded-full text-xs shrink-0 cursor-pointer"
                  >
                    Polo Smart
                  </Button>
                  <Button 
                    onClick={() => handleNavigateWithCategory('Áo Sơ Mi')}
                    variant="outline" 
                    size="sm" 
                    className="rounded-full text-xs shrink-0 cursor-pointer"
                  >
                    Sơ Mi Kháng Khuẩn
                  </Button>
                  <Button 
                    onClick={() => handleNavigateWithCategory('Quần Âu & Jean')}
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full text-rose-600 font-bold text-xs shrink-0 cursor-pointer bg-rose-50"
                  >
                    Khuyến Mãi Hot 🔥
                  </Button>
                </div>
              </div>

              {/* Grid 8 sản phẩm MENSTYLE nổi bật */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {products.slice(0, 8).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onQuickView={handleOpenDetail}
                    onAddToCart={handleAddToCart}
                    isWishlisted={wishlistItems.some(w => w.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>

              {/* Banner Flash Sale Giữa Trang Chuẩn MENSTYLE */}
              <div className="mt-10 sm:mt-14 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950 p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-neutral-800 shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Ưu đãi độc quyền dành riêng quý ông
                  </span>
                  <h3 className="text-xl sm:text-3xl font-black">
                    Bộ Sưu Tập Công Sở <span className="text-amber-400">Giảm Đến 35%</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
                    Áp dụng cho dòng Áo Polo Silk Touch, Sơ mi Modal Silk và Quần âu co giãn 4 chiều. Đổi trả miễn phí trong 7 ngày.
                  </p>
                </div>

                <Button 
                  onClick={() => handleNavigateWithCategory('Tất cả')}
                  variant="primary" 
                  size="lg" 
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-8 py-3 text-xs sm:text-sm shrink-0 cursor-pointer shadow-lg"
                >
                  Mua Ngay Kẻo Hết <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="mt-8 sm:mt-12 text-center">
                <Button 
                  onClick={() => {
                    setFilterCategory('Tất cả');
                    setCurrentTab('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  variant="outline" 
                  size="lg" 
                  className="rounded-full border-neutral-300 px-6 sm:px-8 hover:border-neutral-950 font-bold text-xs sm:text-base w-full sm:w-auto cursor-pointer"
                >
                  Xem toàn bộ 56+ sản phẩm thời trang MENSTYLE <ArrowRight className="w-4 h-4 ml-2" />
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
          if (!currentUser) {
            setIsPendingCheckout(true);
            setIsAuthOpen(true);
            addToast('Yêu Cầu Đăng Nhập', 'Quý khách vui lòng đăng nhập hoặc đăng ký tài khoản để tiếp tục thanh toán.', 'info');
            return;
          }
          setCurrentTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 8.1. Drawer Danh Sách Yêu Thích (Wishlist) */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onOpenProductDetail={handleOpenDetail}
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
        onClose={() => {
          setIsAuthOpen(false);
          setIsPendingCheckout(false);
        }}
        onLoginSuccess={(userData) => {
          setCurrentUser(userData);
          localStorage.setItem('menstyle_user', JSON.stringify(userData));
          addToast('Chào Mừng Trở Lại', `Xin chào quý ông ${userData.name}!`);
          if (isPendingCheckout) {
            setIsPendingCheckout(false);
            setCurrentTab('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
}
