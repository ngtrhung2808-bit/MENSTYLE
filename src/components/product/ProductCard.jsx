import React from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { Badge } from '../common/Inputs';

export const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl p-3 border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-lg">
      {/* Thumbnail + Action Icons */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge Giảm giá / Tag */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.discount && (
            <Badge variant="sale">-{product.discount}%</Badge>
          )}
          {product.isNew && (
            <Badge variant="brand">Mới</Badge>
          )}
        </div>

        {/* Quick actions hover */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
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
          className="absolute inset-x-3 bottom-3 py-2 bg-neutral-900/90 backdrop-blur-sm hover:bg-neutral-950 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Thêm vào giỏ
        </button>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex flex-col flex-1">
        <span className="text-xs text-neutral-400 mb-1">{product.category}</span>
        <h3 className="text-sm font-semibold text-neutral-800 line-clamp-1 group-hover:text-brand-600 transition">
          {product.name}
        </h3>
        
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
