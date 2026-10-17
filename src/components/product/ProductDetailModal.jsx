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
  ThumbsUp,
  Camera,
  ImagePlus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Inputs';
import { SmartSizeGuideModal } from './SmartSizeGuideModal';

export const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, currentUser, onRequireLogin }) => {
  const rawImages = (product?.images && product.images.length > 0) ? product.images : [product?.image || '/images/product-fallback.avif'];
  const images = rawImages.filter(Boolean);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'L');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'sizeGuide' | 'reviews'
  const [isSmartSizeOpen, setIsSmartSizeOpen] = useState(false);

  // Khởi tạo danh sách đánh giá theo từng sản phẩm cụ thể từ localStorage
  const [reviewsList, setReviewsList] = useState([]);
  const [newReviewerName, setNewReviewerName] = useState(currentUser?.name || '');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Kiểm tra xem khách hàng hiện tại đã mua sản phẩm này chưa
  const [hasPurchased, setHasPurchased] = useState(false);

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
      const cat = product.category || '';
      initialReviews = [
        {
          id: 1,
          name: 'Hoàng Nam (Hà Nội)',
          rating: 5,
          date: '2 ngày trước',
          comment: `Chất vải của ${product.name} rất thoáng mát, đứng form và sờ êm tay. Đóng gói hộp chỉn chu, giao hàng nhanh 2 ngày là nhận được.`,
          images: [
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'
          ]
        },
        {
          id: 2,
          name: 'Tuấn Anh (TP.HCM)',
          rating: 5,
          date: '5 ngày trước',
          comment: `Mặc vừa vặn như may đo, form dáng tôn dáng người Việt. Rất hài lòng với dòng ${cat} của MENSTYLE!`,
          images: []
        },
        {
          id: 3,
          name: 'Minh Đức (Đà Nẵng)',
          rating: 5,
          date: '1 tuần trước',
          comment: `Đường may rất tỉ mỉ, giặt máy không bị bai nhão hay bay màu. Sẽ ủng hộ shop thêm các sản phẩm khác.`,
          images: []
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(initialReviews));
    }
    setReviewsList(initialReviews);
    setSelectedImg(0);
    setSelectedSize(product.sizes?.[0] || 'L');
    setSelectedColor(product.colors?.[0]?.name || '');
    setQuantity(1);
    setActiveTab('description');
    setReviewImages([]);
    setReviewError('');
    setReviewSuccess('');

    // Kiểm tra lịch sử đơn hàng trong localStorage
    try {
      const orders = JSON.parse(localStorage.getItem('menstyle_orders') || '[]');
      const userEmail = currentUser?.email?.toLowerCase();
      const userPhone = currentUser?.phone;

      // Tìm trong danh sách đơn hàng đã mua xem có chứa sản phẩm này không
      const purchased = orders.some(order => {
        const matchUser = !currentUser || (order.email && order.email.toLowerCase() === userEmail) || (order.phone && order.phone === userPhone);
        if (!matchUser) return false;
        
        // Kiểm tra trong giỏ hàng chi tiết của đơn
        if (Array.isArray(order.cartItems)) {
          return order.cartItems.some(item => item.id === product.id);
        }
        // Kiểm tra trong chuỗi tên sản phẩm
        if (typeof order.items === 'string') {
          return order.items.includes(product.name);
        }
        return false;
      });
      setHasPurchased(purchased);
    } catch (e) {
      setHasPurchased(false);
    }
  }, [product?.id, currentUser]);

  if (!isOpen || !product) return null;

  // Xử lý upload ảnh feedback của khách
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.slice(0, 3).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImages(prev => {
          if (prev.length >= 3) return prev;
          return [...prev, reader.result];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveReviewImg = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Xử lý gửi đánh giá mới (Bắt buộc đã mua hàng)
  const handleSubmitReview = (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!currentUser) {
      setReviewError('Vui lòng đăng nhập tài khoản để gửi đánh giá mua hàng.');
      if (onRequireLogin) onRequireLogin();
      return;
    }

    if (!hasPurchased) {
      setReviewError(`Hệ thống kiểm tra thấy tài khoản ${currentUser.name} chưa từng mua sản phẩm này. Chỉ quý khách đã mua hàng thực tế mới có thể gửi đánh giá.`);
      return;
    }

    if (!newComment.trim()) {
      setReviewError('Vui lòng nhập nội dung đánh giá của bạn.');
      return;
    }

    const newEntry = {
      id: Date.now(),
      name: `${currentUser.name || newReviewerName.trim() || 'Quý Ông Khách Hàng'}`,
      rating: newRating,
      date: 'Vừa xong',
      comment: newComment.trim(),
      images: reviewImages
    };

    const updated = [newEntry, ...reviewsList];
    setReviewsList(updated);
    localStorage.setItem(`menstyle_reviews_${product.id}`, JSON.stringify(updated));

    setNewComment('');
    setReviewImages([]);
    setReviewSuccess('Cảm ơn bạn! Đánh giá kèm hình ảnh thực tế của bạn đã được đăng thành công.');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAdd = () => {
    if (onAddToCart) {
      const selectedVariant = product.variants?.find((variant) => (
        String(variant.size) === String(selectedSize)
        && (variant.color?.name || variant.colorName || '') === selectedColor
        && variant.isActive !== false
      ));
      onAddToCart({
        ...product,
        price: Number(selectedVariant?.price ?? product.price),
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
                src={images[selectedImg] || images[0] || '/images/product-fallback.avif'}
                alt={product.name} 
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/images/product-fallback.avif';
                }}
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
                    <img
                      src={img}
                      alt={`${product.name} ảnh ${idx + 1}`}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = '/images/product-fallback.avif';
                      }}
                      className="w-full h-full object-cover"
                    />
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
                  <span className="font-bold text-neutral-800">
                    {reviewsList.length > 0 
                      ? (reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsList.length).toFixed(1)
                      : (product.rating || '5.0')}
                  </span>
                  <span className="text-neutral-400">({reviewsList.length} đánh giá)</span>
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
                {/* Thông báo điều kiện đánh giá hoặc Form Viết Đánh Giá Mới */}
                {!currentUser ? (
                  <div className="p-4 bg-neutral-100 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">
                          Chỉ khách hàng đã mua sản phẩm mới có thể gửi đánh giá
                        </span>
                        <p className="text-[11px] text-neutral-500">
                          Vui lòng đăng nhập bằng tài khoản đã đặt mua để đánh giá và đính kèm ảnh sản phẩm thực tế.
                        </p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      onClick={onRequireLogin}
                      size="sm"
                      className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl px-4 py-2 shrink-0 cursor-pointer"
                    >
                      Đăng Nhập Ngay
                    </Button>
                  </div>
                ) : !hasPurchased ? (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">
                        Tài khoản "{currentUser.name}" chưa mua sản phẩm này
                      </span>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Để đảm bảo tính xác thực 100% cho cộng đồng khách hàng MENSTYLE, chỉ những khách hàng đã mua sản phẩm và có đơn hàng trong hệ thống mới được để lại nhận xét và ảnh feedback.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-neutral-900">
                          Đánh giá từ khách đã mua: <strong className="text-amber-700">{currentUser.name}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-neutral-500 mr-1">Chấm điểm:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="p-0.5 hover:scale-110 transition cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${star <= newRating ? 'text-amber-500 fill-amber-400' : 'text-neutral-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea 
                      placeholder="Chia sẻ trải nghiệm thực tế của bạn về chất vải, độ co giãn, form dáng khi mặc, độ bền sau khi giặt..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      required
                      className="w-full text-xs p-3 bg-white rounded-xl border border-neutral-200 outline-none focus:border-neutral-900 resize-none"
                    />

                    {/* Đính kèm ảnh thực tế của khách */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-neutral-700 flex items-center gap-1.5 cursor-pointer">
                          <ImagePlus className="w-4 h-4 text-amber-600" />
                          <span>Thêm ảnh thực tế sản phẩm (Tối đa 3 ảnh):</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleImageUpload}
                            className="hidden" 
                          />
                        </label>
                        <span className="text-[10px] text-neutral-400">
                          {reviewImages.length}/3 ảnh
                        </span>
                      </div>

                      {/* Hiển thị thumbnail ảnh đã chọn */}
                      {reviewImages.length > 0 && (
                        <div className="flex gap-2">
                          {reviewImages.map((imgSrc, i) => (
                            <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 group">
                              <img src={imgSrc} alt="feedback" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveReviewImg(i)}
                                className="absolute top-1 right-1 w-4 h-4 bg-neutral-950/80 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-rose-600 transition"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {reviewError && (
                      <p className="text-xs text-rose-600 font-medium">{reviewError}</p>
                    )}
                    {reviewSuccess && (
                      <p className="text-xs text-emerald-600 font-medium">{reviewSuccess}</p>
                    )}

                    <div className="flex justify-end pt-1">
                      <Button 
                        type="submit" 
                        className="bg-neutral-950 text-white hover:bg-neutral-800 text-xs px-6 py-2.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" /> Đăng Đánh Giá
                      </Button>
                    </div>
                  </form>
                )}

                {/* Danh sách các đánh giá khách hàng thực tế */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-3.5 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-800 font-bold text-xs flex items-center justify-center">
                            {rev.name ? rev.name.charAt(0).toUpperCase() : 'K'}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-neutral-900 block leading-tight">{rev.name}</span>
                            <span className="text-[10px] text-emerald-600 font-medium">✓ Đã mua hàng tại MENSTYLE</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-neutral-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500 mb-2">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed mb-2.5">{rev.comment}</p>

                      {/* Ảnh feedback đính kèm */}
                      {rev.images && rev.images.length > 0 && (
                        <div className="flex gap-2 pt-1">
                          {rev.images.map((imgSrc, imgIndex) => (
                            <img 
                              key={imgIndex}
                              src={imgSrc} 
                              alt="Customer feedback" 
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-neutral-200 hover:scale-105 transition cursor-pointer"
                              onClick={() => window.open(imgSrc, '_blank')}
                            />
                          ))}
                        </div>
                      )}
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
