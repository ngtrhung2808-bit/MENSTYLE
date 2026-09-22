import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Cột 1: Thông tin thương hiệu MENSTYLE */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2 font-black text-2xl tracking-wider text-white">
              <span className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center text-sm font-black shadow-md">
                M
              </span>
              <span>MEN<span className="text-amber-400 font-light">STYLE</span></span>
            </a>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Thương hiệu thời trang nam cao cấp, định hình phong cách lịch lãm, bản lĩnh và hiện đại cho quý ông Việt qua từng đường may tinh xảo.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cột 2: Danh mục nam */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Sản Phẩm Nam</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition">Áo Blazer & Suit May Đo</a></li>
              <li><a href="#" className="hover:text-white transition">Áo Sơ Mi Chống Nhăn</a></li>
              <li><a href="#" className="hover:text-white transition">Áo Polo Nam Thể Thao</a></li>
              <li><a href="#" className="hover:text-white transition">Quần Tây & Khaki Công Sở</a></li>
              <li><a href="#" className="hover:text-white transition">Phụ Kiện Thắt Lưng, Ví Da</a></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Chính Sách</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition">Bảng quy đổi size Nam</a></li>
              <li><a href="#" className="hover:text-white transition">Chính sách đổi trả 15 ngày</a></li>
              <li><a href="#" className="hover:text-white transition">Bảo hành đường may trọn đời</a></li>
              <li><a href="#" className="hover:text-white transition">Giao hàng hỏa tốc 2 giờ</a></li>
              <li><a href="#" className="hover:text-white transition">Chính sách hội viên VIP</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Hệ Thống Cửa Hàng</h4>
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
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-400">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-neutral-400">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
