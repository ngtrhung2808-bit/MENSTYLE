import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Share2, Shield, RotateCcw, Truck, Store, FileText, CheckCircle2, X } from 'lucide-react';
import { SmartSizeGuideModal } from '../product/SmartSizeGuideModal';

export const Footer = ({ onNavigate }) => {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'return' | 'shipping' | 'privacy' | 'terms' | 'stores'
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <>
      <footer className="bg-neutral-950 text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Cột 1: Thông tin thương hiệu */}
            <div className="lg:col-span-2 space-y-4">
              <div 
                onClick={() => onNavigate && onNavigate('home')}
                className="flex items-center gap-2 font-black text-2xl tracking-wider text-white cursor-pointer group w-fit"
              >
                <span className="w-8 h-8 rounded-lg bg-white text-neutral-950 flex items-center justify-center text-sm font-black shadow-sm group-hover:bg-amber-400 transition">
                  M
                </span>
                <span>MEN<span className="text-neutral-500 font-light group-hover:text-amber-400 transition">STYLE</span></span>
              </div>
              <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
                Thương hiệu thời trang nam cao cấp, định hình phong cách quý ông hiện đại với sự tối giản, lịch lãm và chuẩn mực trong từng đường kim mũi chỉ.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => onNavigate && onNavigate('home')}
                  title="Trang chủ MENSTYLE"
                  className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                </button>
                <a 
                  href="mailto:support@menstyle.vn"
                  title="Gửi email hỗ trợ"
                  className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <button 
                  onClick={handleShare}
                  title="Chia sẻ liên kết website"
                  className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 transition cursor-pointer relative"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedShare && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-400 text-neutral-950 text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap animate-in fade-in">
                      Đã sao chép link!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Cột 2: Bộ sưu tập Sản Phẩm - Điều hướng chính xác theo danh mục */}
            <div>
              <h4 className="font-bold text-sm tracking-wider uppercase text-white mb-4">Sản Phẩm</h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('products', 'Áo Sơ Mi')} 
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Áo Sơ Mi Luxury
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('products', 'Áo Polo')} 
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Áo Polo Pima
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('products', 'Áo Khoác & Blazer')} 
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Blazer & Áo Khoác
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('products', 'Quần Âu Công Sở')} 
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Quần Âu Công Sở
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('products', 'Quần Short')} 
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Quần Short Dạo Phố
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate && onNavigate('products', 'Phụ Kiện')} 
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Phụ Kiện Da Thật
                  </button>
                </li>
              </ul>
            </div>

            {/* Cột 3: Hỗ trợ khách hàng - Bật popup chi tiết */}
            <div>
              <h4 className="font-bold text-sm tracking-wider uppercase text-white mb-4">Hỗ Trợ Khách Hàng</h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                <li>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Hướng dẫn chọn size
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('return')}
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Chính sách đổi trả 30 ngày
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('shipping')}
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Phương thức vận chuyển
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Chính sách bảo mật
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('stores')}
                    className="hover:text-amber-400 transition cursor-pointer text-left"
                  >
                    Hệ thống cửa hàng
                  </button>
                </li>
              </ul>
            </div>

            {/* Cột 4: Liên hệ trực tiếp */}
            <div>
              <h4 className="font-bold text-sm tracking-wider uppercase text-white mb-4">Liên Hệ</h4>
              <div className="space-y-3 text-sm text-neutral-400">
                <a 
                  href="https://maps.google.com/?q=Số+1+Đại+Cồ+Việt,+Hai+Bà+Trưng,+Hà+Nội"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2.5 hover:text-white transition group"
                >
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</span>
                </a>
                <a 
                  href="tel:19006868"
                  className="flex items-center gap-2.5 hover:text-white transition group"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>1900 6868 (8:00 - 22:00)</span>
                </a>
                <a 
                  href="mailto:support@menstyle.vn"
                  className="flex items-center gap-2.5 hover:text-white transition group"
                >
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>support@menstyle.vn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bản quyền & Điều khoản dưới đáy */}
          <div className="pt-8 mt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
            <p>© 2026 MENSTYLE - Thương hiệu thời trang nam cao cấp.</p>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveModal('terms')} 
                className="hover:text-amber-400 transition cursor-pointer"
              >
                Điều khoản dịch vụ
              </button>
              <button 
                onClick={() => setActiveModal('privacy')} 
                className="hover:text-amber-400 transition cursor-pointer"
              >
                Chính sách bảo mật
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Hướng Dẫn Chọn Size Thông Minh */}
      <SmartSizeGuideModal 
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productCategory="Áo Polo & Sơ Mi"
      />

      {/* Modal Chính Sách & Thông Tin Hỗ Trợ */}
      {activeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div 
            className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          />

          <div className="relative bg-white text-neutral-900 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal: Đổi trả 30 ngày */}
            {activeModal === 'return' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <RotateCcw className="w-6 h-6" />
                  <h3 className="text-lg font-bold text-neutral-950">Chính Sách Đổi Trả Trong 30 Ngày</h3>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 space-y-2 leading-relaxed">
                  <p>MENSTYLE cam kết đem lại sự an tâm tuyệt đối cho quý khách:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Miễn phí đổi hàng tận nơi trên toàn quốc trong vòng <strong>30 ngày</strong>.</li>
                    <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng hoặc giặt tẩy.</li>
                    <li>Shipper mang sản phẩm size mới đến tận nhà và nhận lại sản phẩm cũ cùng lúc.</li>
                    <li>Hoàn tiền 100% nếu phát sinh lỗi từ nhà sản xuất hoặc vải không đúng mô tả.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Modal: Vận chuyển */}
            {activeModal === 'shipping' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-blue-600">
                  <Truck className="w-6 h-6" />
                  <h3 className="text-lg font-bold text-neutral-950">Chính Sách Vận Chuyển Toàn Quốc</h3>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 space-y-2 leading-relaxed">
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li><strong>Freeship:</strong> Miễn phí vận chuyển cho tất cả đơn hàng từ <strong>500.000đ</strong>.</li>
                    <li><strong>Giao hàng hỏa tốc:</strong> 2 - 4 tiếng tại nội thành Hà Nội & TP. Hồ Chí Minh.</li>
                    <li><strong>Giao tiêu chuẩn:</strong> 1 - 3 ngày làm việc tới tất cả các tỉnh thành trên cả nước.</li>
                    <li>Được kiểm tra hàng (đồng kiểm) trước khi thanh toán cho nhân viên giao hàng.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Modal: Bảo mật */}
            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-600">
                  <Shield className="w-6 h-6" />
                  <h3 className="text-lg font-bold text-neutral-950">Chính Sách Bảo Mật Thông Tin</h3>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 space-y-2 leading-relaxed">
                  <p>MENSTYLE cam kết bảo mật tuyệt đối dữ liệu khách hàng theo chuẩn quốc tế:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Mã hóa bảo vệ toàn bộ thông tin thanh toán ngân hàng, VietQR và tài khoản.</li>
                    <li>Không chia sẻ hoặc cung cấp thông tin số điện thoại, địa chỉ khách cho bên thứ ba.</li>
                    <li>Khách hàng có quyền yêu cầu tra soát hoặc xóa toàn bộ dữ liệu tài khoản bất cứ lúc nào.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Modal: Điều khoản */}
            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-neutral-900">
                  <FileText className="w-6 h-6 text-amber-500" />
                  <h3 className="text-lg font-bold text-neutral-950">Điều Khoản Dịch Vụ MENSTYLE</h3>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 space-y-2 leading-relaxed">
                  <p>Khi mua sắm tại MENSTYLE, quý khách được đảm bảo đầy đủ các quyền lợi:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Sản phẩm được niêm yết giá công khai, minh bạch đã bao gồm thuế VAT.</li>
                    <li>Cam kết sản phẩm cao cấp chính hãng 100%, bảo hành đường may và nút áo trọn đời.</li>
                    <li>Hỗ trợ tư vấn phong cách trang phục 24/7 từ chuyên viên Stylist.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Modal: Hệ thống cửa hàng */}
            {activeModal === 'stores' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <Store className="w-6 h-6" />
                  <h3 className="text-lg font-bold text-neutral-950">Hệ Thống Cửa Hàng Flagship Store</h3>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 space-y-3 leading-relaxed">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <h5 className="font-bold text-neutral-900 text-xs">Flagship Hà Nội:</h5>
                    <p className="text-neutral-500 text-xs mt-0.5">Số 1 Đại Cồ Việt, Quận Hai Bà Trưng, TP. Hà Nội</p>
                    <p className="text-[11px] text-amber-600 font-bold mt-1">Hotline: 0988 776 655 (Mở cửa 8:30 - 22:00)</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <h5 className="font-bold text-neutral-900 text-xs">Showroom TP. Hồ Chí Minh:</h5>
                    <p className="text-neutral-500 text-xs mt-0.5">Tầng 2 Vincom Center Đồng Khởi, Quận 1, TP. HCM</p>
                    <p className="text-[11px] text-amber-600 font-bold mt-1">Hotline: 0912 345 678 (Mở cửa 9:00 - 22:00)</p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 mt-2 border-t border-neutral-100 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition"
              >
                Đã Hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
