import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { Button } from '../common/Button';

export const Header = ({ 
  onOpenCart, 
  cartCount = 0, 
  currentTab = 'home', 
  onNavigate, 
  currentUser, 
  onOpenAuth,
  searchValue = '',
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 w-full">
      {/* Top Notification Bar */}
      <div className="bg-neutral-950 text-white text-[11px] sm:text-xs py-1.5 sm:py-2 text-center font-medium px-3 tracking-wide truncate">
        <span>🔥 Giảm 20% đơn đầu tiên: <strong className="text-amber-400 font-bold">MENSTYLE20</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Cụm Trái: Nút Menu + Logo */}
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              className="md:hidden p-1.5 -ml-1 text-neutral-700 hover:text-neutral-950 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo MENSTYLE */}
            <button 
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-1.5 font-black text-xl sm:text-2xl tracking-wider text-neutral-950"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-950 text-amber-400 flex items-center justify-center text-xs sm:text-sm font-black shadow-sm border border-neutral-800">
                M
              </span>
              <span>MEN<span className="text-neutral-400 font-light">STYLE</span></span>
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-neutral-600">
            <button 
              onClick={() => onNavigate && onNavigate('home')} 
              className={`transition cursor-pointer ${currentTab === 'home' ? 'text-amber-600 font-bold' : 'hover:text-neutral-950'}`}
            >
              Trang chủ
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('products', 'Tất cả')} 
              className={`transition cursor-pointer ${currentTab === 'products' ? 'text-amber-600 font-bold' : 'hover:text-neutral-950'}`}
            >
              Tất Cả Sản Phẩm
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('products', 'Áo Sơ Mi')} 
              className="hover:text-neutral-950 transition cursor-pointer"
            >
              Áo Sơ Mi
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('products', 'Áo Polo')} 
              className="hover:text-neutral-950 transition cursor-pointer"
            >
              Áo Polo
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('products', 'Blazer & Suit')} 
              className="hover:text-neutral-950 transition cursor-pointer"
            >
              Blazer & Suit
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('products', 'Quần Âu & Jean')} 
              className="hover:text-neutral-950 transition cursor-pointer"
            >
              Quần Âu & Jean
            </button>
          </nav>

          {/* Search Box Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input 
              type="text" 
              value={searchValue || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onNavigate) {
                  onNavigate('products');
                }
              }}
              placeholder="Tìm kiếm áo sơ mi, polo, suit..." 
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-xs rounded-full pl-9 pr-4 py-2 border border-transparent focus:border-neutral-300 outline-none transition"
            />
          </div>

          {/* Cụm Phải: Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" aria-label="Yêu thích" className="hidden sm:inline-flex relative p-2">
              <Heart className="w-5 h-5 text-neutral-700" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </Button>

            {/* Nút Tài khoản / Đăng nhập */}
            {currentUser ? (
              <button
                onClick={() => onNavigate && onNavigate('profile')}
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-neutral-100 text-neutral-900 transition text-xs font-bold"
                title="Hồ sơ tài khoản"
              >
                <div className="w-7 h-7 rounded-full bg-neutral-950 text-amber-400 flex items-center justify-center font-bold text-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline-block max-w-[100px] truncate">{currentUser.name}</span>
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-950 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline-block">Đăng nhập</span>
              </button>
            )}

            <Button 
              onClick={onOpenCart}
              variant="primary" 
              size="sm" 
              className="relative !rounded-full px-2.5 sm:px-4 py-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400 sm:mr-1.5" />
              <span className="hidden sm:inline-block font-semibold text-xs">Giỏ hàng</span>
              <span className="ml-1 sm:ml-1.5 bg-amber-500 text-neutral-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              value={searchValue || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onNavigate) {
                  onNavigate('products');
                  setMobileMenuOpen(false);
                }
              }}
              placeholder="Tìm kiếm áo sơ mi, suit, quần..." 
              className="w-full bg-neutral-100 rounded-lg pl-9 pr-4 py-2 text-sm border-none outline-none"
            />
          </div>
          <button 
            onClick={() => { onNavigate && onNavigate('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-base font-semibold text-neutral-900 border-b border-neutral-100"
          >
            Trang chủ
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('products', 'Tất cả'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-base font-semibold text-neutral-900 border-b border-neutral-100"
          >
            Tất Cả Sản Phẩm
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('products', 'Áo Sơ Mi'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-base font-medium text-neutral-700 border-b border-neutral-100"
          >
            Áo Sơ Mi
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('products', 'Áo Polo'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-base font-medium text-neutral-700 border-b border-neutral-100"
          >
            Áo Polo
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('products', 'Blazer & Suit'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-base font-medium text-neutral-700 border-b border-neutral-100"
          >
            Blazer & Suit Nam
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('products', 'Quần Âu & Jean'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-base font-medium text-neutral-700 border-b border-neutral-100"
          >
            Quần Âu & Jean
          </button>
          <button 
            onClick={() => { onNavigate && onNavigate('products', 'Phụ Kiện'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-base font-medium text-neutral-700 border-b border-neutral-100"
          >
            Phụ Kiện Đồ Da
          </button>
        </div>
      )}
    </header>
  );
};
