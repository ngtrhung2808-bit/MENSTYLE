import React, { useState } from 'react';
import { 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Truck, 
  Banknote, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldAlert, 
  ArrowRight, 
  FileText,
  X,
  Package,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';

export const ReturnPolicyModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('conditions'); // 'conditions' | 'process' | 'shipping_refund' | 'contact'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white text-neutral-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-neutral-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-950 tracking-tight">
                Chính Sách & Quy Trình Đổi Trả Hàng
              </h3>
              <p className="text-xs text-neutral-500">
                Cam kết quyền lợi tối đa cho quý khách hàng - Hỗ trợ đổi size/mẫu trong 7 đến 15 ngày
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-neutral-100 py-3 shrink-0 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('conditions')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'conditions'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            1. Điều Kiện & Quy Định
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'process'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            2. Quy Trình 4 Bước Đổi Trả
          </button>
          <button
            onClick={() => setActiveTab('shipping_refund')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'shipping_refund'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            3. Phí Vận Chuyển & Hoàn Tiền
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            4. Thông Tin Liên Hệ CSKH
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-5 text-xs sm:text-sm leading-relaxed text-neutral-600">
          
          {/* TAB 1: ĐIỀU KIỆN ĐỔI TRẢ */}
          {activeTab === 'conditions' && (
            <div className="space-y-4">
              {/* 1. Điều kiện được trả */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 
                  1. Điều kiện được chấp nhận trả hàng & đổi mới
                </h4>
                <ul className="space-y-1.5 text-neutral-700 pl-6 list-disc text-xs sm:text-sm">
                  <li>Sản phẩm giao không đúng kích thước (size), màu sắc, mẫu mã so với đơn đặt hàng.</li>
                  <li>Sản phẩm phát sinh lỗi kỹ thuật từ nhà sản xuất (lỗi đường chỉ, lỗi cúc, lỗi khóa kéo, lỗi vải loang màu).</li>
                  <li>Sản phẩm bị rách, ướt, móp méo hư hại do quá trình vận chuyển của đơn vị giao nhận.</li>
                  <li>Khách hàng mặc không vừa size và có nhu cầu đổi sang kích cỡ hoặc sản phẩm khác phù hợp.</li>
                </ul>
              </div>

              {/* 2. Điều kiện của sản phẩm */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-amber-600" /> 
                  2. Yêu cầu trạng thái của sản phẩm khi hoàn trả
                </h4>
                <ul className="space-y-1.5 text-neutral-700 pl-6 list-disc text-xs sm:text-sm">
                  <li>Sản phẩm còn <strong>nguyên tem mác (tag)</strong>, mã vạch đính kèm và túi bọc/hộp đóng gói của thương hiệu.</li>
                  <li>Sản phẩm <strong>chưa qua sử dụng</strong>, không có mùi lạ (nước hoa, thuốc lá, mồ hôi).</li>
                  <li>Sản phẩm <strong>tuyệt đối chưa qua giặt tẩy</strong>, ủi ép nhiệt hoặc sửa đổi kích thước từ bên ngoài.</li>
                  <li>Kèm theo hóa đơn mua hàng hoặc mã đơn hàng <strong>#MS-XXXXXX</strong> để nhân viên đối soát.</li>
                </ul>
              </div>

              {/* 3. Trường hợp không được trả */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
                <h4 className="font-bold text-rose-900 text-sm flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> 
                  3. Các trường hợp TỪ CHỐI đổi trả
                </h4>
                <ul className="space-y-1.5 text-neutral-700 pl-6 list-disc text-xs sm:text-sm">
                  <li>Yêu cầu gửi quá thời hạn quy định (<strong>quá 15 ngày</strong> kể từ khi nhận kiện hàng).</li>
                  <li>Sản phẩm thuộc danh mục nhạy cảm vì lý do vệ sinh an toàn: <em>Quần lót, vớ/tất, phụ kiện xỏ lỗ</em>.</li>
                  <li>Sản phẩm bị hư hỏng, rách rưới hoặc biến dạng do sơ suất bảo quản của khách hàng (bị thú cưng cắn, vướng đinh, giặt bằng chất tẩy mạnh).</li>
                  <li>Các sản phẩm trong chương trình đại hạ giá xả kho thanh lý cuối mùa (Flash Sale sâu trên 60%) có ghi rõ không đổi trả.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: QUY TRÌNH 4 BƯỚC */}
          {activeTab === 'process' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-950 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-amber-400">Thời Gian Tiếp Nhận & Xử Lý</h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Khách hàng có thể gửi yêu cầu trong vòng <strong>7 đến 15 ngày</strong> kể từ khi đơn vị vận chuyển phát thành công.
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-400 shrink-0" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Bước 1 */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 relative">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center mb-2.5">
                    01
                  </div>
                  <h5 className="font-bold text-neutral-950 text-sm mb-1">Gửi Yêu Cầu Đổi Trả</h5>
                  <p className="text-xs text-neutral-600">
                    Quý khách liên hệ CSKH qua Hotline/Zalo <strong>1900 6868</strong> hoặc bấm nút <em>"Đổi size / Trả hàng"</em> tại mục Lịch sử đơn hàng, kèm hình ảnh hoặc video mở kiện hàng.
                  </p>
                </div>

                {/* Bước 2 */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 relative">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center mb-2.5">
                    02
                  </div>
                  <h5 className="font-bold text-neutral-950 text-sm mb-1">Shop Xác Nhận Trong 2H</h5>
                  <p className="text-xs text-neutral-600">
                    Chuyên viên MENSTYLE sẽ kiểm tra mã đơn, ảnh chụp tình trạng sản phẩm và gửi mã vận đơn thu hồi hàng tận nơi.
                  </p>
                </div>

                {/* Bước 3 */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 relative">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center mb-2.5">
                    03
                  </div>
                  <h5 className="font-bold text-neutral-950 text-sm mb-1">Đổi Tận Nhà Tiện Lợi</h5>
                  <p className="text-xs text-neutral-600">
                    Bưu tá giao hàng sẽ mang sản phẩm size mới tới tận nhà quý khách, đồng thời nhận lại sản phẩm cũ cùng lúc. Quý khách không cần mang ra bưu cục!
                  </p>
                </div>

                {/* Bước 4 */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 relative">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center mb-2.5">
                    04
                  </div>
                  <h5 className="font-bold text-neutral-950 text-sm mb-1">Hoàn Tất & Hoàn Tiền</h5>
                  <p className="text-xs text-neutral-600">
                    Nếu là trường hợp trả hàng hoàn tiền, hệ thống sẽ chuyển khoản hoàn 100% về STK ngân hàng của quý khách trong vòng 24 - 48 giờ làm việc.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHÍ VẬN CHUYỂN & HÌNH THỨC HOÀN TIỀN */}
          {activeTab === 'shipping_refund' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Quy định về Phí Vận Chuyển Đổi Trả
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-neutral-700">
                  <p>
                    • <strong>Miễn phí 100% cước vận chuyển 2 chiều:</strong> Áp dụng cho các trường hợp do lỗi từ shop (sản phẩm lỗi đường may, rách vải, gửi nhầm size, sai màu sắc hoặc thiếu phụ kiện đính kèm).
                  </p>
                  <p>
                    • <strong>Khách hàng hỗ trợ phí vận chuyển:</strong> Trường hợp quý khách muốn đổi sang mẫu mã khác hoặc đổi size do nhu cầu cá nhân, quý khách chỉ cần thanh toán phí ship đồng giá <strong>30.000₫</strong> trên toàn quốc.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2 mb-2">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  Hình Thức Xử Lý & Hoàn Tiền
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-neutral-700">
                  <p>
                    1. <strong>Đổi sang sản phẩm mới cùng loại:</strong> Áp dụng khi đổi kích cỡ (size) hoặc đổi màu sắc.
                  </p>
                  <p>
                    2. <strong>Đổi sang mẫu sản phẩm khác:</strong> Giá trị sản phẩm đổi mới phải bằng hoặc cao hơn sản phẩm cũ (khách hàng thanh toán thêm phần chênh lệch nếu có).
                  </p>
                  <p>
                    3. <strong>Hoàn tiền trực tiếp qua Chuyển Khoản Ngân Hàng:</strong> Quý khách cung cấp STK & Tên chủ tài khoản, tiền sẽ được hoàn trả đầy đủ trong <strong>24h - 48h</strong> sau khi kho kiểm tra sản phẩm.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: THÔNG TIN LIÊN HỆ */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-neutral-900 text-white space-y-3">
                <h4 className="font-bold text-amber-400 text-base">Bộ Phận Tiếp Nhận & Hỗ Trợ Đổi Trả Hàng MENSTYLE</h4>
                <p className="text-xs text-neutral-300">
                  Đội ngũ CSKH sẵn sàng phục vụ và giải quyết mọi yêu cầu đổi trả của quý khách nhanh chóng và chu đáo nhất.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Hotline CSKH / Zalo hỗ trợ:</span>
                      <strong className="text-sm font-black text-white">1900 6868 - 0988 776 655</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Email tiếp nhận khiếu nại:</span>
                      <strong className="text-sm font-semibold text-white">cskh@menstyle.vn</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs mt-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Trung Tâm Xử Lý & Kho Nhận Hàng Đổi Trả:</span>
                    <strong className="text-white">Kho Vận MENSTYLE, Số 18 Đường Mễ Trì Hạ, P. Mễ Trì, Q. Nam Từ Liêm, Hà Nội</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>Thời gian làm việc bộ phận đổi trả: <strong>08:00 - 22:00 (Cả Thứ 7, Chủ Nhật & Ngày Lễ)</strong></span>
                <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded font-bold">Trực 24/7</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-neutral-400 hidden sm:inline">
            Chính sách cam kết bảo vệ 100% quyền lợi khách hàng
          </span>
          <Button 
            onClick={onClose}
            className="bg-neutral-950 text-white font-bold text-xs px-6 py-2.5 rounded-xl ml-auto cursor-pointer"
          >
            Đã Hiểu & Đóng
          </Button>
        </div>

      </div>
    </div>
  );
};
