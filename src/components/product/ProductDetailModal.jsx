import React, { useState } from 'react';
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
  X 
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Inputs';

export const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'L');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'sizeGuide' | 'reviews'

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
                      onClick={() => setActiveTab('sizeGuide')}
                      className="text-neutral-500 hover:text-neutral-950 flex items-center gap-1 text-[11px] underline"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Hướng dẫn chọn size
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
              className={`pb-2 transition ${activeTab === 'reviews' ? 'border-b-2 border-neutral-950 text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              Đánh Giá ({product.reviewCount || 42})
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
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-neutral-900">Hoàng Nam (Hà Nội)</span>
                    <span className="text-[11px] text-neutral-400">2 ngày trước</span>
                  </div>
                  <div className="flex text-amber-500 mb-1.5"><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /><Star className="w-3.5 h-3.5 fill-amber-400" /></div>
                  <p className="text-neutral-700">Chất vải cực đẹp, mặc lên vừa in form như may đo riêng. Đóng gói hộp rất sang trọng!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
