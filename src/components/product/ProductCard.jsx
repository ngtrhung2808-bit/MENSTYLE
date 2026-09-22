import React, { useState } from 'react';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { Badge } from '../common/Inputs';

export const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-neutral-100 hover:border-neutral-300 transition-all duration-300 hover:shadow-xl">
      {/* Thumbnail + Action Icons */}
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden rounded-lg sm:rounded-xl bg-neutral-100 mb-3 cursor-pointer"
        onMouseEnter={() => images.length > 1 && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
        onClick={() => onQuickView && onQuickView(product)}
      >
        <img
          src={images[currentImageIndex] || images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge Giảm giá & Mới */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.discount && (
            <Badge variant="sale" className="text-[10px] px-2 py-0.5 font-bold shadow-sm">
              -{product.discount}%
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="brand" className="text-[10px] px-2 py-0.5 font-bold shadow-sm">
              Mới
            </Badge>
          )}
        </div>

        {/* Action Buttons (Wishlist & Quick View) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10 transition-all duration-300 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
          <button 
            type="button" 
            aria-label="Thêm vào yêu thích" 
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`w-8 h-8 rounded-full backdrop-blur-sm shadow flex items-center justify-center transition ${
              isLiked 
                ? 'bg-rose-50 text-rose-600' 
                : 'bg-white/90 text-neutral-700 hover:text-rose-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
          </button>
          
          <button 
            type="button" 
            aria-label="Xem nhanh" 
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center text-neutral-700 hover:text-neutral-950 hover:bg-white transition"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Nút Thêm vào giỏ hàng nhanh */}
        <button 
          type="button" 
          onClick={(e) => {
            e.stopPropagation();
            if (onAddToCart) onAddToCart(product);
          }}
          className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 py-2 bg-neutral-950 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300 shadow-md z-10"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Thêm vào giỏ</span>
        </button>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex flex-col flex-1 px-0.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider truncate">
            {product.category}
          </span>
          {product.rating && (
            <div className="flex items-center text-amber-500 text-[11px] font-semibold">
              <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        <h3 
          onClick={() => onQuickView && onQuickView(product)}
          className="text-xs sm:text-sm font-medium text-neutral-800 line-clamp-2 leading-snug group-hover:text-amber-600 transition cursor-pointer"
        >
          {product.name}
        </h3>
        
        {/* Colors indicator */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {product.colors.map((c, idx) => (
              <span 
                key={idx} 
                className="w-2.5 h-2.5 rounded-full border border-neutral-300 shadow-xs" 
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}

        {/* Giá */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold text-neutral-950">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] sm:text-xs text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
