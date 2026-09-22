import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { Button } from '../common/Button';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200">
      {/* Top Notification Bar */}
      <div className="bg-neutral-950 text-white text-xs py-2 text-center font-medium px-4 tracking-wide">
        <span>🔥 Ưu đãi độc quyền nam giới: Giảm 20% đơn đầu tiên với mã: <strong className="text-amber-400 font-bold">MENSTYLE20</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            type="button" 
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo MENSTYLE */}
          <div className="flex items-center gap-2">
            <a href="#" className="flex items-center gap-2 font-black text-2xl tracking-wider text-neutral-950">
              <span className="w-8 h-8 rounded-lg bg-neutral-950 text-amber-400 flex items-center justify-center text-sm font-black shadow-md border border-neutral-800">
                M
              </span>
              <span>MEN<span className="text-neutral-400 font-light">STYLE</span></span>
            </a>
          </div>

          {/* Navigation Links (Thời trang nam) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-600">
            <a href="#" className="text-neutral-950 transition hover:text-neutral-900">Trang chủ</a>
            <a href="#" className="hover:text-neutral-950 transition">Áo Sơ Mi & Polo</a>
            <a href="#" className="hover:text-neutral-950 transition">Blazer & Suit</a>
            <a href="#" className="hover:text-neutral-950 transition">Quần Âu & Jean</a>
            <a href="#" className="hover:text-neutral-950 transition">Phụ Kiện Nam</a>
            <a href="#" className="text-rose-600 hover:text-rose-700 transition">Ưu đãi Hot</a>
          </nav>

          {/* Search Box */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Tìm kiếm áo sơ mi, polo, blazer..." 
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-xs rounded-full pl-9 pr-4 py-2 border border-transparent focus:border-neutral-300 outline-none transition"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" aria-label="Tìm kiếm" className="lg:hidden">
              <Search className="w-5 h-5 text-neutral-700" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Yêu thích" className="relative">
              <Heart className="w-5 h-5 text-neutral-700" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Tài khoản">
              <User className="w-5 h-5 text-neutral-700" />
            </Button>
            <Button variant="primary" size="sm" className="relative !rounded-full px-3.5 sm:px-4 py-2">
              <ShoppingBag className="w-4 h-4 mr-1.5 text-amber-400" />
              <span className="font-semibold text-xs">Giỏ hàng</span>
              <span className="ml-1.5 bg-amber-500 text-neutral-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                2
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Tìm kiếm áo sơ mi, suit, quần..." 
              className="w-full bg-neutral-100 rounded-lg pl-9 pr-4 py-2 text-sm border-none outline-none"
            />
          </div>
          <a href="#" className="block py-2 text-base font-semibold text-neutral-900 border-b border-neutral-100">Trang chủ</a>
          <a href="#" className="block py-2 text-base font-medium text-neutral-700 border-b border-neutral-100">Áo Sơ Mi & Polo</a>
          <a href="#" className="block py-2 text-base font-medium text-neutral-700 border-b border-neutral-100">Blazer & Suit Nam</a>
          <a href="#" className="block py-2 text-base font-medium text-neutral-700 border-b border-neutral-100">Quần Âu & Jean</a>
          <a href="#" className="block py-2 text-base font-medium text-neutral-700 border-b border-neutral-100">Phụ Kiện Đồ Da</a>
          <a href="#" className="block py-2 text-base font-bold text-rose-600">Ưu đãi Hot</a>
        </div>
      )}
    </header>
  );
};
