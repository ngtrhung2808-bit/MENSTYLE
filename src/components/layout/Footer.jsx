import React from 'react';
import { Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-black text-2xl tracking-wider text-white">
              <span className="w-8 h-8 rounded-lg bg-white text-neutral-950 flex items-center justify-center text-sm font-black shadow-sm">
                M
              </span>
              <span>MEN<span className="text-neutral-500 font-light">STYLE</span></span>
            </div>
            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
              Thương hiệu thời trang nam cao cấp, định hình phong cách quý ông hiện đại với sự tối giản, lịch lãm và chuẩn mực trong từng đường kim mũi chỉ.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cột 2: Bộ sưu tập */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase text-white mb-4">Sản Phẩm</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition">Áo Sơ Mi Luxury</a></li>
              <li><a href="#" className="hover:text-white transition">Áo Polo Pima</a></li>
              <li><a href="#" className="hover:text-white transition">Blazer & Suit</a></li>
              <li><a href="#" className="hover:text-white transition">Quần Âu Công Sở</a></li>
              <li><a href="#" className="hover:text-white transition">Phụ Kiện Da Thật</a></li>
            </ul>
          </div>

          {/* Cột 3: Trợ giúp */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase text-white mb-4">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition">Hướng dẫn chọn size</a></li>
              <li><a href="#" className="hover:text-white transition">Chính sách đổi trả 30 ngày</a></li>
              <li><a href="#" className="hover:text-white transition">Phương thức vận chuyển</a></li>
              <li><a href="#" className="hover:text-white transition">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition">Hệ thống cửa hàng</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase text-white mb-4">Liên Hệ</h4>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1900 6868 (8:00 - 22:00)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@menstyle.vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 MENSTYLE - Thương hiệu thời trang nam cao cấp.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-400">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-neutral-400">Chính sách bảo mật</a>
            {/* ĐƯỜNG DẪN MỞ ADMIN LOCAL - CHỈ XUẤT HIỆN KHI CHẠY LOCALHOST */}
            {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
              <a
                href="/?admin"
                className="text-amber-500 hover:text-amber-400 font-bold bg-neutral-900 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] transition shadow-xs"
                title="Đường dẫn quản trị nội bộ (Chỉ hiện trên Localhost)"
              >
                ⚙️ Quản Trị (Local)
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
