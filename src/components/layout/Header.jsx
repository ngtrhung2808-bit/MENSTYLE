import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, Store, Flame, Sparkles, Camera } from 'lucide-react';
import { getStoredStorefrontConfig } from '../../data/storefrontData';

export const Header = ({ 
  onOpenCart, 
  cartCount = 0, 
  currentTab = 'home', 
  activeCategory = 'Tất cả',
  onNavigate, 
  currentUser, 
  onOpenAuth,
  searchValue = '',
  onSearchChange,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenVisualSearch,
  onOpenOutfitStylist
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const storefrontConfig = getStoredStorefrontConfig();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('products');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* 1. TẦNG 1: DẢI CHẠY KHUYẾN MÃI (TOP RUNNING MARQUEE) */}
      {storefrontConfig.isAnnouncementActive !== false && (
        <div className="bg-[#1c1917] text-[#d6d3d1] text-[11px] sm:text-xs py-1.5 overflow-hidden whitespace-nowrap border-b border-neutral-800">
        <div className="animate-marquee-infinite select-none font-medium flex items-center">
          <div className="shrink-0 flex items-center gap-8 pr-8">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Voucher lớn - Sale giá độc quyền đến 50%
            </span>
            <span className="text-neutral-500">•</span>
            <span className="flex items-center gap-1.5">
              🔥 Đổi hàng trong 30 ngày tận nơi miễn phí
            </span>
            <span className="text-neutral-500">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              🚚 Freeship mọi đơn hàng từ 500k
            </span>
            <span className="text-neutral-500">•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Giảm ngay 100k cho đơn đầu tiên
            </span>
            <span className="text-neutral-500">•</span>
            <span className="flex items-center gap-1.5">
              👔 Cam kết chất vải cao cấp chuẩn phong độ quý ông
            </span>
            <span className="text-neutral-500">•</span>
          </div>

          {/* Bản sao chạy tiếp nối không ngắt quãng (Seamless Loop) */}
          <div className="shrink-0 flex items-center gap-8 pr-8" aria-hidden="true">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Voucher lớn - Sale giá độc quyền đến 50%
            </span>
            <span className="text-neutral-500">•</span>
            <span className="flex items-center gap-1.5">
              🔥 Đổi hàng trong 30 ngày tận nơi miễn phí
            </span>
            <span className="text-neutral-500">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              🚚 Freeship mọi đơn hàng từ 500k
            </span>
            <span className="text-neutral-500">•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Giảm ngay 100k cho đơn đầu tiên
            </span>
            <span className="text-neutral-500">•</span>
            <span className="flex items-center gap-1.5">
              👔 Cam kết chất vải cao cấp chuẩn phong độ quý ông
            </span>
            <span className="text-neutral-500">•</span>
          </div>
        </div>
      </div>
      )}

      {/* 2. TẦNG 2: THANH CHÍNH MÀU ĐEN (BRAND BAR) */}
      <div className="bg-[#121212] text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px] gap-2 sm:gap-6">
            
            {/* Trái: Menu hamburger + Logo thương hiệu (Style TORANO phong độ) */}
            <div className="flex items-center gap-3 sm:gap-5">
              <button 
                type="button" 
                className="p-1.5 text-neutral-300 hover:text-white rounded-lg cursor-pointer md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Logo MENSTYLE in hoa giãn cách chữ chuẩn sang trọng */}
              <button 
                onClick={() => onNavigate && onNavigate('home')}
                className="flex items-center gap-2 group cursor-pointer text-left"
              >
                <span className="font-black text-xl sm:text-2xl tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white group-hover:text-amber-400 transition">
                  MENSTYLE
                </span>
              </button>
            </div>

            {/* Giữa: THANH TÌM KIẾM TRẮNG VIỀN BO TRÒN VỚI NÚT KÍNH LÚP ĐEN & ICON TÌM BẰNG ẢNH */}
            <form 
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-xl mx-2 sm:mx-6 relative hidden sm:flex items-center"
            >
              <input 
                type="text" 
                value={searchValue || ''}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder="Tìm sản phẩm, phong cách (vd: Đồ thu đông, Áo đi tiệc...)" 
                className="w-full bg-white text-neutral-900 text-xs sm:text-sm rounded-lg pl-4 pr-24 py-2.5 sm:py-2.5 outline-none font-medium placeholder:text-neutral-400 shadow-inner"
              />
              <div className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={onOpenVisualSearch}
                  title="Tìm kiếm bằng hình ảnh (AI Vision)"
                  className="p-1.5 text-neutral-500 hover:text-amber-600 hover:bg-neutral-100 rounded-md transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button 
                  type="submit"
                  aria-label="Tìm kiếm AI"
                  className="bg-[#1c1917] hover:bg-neutral-800 text-white px-2.5 h-8 rounded-md flex items-center gap-1 transition cursor-pointer text-xs font-bold"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </form>

            {/* Phải: Cụm Icon (AI Stylist, Cửa hàng, Tài khoản, Giỏ hàng) */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Nút AI Stylist (Phối Đồ) */}
              <button
                onClick={onOpenOutfitStylist}
                className="flex flex-col items-center justify-center text-amber-400 hover:text-amber-300 transition cursor-pointer group"
                title="AI Phối Đồ Thông Minh"
              >
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform mb-0.5" />
                  <span className="absolute -top-1 -right-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[8px] font-black px-1 rounded-full animate-pulse">
                    AI
                  </span>
                </div>
                <span className="text-[11px] font-bold text-amber-300 hidden md:inline">Phối Đồ AI</span>
              </button>

              {/* Nút Cửa Hàng */}
              <button
                onClick={() => {
                  if (onNavigate) onNavigate('products', 'Tất cả');
                }}
                className="flex flex-col items-center justify-center text-neutral-300 hover:text-amber-400 transition cursor-pointer group"
                title="Hệ thống cửa hàng"
              >
                <Store className="w-5 h-5 text-neutral-300 group-hover:text-amber-400 transition mb-0.5" />
                <span className="text-[11px] font-medium hidden md:inline">Cửa hàng</span>
              </button>

              {/* Nút Tài Khoản */}
              {currentUser ? (
                <button
                  onClick={() => onNavigate && onNavigate('profile')}
                  className="flex flex-col items-center justify-center text-neutral-300 hover:text-amber-400 transition cursor-pointer group"
                  title="Hồ sơ tài khoản"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-black text-[10px] flex items-center justify-center mb-0.5">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-[11px] font-medium max-w-[70px] truncate hidden md:inline">
                    {currentUser.name}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={onOpenAuth}
                  className="flex flex-col items-center justify-center text-neutral-300 hover:text-amber-400 transition cursor-pointer group"
                  title="Đăng nhập / Đăng ký"
                >
                  <User className="w-5 h-5 text-neutral-300 group-hover:text-amber-400 transition mb-0.5" />
                  <span className="text-[11px] font-medium hidden md:inline">Tài khoản</span>
                </button>
              )}

              {/* Nút Yêu Thích (Mini) */}
              <button 
                onClick={onOpenWishlist}
                className="relative hidden sm:flex flex-col items-center justify-center text-neutral-300 hover:text-rose-400 transition cursor-pointer group"
                title="Sản phẩm đã thích"
              >
                <Heart className="w-5 h-5 text-neutral-300 group-hover:text-rose-400 transition mb-0.5" />
                <span className="text-[11px] font-medium hidden md:inline">Yêu thích</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Nút Giỏ Hàng (Icon giỏ quai xách màu cam/vàng đặc trưng) */}
              <button 
                onClick={onOpenCart}
                className="flex flex-col items-center justify-center text-neutral-300 hover:text-amber-400 transition cursor-pointer group relative"
                title="Giỏ hàng mua sắm"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-neutral-300 group-hover:text-amber-400 transition mb-0.5" />
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-neutral-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                </div>
                <span className="text-[11px] font-medium hidden md:inline">Giỏ hàng</span>
              </button>
            </div>
          </div>

          {/* Search bar trên Mobile */}
          <form 
            onSubmit={handleSearchSubmit}
            className="sm:hidden pb-3 relative flex items-center"
          >
            <input 
              type="text" 
              value={searchValue || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Bạn đang tìm gì..." 
              className="w-full bg-white text-neutral-900 text-xs rounded-lg pl-3 pr-10 py-2 outline-none font-medium"
            />
            <button 
              type="submit"
              className="absolute right-1 bg-neutral-950 text-white w-7 h-7 rounded flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. TẦNG 3: THANH MENU ĐIỀU HƯỚNG TRẮNG TINH TẾ */}
      <div className="bg-white text-neutral-800 border-b border-neutral-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-8 lg:gap-10 h-11 text-xs lg:text-[13px] font-bold tracking-wider uppercase">
            {/* SẢN PHẨM MỚI */}
            <button 
              onClick={() => onNavigate && onNavigate('products', 'Tất cả')}
              className={`hover:text-amber-600 transition cursor-pointer ${
                currentTab === 'products' && activeCategory === 'Tất cả' ? 'text-amber-600' : 'text-neutral-900'
              }`}
            >
              SẢN PHẨM MỚI
            </button>

            {/* DANH MỤC SALE -50% (HỘP BADGE ĐỎ NỔI BẬT) */}
            <button 
              onClick={() => onNavigate && onNavigate('products', 'Tất cả')}
              className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 transition cursor-pointer group"
            >
              <span>DANH MỤC SALE</span>
              <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded group-hover:scale-105 transition-transform">
                -50%
              </span>
            </button>

            {/* ÁO NAM (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('aonam')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => onNavigate && onNavigate('products', 'Áo Sơ Mi')}
                className={`flex items-center gap-1 hover:text-amber-600 transition cursor-pointer py-2 ${
                  activeCategory === 'Áo Sơ Mi' || activeCategory === 'Áo Polo' ? 'text-amber-600' : 'text-neutral-900'
                }`}
              >
                <span>ÁO NAM</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {activeDropdown === 'aonam' && (
                <div className="absolute top-full left-0 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 text-left normal-case">
                  <button 
                    onClick={() => { onNavigate && onNavigate('products', 'Áo Sơ Mi'); setActiveDropdown(null); }}
                    className="block w-full px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-amber-50 hover:text-amber-600 text-left transition"
                  >
                    Áo Sơ Mi Nam
                  </button>
                  <button 
                    onClick={() => { onNavigate && onNavigate('products', 'Áo Polo'); setActiveDropdown(null); }}
                    className="block w-full px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-amber-50 hover:text-amber-600 text-left transition"
                  >
                    Áo Polo Nam
                  </button>
                  <button 
                    onClick={() => { onNavigate && onNavigate('products', 'Áo Khoác & Blazer'); setActiveDropdown(null); }}
                    className="block w-full px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-amber-50 hover:text-amber-600 text-left transition"
                  >
                    Áo Khoác & Blazer
                  </button>
                </div>
              )}
            </div>

            {/* QUẦN NAM (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('quannam')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => onNavigate && onNavigate('products', 'Quần Âu Công Sở')}
                className={`flex items-center gap-1 hover:text-amber-600 transition cursor-pointer py-2 ${
                  activeCategory === 'Quần Âu Công Sở' || activeCategory === 'Quần Jeans & Khaki' || activeCategory === 'Quần Short' ? 'text-amber-600' : 'text-neutral-900'
                }`}
              >
                <span>QUẦN NAM</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {activeDropdown === 'quannam' && (
                <div className="absolute top-full left-0 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 text-left normal-case">
                  <button 
                    onClick={() => { onNavigate && onNavigate('products', 'Quần Âu Công Sở'); setActiveDropdown(null); }}
                    className="block w-full px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-amber-50 hover:text-amber-600 text-left transition"
                  >
                    Quần Âu Công Sở
                  </button>
                  <button 
                    onClick={() => { onNavigate && onNavigate('products', 'Quần Jeans & Khaki'); setActiveDropdown(null); }}
                    className="block w-full px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-amber-50 hover:text-amber-600 text-left transition"
                  >
                    Quần Jeans & Khaki
                  </button>
                  <button 
                    onClick={() => { onNavigate && onNavigate('products', 'Quần Short'); setActiveDropdown(null); }}
                    className="block w-full px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-amber-50 hover:text-amber-600 text-left transition"
                  >
                    Quần Short Dạo Phố
                  </button>
                </div>
              )}
            </div>

            {/* PHỤ KIỆN (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('phukien')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                onClick={() => onNavigate && onNavigate('products', 'Phụ Kiện')}
                className={`flex items-center gap-1 hover:text-amber-600 transition cursor-pointer py-2 ${
                  activeCategory === 'Phụ Kiện' ? 'text-amber-600' : 'text-neutral-900'
                }`}
              >
                <span>PHỤ KIỆN</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {activeDropdown === 'phukien' && (
                <div className="absolute top-full left-0 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 text-left normal-case">
                  <button 
                    onClick={() => { onNavigate && onNavigate('products', 'Phụ Kiện'); setActiveDropdown(null); }}
                    className="block w-full px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-amber-50 hover:text-amber-600 text-left transition"
                  >
                    Thắt Lưng Da Thật
                  </button>
                  <button 
                    onClick={() => { onNavigate && onNavigate('products', 'Phụ Kiện'); setActiveDropdown(null); }}
                    className="block w-full px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-amber-50 hover:text-amber-600 text-left transition"
                  >
                    Ví Da & Cà Vạt
                  </button>
                </div>
              )}
            </div>

            {/* TIN TỨC (TORANO JOURNAL) */}
            <button 
              onClick={() => onNavigate && onNavigate('blog')}
              className={`hover:text-amber-600 transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'blog' ? 'text-amber-600 font-black' : 'text-neutral-900'
              }`}
            >
              <span>TIN TỨC</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </button>
          </nav>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 text-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <button 
            onClick={() => { onNavigate && onNavigate('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2.5 text-sm font-bold border-b border-neutral-800"
          >
            TRANG CHỦ
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('blog'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2.5 text-sm font-bold border-b border-neutral-800 text-amber-400"
          >
            TIN TỨC & BỘ SƯU TẬP (JOURNAL) 📖
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('products', 'Tất cả'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2.5 text-sm font-bold border-b border-neutral-800 text-rose-400"
          >
            DANH MỤC SALE -50% 🔥
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('products', 'Áo Sơ Mi'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm text-neutral-300 border-b border-neutral-800"
          >
            ÁO NAM (Sơ Mi, Polo, Blazer)
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('products', 'Quần Âu Công Sở'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm text-neutral-300 border-b border-neutral-800"
          >
            QUẦN NAM (Quần Âu, Jeans, Shorts)
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('products', 'Phụ Kiện'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm text-neutral-300 border-b border-neutral-800"
          >
            PHỤ KIỆN ĐỒ DA
          </button>
        </div>
      )}
    </header>
  );
};
