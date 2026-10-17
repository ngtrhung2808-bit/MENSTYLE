import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Loader2, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { searchProductsByImage } from '../../services/geminiService';
import { Button } from '../common/Button';

export const VisualSearchModal = ({ isOpen, onClose, products = [], onSelectProduct }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [matchedResults, setMatchedResults] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        performSearch(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const performSearch = async (base64) => {
    setLoading(true);
    setMatchedResults([]);
    try {
      const res = await searchProductsByImage(base64, products);
      setDetectedText(res.detected);
      setMatchedResults(res.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mẫu ảnh nhanh để người dùng thử nghiệm ngay mà không cần upload
  const sampleImages = [
    { label: 'Sơ Mi & Quần Tây', url: 'https://cdn.hstatic.net/products/200000690725/_tdt3787_55384645419_o_9eb6316f754e49f59fbfb250ed92b056.jpg' },
    { label: 'Áo Polo Năng Động', url: 'https://cdn.hstatic.net/products/200000690725/hstp904_cv__2__3b3713f0f3a64832a607c63b6bdc4bb4.webp' },
    { label: 'Blazer Doanh Nhân', url: 'https://cdn.hstatic.net/products/200000690725/hsbk801_to_n_f0a1612b08aa46359ffec2e0d8f83319.webp' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-950 text-amber-400 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-neutral-950 flex items-center gap-2">
                Tìm Kiếm Bằng Hình Ảnh (AI Vision)
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-700 px-2 py-0.5 rounded-full border border-amber-300">
                  AI Vision
                </span>
              </h3>
              <p className="text-xs text-neutral-500">Tải ảnh trang phục bạn thích để AI tìm sản phẩm tương tự trong kho</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Upload Box */}
        <div className="py-4 space-y-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          {!previewImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 hover:border-amber-500 bg-neutral-50 hover:bg-amber-50/20 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition group"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-neutral-800">
                Nhấp để tải ảnh lên hoặc kéo thả vào đây
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">Hỗ trợ JPG, PNG, WEBP từ điện thoại hoặc máy tính</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              <img 
                src={previewImage} 
                alt="Upload preview" 
                className="w-16 h-20 object-cover rounded-xl border border-neutral-300"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">Ảnh Đã Tải Lên</span>
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  {detectedText || 'Đang quét phân tích trang phục...'}
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-amber-600 hover:underline mt-1 block"
                >
                  Chọn ảnh khác
                </button>
              </div>
            </div>
          )}

          {/* Mẫu ảnh thử nghiệm */}
          {!previewImage && (
            <div>
              <span className="text-[11px] font-bold text-neutral-600 mb-2 block">
                Hoặc thử nhanh với mẫu trang phục có sẵn:
              </span>
              <div className="flex gap-2">
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPreviewImage(s.url);
                      performSearch(s.url);
                    }}
                    className="flex-1 p-2 rounded-xl border border-neutral-200 hover:border-neutral-950 bg-white text-left transition flex items-center gap-2"
                  >
                    <img src={s.url} alt={s.label} className="w-8 h-10 object-cover rounded-lg shrink-0" />
                    <span className="text-[10px] font-bold text-neutral-800 line-clamp-2">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trạng thái Loading */}
          {loading && (
            <div className="p-6 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-800">Hệ thống AI Vision đang nhận diện chi tiết vải và phom dáng...</p>
            </div>
          )}

          {/* Kết quả tìm kiếm tương đồng */}
          {matchedResults.length > 0 && !loading && (
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Sản phẩm MENSTYLE tương đồng nhất:
                </span>
                <span className="text-[11px] text-neutral-400">Tìm thấy {matchedResults.length} món</span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 max-h-60 overflow-y-auto pr-1">
                {matchedResults.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(item);
                      onClose();
                    }}
                    className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 cursor-pointer transition flex gap-2.5 items-center group"
                  >
                    <img 
                      src={item.images?.[0] || item.image} 
                      alt={item.name} 
                      className="w-12 h-14 object-cover rounded-lg border border-neutral-200 group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100/60 px-1 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h5 className="text-[11px] font-bold text-neutral-900 truncate mt-0.5 group-hover:text-amber-600 transition">
                        {item.name}
                      </h5>
                      <span className="text-xs font-black text-neutral-950 block mt-0.5">
                        {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
