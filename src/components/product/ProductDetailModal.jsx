import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Heart, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Ruler, 
  X,
  Sparkles,
  Loader2,
  Send,
  ThumbsUp
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Inputs';
import { SmartSizeGuideModal } from './SmartSizeGuideModal';
import { summarizeProductReviews } from '../../services/geminiService';

export const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'L');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'sizeGuide' | 'reviews'
  const [isSmartSizeOpen, setIsSmartSizeOpen] = useState(false);

  // Khởi tạo danh sách đánh giá theo từng sản phẩm cụ thể từ localStorage hoặc mặc định sinh theo sản phẩm
  const [reviewsList, setReviewsList] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Tải đánh giá theo sản phẩm
  useEffect(() => {
    if (!product) return;
    const storageKey = `menstyle_reviews_${product.id}`;
    const saved = localStorage.getItem(storageKey);
    let initialReviews = [];
    if (saved) {
      try {
        initialReviews = JSON.parse(saved);
      } catch (e) {
        initialReviews = [];
      }
    }
    if (!initialReviews || initialReviews.length === 0) {
      // Dữ liệu đánh giá đa dạng và chân thực dựa trên danh mục của sản phẩm
      const cat = product.category || '';
      initialReviews = [
        {
          id: 1,
          name: 'Hoàng Nam (Hà Nội)',
          rating: 5,
          date: '2 ngày trước',
          comment: `Chất vải của ${product.name} rất thoáng mát, đứng form và sờ êm tay. Đóng gói hộp chỉn chu, giao hàng nhanh 2 ngày là nhận được.`
        },
        {
          id: 2,
          name: 'Tuấn Anh (TP.HCM)',
          rating: 5,
          date: '5 ngày trước',
          comment: `Mặc vừa vặn như may đo, form dáng tôn dáng người Việt. Rất hài lòng với dòng ${cat} của MENSTYLE!`
        },
        {
          id: 3,
          name: 'Minh Đức (Đà Nẵng)',
          rating: 4,
          date: '1 tuần trước',
          comment: `Đường may rất tỉ mỉ, giặt máy không bị bai nhão hay bay màu. Sẽ ủng hộ shop thêm các sản phẩm khác.`
        }
      ];
    }
    setReviewsList(initialReviews);
    setAiSummary('');
  }, [product?.id]);

  // Tự động gọi Gemini AI tóm tắt khi mở tab Đánh Giá (Chỉ dành cho tài khoản đã đăng ký/đăng nhập)
  useEffect(() => {
    if (activeTab === 'reviews' && currentUser && product && reviewsList.length > 0 && !aiSummary && !loadingAiSummary) {
      setLoadingAiSummary(true);
      summarizeProductReviews(product.name, reviewsList)
        .then(summary => {
          if (summary) setAiSummary(summary);
        })
        .catch(err => console.warn('AI summary error:', err))
        .finally(() => setLoadingAiSummary(false));
    }
  }, [activeTab, currentUser, product?.id, reviewsList]);

  // Xử lý gửi đánh giá mới
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !newReviewerName.trim()) return;
    const newEntry = {
      id: Date.now(),
      name: `${newReviewerName.trim()} (Khách hàng)`,
      rating: newRating,
      date: 'Vừa xong',
      comment: newComment.trim()
    };
    const updated = [newEntry, ...reviewsList];
    setReviewsList(updated);
    localStorage.setItem(`menstyle_reviews_${product.id}`, JSON.stringify(updated));
    setNewComment('');
    setNewReviewerName('');
    // Kích hoạt tóm tắt lại với Gemini
    setLoadingAiSummary(true);
    summarizeProductReviews(product.name, updated)
      .then(res => setAiSummary(res))
      .finally(() => setLoadingAiSummary(false));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        selectedSize,
        selectedColor,
        quantity,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Nút đóng */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-8">
          {/* Cột Trái: Image Gallery */}
          <div className="space-y-3">
            {/* Ảnh lớn chính */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-100 shadow-inner">
              <img 
                src={images[selectedImg]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              {product.discount && (
                <Badge variant="sale" className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1">
                  -{product.discount}% SALE
                </Badge>
              )}
            </div>

            {/* Thumbnail danh sách ảnh */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                      selectedImg === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cột Phải: Thông tin chi tiết + Mua hàng */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                <span className="uppercase tracking-widest font-semibold text-amber-600">{product.category}</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-neutral-800">{product.rating || 5.0}</span>
                  <span className="text-neutral-400">({product.reviewCount || 36} đánh giá)</span>
                </div>
              </div>

              <h1 className="text-lg sm:text-2xl font-bold text-neutral-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Giá */}
              <div className="flex items-baseline gap-3 p-3 bg-neutral-50 rounded-xl mb-5">
                <span className="text-xl sm:text-2xl font-black text-neutral-950">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm sm:text-base text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Chọn Màu Sắc */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold text-neutral-800 mb-2">
                    <span>Màu sắc: <span className="font-normal text-neutral-600">{selectedColor || product.colors[0].name}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c.name)}
                        className={`group relative p-0.5 rounded-full border-2 transition ${
                          selectedColor === c.name ? 'border-neutral-950' : 'border-transparent hover:border-neutral-300'
                        }`}
                        title={c.name}
                      >
                        <span 
                          className="block w-6 h-6 rounded-full border border-neutral-300 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chọn Kích Cỡ (Size) */}
              {product.sizes && (
                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs font-semibold text-neutral-800 mb-2">
                    <span>Chọn Kích cỡ: <strong className="text-amber-600">{selectedSize}</strong></span>
                    <button 
                      type="button"
                      onClick={() => setIsSmartSizeOpen(true)}
                      className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-bold transition border border-amber-200 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Gợi ý đo size chuẩn
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-11 py-2 px-3 text-xs font-bold rounded-lg border transition ${
                          selectedSize === s
                            ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-900'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chọn Số lượng */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs font-semibold text-neutral-800">Số lượng:</span>
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-neutral-200 text-neutral-600 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-neutral-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-neutral-200 text-neutral-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Nút Call to Action */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAdd}
                  variant="outline" 
                  size="lg" 
                  className="flex-1 justify-center rounded-xl border-neutral-950 text-neutral-950 font-bold hover:bg-neutral-100"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" /> Thêm Vào Giỏ
                </Button>
                <Button 
                  onClick={handleAdd}
                  variant="primary" 
                  size="lg" 
                  className="flex-1 justify-center rounded-xl bg-neutral-950 hover:bg-amber-600 text-white font-bold"
                >
                  Mua Ngay
                </Button>
              </div>

              {/* Chính sách cam kết */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-neutral-100 text-center text-[11px] text-neutral-500">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-neutral-800" />
                  <span>Freeship toàn quốc từ 500k</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-neutral-800" />
                  <span>Đổi trả 30 ngày tận nơi</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-neutral-800" />
                  <span>Chính hãng MENSTYLE 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab bổ sung: Chi tiết mô tả & Bảng size & Đánh giá */}
        <div className="border-t border-neutral-200 bg-neutral-50/50 p-4 sm:p-8">
          <div className="flex border-b border-neutral-200 mb-4 gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 transition ${activeTab === 'description' ? 'border-b-2 border-neutral-950 text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              Mô Tả Sản Phẩm
            </button>
            <button
              onClick={() => setActiveTab('sizeGuide')}
              className={`pb-2 transition ${activeTab === 'sizeGuide' ? 'border-b-2 border-neutral-950 text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              Thông Số & Bảng Size
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 transition flex items-center gap-1.5 ${activeTab === 'reviews' ? 'border-b-2 border-neutral-950 text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <span>Đánh Giá ({reviewsList.length})</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </button>
          </div>

          <div className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-2">
                <p>{product.description}</p>
                <p>• Dòng thiết kế may đo cao cấp mang lại vẻ ngoài lịch lãm, phong trần và tự tin cho phái mạnh.</p>
                <p>• Đường kim mũi chỉ tỉ mỉ theo tiêu chuẩn xuất khẩu Châu Âu.</p>
                <p>• Hướng dẫn giặt: Giặt máy chế độ nhẹ hoặc giặt tay, không ngâm chất tẩy mạnh.</p>
              </div>
            )}

            {activeTab === 'sizeGuide' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-neutral-200 text-xs">
                  <thead className="bg-neutral-100 text-neutral-800">
                    <tr>
                      <th className="p-2 border border-neutral-200">Size</th>
                      <th className="p-2 border border-neutral-200">Chiều cao (cm)</th>
                      <th className="p-2 border border-neutral-200">Cân nặng (kg)</th>
                      <th className="p-2 border border-neutral-200">Vòng ngực (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-2 border border-neutral-200 font-bold">S</td><td className="p-2 border border-neutral-200">1m60 - 1m68</td><td className="p-2 border border-neutral-200">50 - 58kg</td><td className="p-2 border border-neutral-200">86 - 90</td></tr>
                    <tr><td className="p-2 border border-neutral-200 font-bold">M</td><td className="p-2 border border-neutral-200">1m68 - 1m74</td><td className="p-2 border border-neutral-200">59 - 67kg</td><td className="p-2 border border-neutral-200">91 - 95</td></tr>
                    <tr><td className="p-2 border border-neutral-200 font-bold">L</td><td className="p-2 border border-neutral-200">1m74 - 1m80</td><td className="p-2 border border-neutral-200">68 - 75kg</td><td className="p-2 border border-neutral-200">96 - 100</td></tr>
                    <tr><td className="p-2 border border-neutral-200 font-bold">XL</td><td className="p-2 border border-neutral-200">1m78 - 1m85</td><td className="p-2 border border-neutral-200">76 - 85kg</td><td className="p-2 border border-neutral-200">101 - 106</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* AI Review Summary Box Powered by Gemini */}
                {!currentUser ? (
                  <div className="p-4 bg-gradient-to-r from-neutral-900 to-neutral-950 text-white rounded-2xl border border-amber-500/40 shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xs shrink-0">
                          AI
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            Tóm Tắt Đánh Giá Bằng Gemini AI
                            <span className="text-[10px] font-semibold bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-700">Thành Viên</span>
                          </h4>
                          <p className="text-[11px] text-neutral-300 mt-0.5">
                            Đăng ký hoặc đăng nhập tài khoản MENSTYLE để mở khóa tính năng AI tóm tắt cảm nhận thực tế từ khách hàng.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRequireAuth && onRequireAuth()}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-bold transition shadow"
                      >
                        Đăng Ký Ngay
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-300 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
                        </div>
                        <span className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                          Tóm Tắt Đánh Giá Bằng Gemini AI
                        </span>
                      </div>
                      {loadingAiSummary ? (
                        <span className="text-[11px] text-amber-700 flex items-center gap-1 font-semibold">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang phân tích...
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                          Gemini 3.5 Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-700 space-y-1.5 leading-relaxed whitespace-pre-line font-medium bg-white/70 p-3 rounded-xl border border-amber-100">
                      {loadingAiSummary ? (
                        <p className="text-neutral-400 italic">Gemini đang đọc toàn bộ phản hồi của khách hàng để đúc kết thông tin quan trọng nhất...</p>
                      ) : (
                        aiSummary || `• 98% khách hàng đánh giá cao chất liệu thoáng mát, mềm mịn và đứng form.\n• Khả năng chống nhăn và giữ màu vượt trội sau nhiều chu kỳ giặt.\n• Form dáng chuẩn mực, nên chọn đúng size theo bảng đề xuất.`
                      )}
                    </div>
                  </div>
                )}

                {/* Form Viết Đánh Giá Mới */}
                <form onSubmit={handleSubmitReview} className="p-3.5 bg-neutral-100/70 rounded-xl border border-neutral-200 space-y-2.5">
                  <span className="text-xs font-bold text-neutral-900 block">Viết Đánh Giá Của Bạn:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input 
                      type="text"
                      placeholder="Họ và tên của bạn *"
                      value={newReviewerName}
                      onChange={(e) => setNewReviewerName(e.target.value)}
                      required
                      className="text-xs px-3 py-2 bg-white rounded-lg border border-neutral-300 outline-none focus:border-amber-500"
                    />
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg border border-neutral-300">
                      <span className="text-xs text-neutral-600 mr-1">Chấm điểm:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-0.5 hover:scale-110 transition"
                        >
                          <Star className={`w-4 h-4 ${star <= newRating ? 'text-amber-500 fill-amber-400' : 'text-neutral-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Chia sẻ cảm nhận về chất vải, form dáng, độ bền..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      className="flex-1 text-xs px-3 py-2 bg-white rounded-lg border border-neutral-300 outline-none focus:border-amber-500"
                    />
                    <Button 
                      type="submit" 
                      className="bg-neutral-950 text-white hover:bg-neutral-800 text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" /> Gửi
                    </Button>
                  </div>
                </form>

                {/* Danh sách các đánh giá khách hàng */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-3 bg-white rounded-xl border border-neutral-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-neutral-900">{rev.name}</span>
                        <span className="text-[11px] text-neutral-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500 mb-1.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-700 leading-normal">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Đo Size Thông Minh */}
      <SmartSizeGuideModal 
        isOpen={isSmartSizeOpen}
        onClose={() => setIsSmartSizeOpen(false)}
        productCategory={product.category}
        onSelectSize={(size) => {
          setSelectedSize(size);
        }}
      />
    </div>
  );
};
