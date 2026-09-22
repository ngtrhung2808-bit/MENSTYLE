import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { Button } from '../common/Button';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200">
      {/* Top Notification Bar */}
      <div className="bg-neutral-900 text-white text-xs py-2 text-center font-medium px-4">
        <span>✨ Giảm 20% cho đơn hàng đầu tiên với mã: <strong className="text-brand-300">NEWFASHION</strong></span>
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

          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="#" className="flex items-center gap-1.5 font-extrabold text-2xl tracking-tighter text-neutral-950">
              <span className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center text-sm font-bold shadow-md">
                A
              </span>
              <span>AURA<span className="text-brand-600 font-light">STUDIO</span></span>
            </a>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <a href="#" className="text-neutral-950 font-semibold transition hover:text-brand-600">Trang chủ</a>
            <a href="#" className="hover:text-neutral-950 transition">Bộ sưu tập</a>
            <a href="#" className="hover:text-neutral-950 transition">Nam</a>
            <a href="#" className="hover:text-neutral-950 transition">Nữ</a>
            <a href="#" className="hover:text-neutral-950 transition text-rose-600 font-semibold">Sale 50%</a>
          </nav>

          {/* Search Box */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Tìm kiếm áo sơ mi, blazer, váy..." 
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
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              <span className="font-semibold text-xs">Giỏ hàng</span>
              <span className="ml-1.5 bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                3
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
              placeholder="Tìm kiếm quần áo..." 
              className="w-full bg-neutral-100 rounded-lg pl-9 pr-4 py-2 text-sm border-none outline-none"
            />
          </div>
          <a href="#" className="block py-2 text-base font-semibold text-neutral-900 border-b border-neutral-100">Trang chủ</a>
          <a href="#" className="block py-2 text-base font-medium text-neutral-700 border-b border-neutral-100">Bộ sưu tập Mới</a>
          <a href="#" className="block py-2 text-base font-medium text-neutral-700 border-b border-neutral-100">Thời trang Nam</a>
          <a href="#" className="block py-2 text-base font-medium text-neutral-700 border-b border-neutral-100">Thời trang Nữ</a>
          <a href="#" className="block py-2 text-base font-bold text-rose-600">Flash Sale 50%</a>
        </div>
      )}
    </header>
  );
};
