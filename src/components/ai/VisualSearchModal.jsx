import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Loader2, X, ArrowRight, ShoppingBag, Sliders, Check, UserCheck } from 'lucide-react';
import { Button } from '../common/Button';

// Danh sách Size và Màu cơ bản của MENSTYLE
const PREFILTER_SIZES = ['S', 'M', 'L', 'XL'];
const PREFILTER_COLORS = [
  { name: 'Đen Sang Trọng', hex: '#1c1917' },
  { name: 'Trắng Thanh Lịch', hex: '#ffffff' },
  { name: 'Xanh Navy Lịch Lãm', hex: '#1e3a8a' },
  { name: 'Be / Khaki Trang Nhã', hex: '#d4b996' },
  { name: 'Ghi Xám Tinh Tế', hex: '#64748b' }
];

export const VisualSearchModal = ({ isOpen, onClose, products = [], onSelectProduct }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectedAnalysis, setDetectedAnalysis] = useState(null);
  const [matchedResults, setMatchedResults] = useState([]);
  
  // Tiền lọc AI: Màu sắc & Size mong muốn
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Vui lòng chọn ảnh dung lượng dưới 10MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        performAiBodyAnalysis(reader.result, selectedColor, selectedSize);
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm AI phân tích vóc dáng/ảnh thực tế và lọc sản phẩm theo Màu & Size
  const performAiBodyAnalysis = async (base64, colorFilter, sizeFilter) => {
    setLoading(true);
    setMatchedResults([]);
    setDetectedAnalysis(null);

    try {
      // Giả lập hoặc gọi Gemini Vision phân tích vóc dáng và phong cách
      await new Promise(resolve => setTimeout(resolve, 1400));

      const analysisSummary = {
        bodyFit: 'Vóc dáng cân đối, phong thái đĩnh đạc nam tính',
        suggestedStyle: 'Smart Casual / Quý Ông Công Sở',
        advice: 'Tôn dáng với form Slim-fit hoặc Regular gọn gàng, tôn chiều cao và độ rộng vai.',
      };
      setDetectedAnalysis(analysisSummary);

      // TIỀN LỌC SẢN PHẨM: CHỈ LẤY THEO MÀU & SIZE
      let pool = [...products];

      if (sizeFilter) {
        pool = pool.filter(p => {
          if (!p.sizes || !Array.isArray(p.sizes)) return true;
          return p.sizes.includes(sizeFilter);
        });
      }

      if (colorFilter) {
        pool = pool.filter(p => {
          if (!p.colors || !Array.isArray(p.colors)) return true;
          return p.colors.some(c => {
            const cName = typeof c === 'string' ? c : (c.name || '');
            return cName.toLowerCase().includes(colorFilter.toLowerCase()) || 
                   colorFilter.toLowerCase().includes(cName.toLowerCase());
          });
        });
      }

      // Lấy 4 - 6 sản phẩm phù hợp nhất sau khi lọc
      const suggestions = pool.slice(0, 6);
      setMatchedResults(suggestions);
    } catch (err) {
      console.error('Lỗi phân tích AI Vision:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReFilter = (newColor, newSize) => {
    setSelectedColor(newColor);
    setSelectedSize(newSize);
    if (previewImage) {
      performAiBodyAnalysis(previewImage, newColor, newSize);
    }
  };

  // Mẫu ảnh thực tế thử nghiệm nhanh
  const sampleImages = [
    { label: 'Ảnh Khách Hàng 1 (Vóc dáng công sở)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop' },
    { label: 'Ảnh Khách Hàng 2 (Phong cách trẻ trung)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop' },
    { label: 'Ảnh Khách Hàng 3 (Dạ tiệc sang trọng)', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Camera className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-neutral-950 flex items-center gap-2">
                AI Tư Vấn Quần Áo Theo Ảnh Thực Tế
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                  AI Fashion Vision
                </span>
              </h3>
              <p className="text-xs text-neutral-500">Tải ảnh chụp thực tế của bạn để AI phân tích vóc dáng và gợi ý quần áo phù hợp</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-sm font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Khối Tiền Lọc AI (CHỈ LẤY THEO MÀU & SIZE) */}
        <div className="my-3.5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-600" /> Tiền Lọc AI: Chỉ Lấy Theo Màu & Size
            </span>
            {(selectedColor || selectedSize) && (
              <button 
                onClick={() => handleReFilter('', '')}
                className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Xóa tiền lọc
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Lọc Size */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1.5">Kích Cỡ Ưu Tiên (Size):</label>
              <div className="flex gap-1.5">
                {PREFILTER_SIZES.map(sz => (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => handleReFilter(selectedColor, selectedSize === sz ? '' : sz)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-neutral-950 border-neutral-950 text-white shadow-xs'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Lọc Màu Sắc */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1.5">Gam Màu Yêu Thích:</label>
              <div className="flex gap-1.5 flex-wrap">
                {PREFILTER_COLORS.map(c => {
                  const isChosen = selectedColor === c.name;
                  return (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => handleReFilter(isChosen ? '' : c.name, selectedSize)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                        isChosen
                          ? 'bg-amber-500 border-amber-600 text-neutral-950 shadow-xs'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Box Ảnh Thực Tế Của Khách Hàng */}
        <div className="space-y-4">
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
              className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/20 hover:bg-amber-50/40 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition group"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-neutral-900">
                Nhấp để tải ảnh thực tế của bạn lên (Chụp toàn thân hoặc nửa người)
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Hỗ trợ JPG, PNG, ảnh chụp camera điện thoại hoặc máy tính</p>
            </div>
          ) : (
            <div className="flex items-center gap-3.5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
              <img 
                src={previewImage} 
                alt="Ảnh khách hàng" 
                className="w-16 h-20 object-cover rounded-xl border border-neutral-300 shadow-xs shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider mb-1">
                  ✓ Ảnh Đã Tải Lên Thành Công
                </span>
                <p className="text-xs font-bold text-neutral-900">
                  {detectedAnalysis?.suggestedStyle || 'AI đang phân tích vóc dáng và màu sắc...'}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
                  >
                    Chọn ảnh khác
                  </button>
                  <button
                    onClick={() => performAiBodyAnalysis(previewImage, selectedColor, selectedSize)}
                    className="text-[11px] font-bold text-neutral-700 hover:text-black hover:underline cursor-pointer"
                  >
                    Phân tích lại
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mẫu ảnh thử nghiệm nhanh nếu khách hàng chưa có ảnh */}
          {!previewImage && (
            <div>
              <span className="text-[11px] font-bold text-neutral-600 mb-2 block">
                Hoặc thử nhanh với ảnh mẫu thực tế:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPreviewImage(s.url);
                      performAiBodyAnalysis(s.url, selectedColor, selectedSize);
                    }}
                    className="p-2 rounded-xl border border-neutral-200 hover:border-neutral-950 bg-white text-left transition flex items-center gap-2 cursor-pointer"
                  >
                    <img src={s.url} alt={s.label} className="w-9 h-11 object-cover rounded-lg shrink-0" />
                    <span className="text-[10px] font-bold text-neutral-800 line-clamp-2">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trạng thái Loading */}
          {loading && (
            <div className="p-6 text-center bg-amber-50/50 rounded-2xl border border-amber-200">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-900">AI Fashion Vision đang quét vóc dáng và áp dụng bộ tiền lọc màu/size...</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Tiền lọc: {selectedSize ? `Size ${selectedSize}` : 'Mọi Size'} • {selectedColor ? `Màu ${selectedColor}` : 'Mọi Màu'}</p>
            </div>
          )}

          {/* Bảng Đánh Giá & Nhận Định Từ AI */}
          {detectedAnalysis && !loading && (
            <div className="p-3.5 bg-gradient-to-r from-neutral-950 to-neutral-900 text-white rounded-2xl text-xs space-y-1.5 shadow-md">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 fill-amber-400" /> Nhận Định Vóc Dáng & Phong Cách Của Bạn
              </div>
              <p className="text-neutral-200 text-xs font-medium">
                • <strong>Vóc dáng:</strong> {detectedAnalysis.bodyFit}
              </p>
              <p className="text-neutral-200 text-xs font-medium">
                • <strong>Lời khuyên:</strong> {detectedAnalysis.advice}
              </p>
            </div>
          )}

          {/* Kết quả gợi ý quần áo phù hợp */}
          {matchedResults.length > 0 && !loading && (
            <div className="space-y-2.5 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" /> Trang Phục MENSTYLE Phù Hợp Nhất Với Bạn:
                </span>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {matchedResults.length} gợi ý tối ưu
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {matchedResults.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(item);
                      onClose();
                    }}
                    className="p-2.5 bg-neutral-50 hover:bg-amber-50/40 rounded-xl border border-neutral-200 hover:border-amber-400 cursor-pointer transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-200 mb-2">
                        <img 
                          src={item.images?.[0] || item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1 left-1 text-[9px] font-bold text-neutral-900 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs">
                          {item.category}
                        </span>
                      </div>
                      <h5 className="text-[11px] font-bold text-neutral-900 line-clamp-2 group-hover:text-amber-600 transition">
                        {item.name}
                      </h5>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-neutral-200/60 flex items-center justify-between">
                      <span className="text-xs font-black text-neutral-950">
                        {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        Xem chi tiết
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedResults.length === 0 && !loading && previewImage && (
            <div className="p-6 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
              Không tìm thấy sản phẩm nào khớp với màu "{selectedColor}" và size "{selectedSize}". Hãy thử bỏ bớt điều kiện tiền lọc!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
