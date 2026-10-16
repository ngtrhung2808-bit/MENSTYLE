import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { generateOutfitRecommendation } from '../../services/geminiService';
import { Button } from '../common/Button';

const OCCASIONS = [
  { id: 'cong-so', label: '💼 Công Sở & Gặp Đối Tác', desc: 'Thanh lịch, uy tín & đĩnh đạc' },
  { id: 'tiec-cuoi', label: '🥂 Dạ Tiệc & Đám Cưới', desc: 'Sang trọng, lịch lãm & thu hút' },
  { id: 'dao-pho', label: '☕ Dạo Phố & Hẹn Hò', desc: 'Trẻ trung, năng động & phóng khoáng' },
  { id: 'golf-sport', label: '🏌️ Thể Thao & Đánh Golf', desc: 'Co giãn tối đa, thoáng mát cả ngày' }
];

export const SmartOutfitStylistModal = ({ isOpen, onClose, products = [], onAddMultipleToCart }) => {
  if (!isOpen) return null;

  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0].label);
  const [userNote, setUserNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setAddedSuccess(false);
    try {
      const res = await generateOutfitRecommendation(selectedOccasion, userNote, products);
      setOutfit(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng giá combo set đồ
  const totalPrice = outfit?.items?.reduce((sum, item) => sum + item.price, 0) || 0;
  const originalTotalPrice = outfit?.items?.reduce((sum, item) => sum + (item.originalPrice || item.price * 1.2), 0) || 0;

  const handleAddAll = () => {
    if (outfit?.items && onAddMultipleToCart) {
      onAddMultipleToCart(outfit.items);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 fill-neutral-950" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-neutral-950 flex items-center gap-2">
                MENSTYLE AI Smart Stylist
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-700 px-2 py-0.5 rounded-full border border-amber-300">
                  Powered by Gemini
                </span>
              </h3>
              <p className="text-xs text-neutral-500">Phối nguyên set đồ chuẩn gu quý ông theo từng hoàn cảnh cụ thể</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Chọn hoàn cảnh */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-2">
              1. Bạn đang chuẩn bị trang phục cho dịp nào?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccasion(occ.label)}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedOccasion === occ.label 
                      ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm' 
                      : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800'
                  }`}
                >
                  <span className="block text-xs font-bold">{occ.label}</span>
                  <span className={`block text-[10px] mt-0.5 ${selectedOccasion === occ.label ? 'text-amber-400' : 'text-neutral-500'}`}>
                    {occ.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Ghi chú thêm (Optional) */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              2. Ghi chú thêm gu phối màu hoặc vóc dáng (Không bắt buộc):
            </label>
            <input 
              type="text"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Ví dụ: Thích gam màu tối trầm, dáng người hơi gầy, form ôm nhẹ..."
              className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Nút Kích Hoạt Phối Đồ AI */}
          <div className="text-center pt-1">
            <Button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950 hover:to-neutral-950 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>AI Đang Phân Tích & Phối Đồ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{outfit ? 'Gợi Ý Set Đồ Khác Bằng AI' : 'Bắt Đầu Phối Set Đồ Bằng AI'}</span>
                </>
              )}
            </Button>
          </div>

          {/* Hiển Thị Kết Quả Set Đồ Đã Phối */}
          {outfit && (
            <div className="mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                    Đề Xuất Dành Cho Bạn
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-neutral-950">{outfit.title}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-neutral-950 block">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                  </span>
                  <span className="text-[10px] text-neutral-400 line-through">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalTotalPrice)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 italic bg-white p-2.5 rounded-xl border border-neutral-200 mb-3">
                "{outfit.reason}"
              </p>

              {/* Danh sách 3 món trong set */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {outfit.items.map((item, i) => (
                  <div key={item.id || i} className="bg-white p-2 sm:p-2.5 rounded-xl border border-neutral-200 flex flex-col justify-between">
                    <div>
                      <img 
                        src={item.images?.[0] || item.image} 
                        alt={item.name} 
                        className="w-full aspect-[3/4] object-cover rounded-lg border border-neutral-100 mb-1.5"
                      />
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block mb-1">
                        {item.category}
                      </span>
                      <h5 className="text-[11px] font-semibold text-neutral-900 line-clamp-2 leading-tight">
                        {item.name}
                      </h5>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-950">
                        {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút bấm mua cả set */}
              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
                <span className="text-xs text-neutral-500 hidden sm:inline">
                  Bao gồm 3 món phối chuẩn gu
                </span>
                <Button
                  onClick={handleAddAll}
                  disabled={addedSuccess}
                  className={`flex-1 sm:flex-initial text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition ${
                    addedSuccess 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-amber-500 hover:bg-amber-600 text-neutral-950 shadow-md'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Đã Thêm Cả Set Vào Giỏ Hàng!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Thêm Nguyên Set Vào Giỏ Hàng
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
