import React from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { Badge } from '../common/Inputs';

export const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-lg">
      {/* Thumbnail + Action Icons */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg sm:rounded-xl bg-neutral-100 mb-2.5 sm:mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge Giảm giá */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount && (
            <Badge variant="sale" className="text-[10px] px-2 py-0.5">-{product.discount}%</Badge>
          )}
          {product.isNew && (
            <Badge variant="brand" className="text-[10px] px-2 py-0.5">Mới</Badge>
          )}
        </div>

        {/* Quick actions hover (chỉ hiện trên PC hover) */}
        <div className="hidden sm:flex absolute top-2 right-2 flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button 
            type="button" 
            aria-label="Thêm vào yêu thích" 
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center text-neutral-700 hover:text-rose-500 hover:bg-white transition"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            aria-label="Xem nhanh" 
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center text-neutral-700 hover:text-neutral-900 hover:bg-white transition"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Nút Thêm vào giỏ hàng nhanh */}
        <button 
          type="button" 
          className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 py-1.5 sm:py-2 bg-neutral-950/90 backdrop-blur-sm hover:bg-neutral-950 text-white text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 shadow"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate">Thêm vào giỏ</span>
        </button>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex flex-col flex-1 px-0.5">
        <span className="text-[10px] sm:text-xs text-neutral-400 mb-0.5 sm:mb-1 truncate">{product.category}</span>
        <h3 className="text-xs sm:text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug group-hover:text-amber-600 transition">
          {product.name}
        </h3>
        
        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
          <span className="text-xs sm:text-base font-bold text-neutral-950">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
