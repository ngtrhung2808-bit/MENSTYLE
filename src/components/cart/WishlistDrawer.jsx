import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const WishlistDrawer = ({ 
  isOpen, 
  onClose, 
  wishlistItems = [], 
  onRemoveFromWishlist, 
  onAddToCart,
  onOpenProductDetail 
}) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-neutral-100 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-950 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold">Sản Phẩm Yêu Thích</h2>
                <p className="text-[11px] text-neutral-400">Đã lưu ({wishlistItems.length} sản phẩm)</p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">Chưa có sản phẩm yêu thích</h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Hãy bấm vào biểu tượng trái tim trên các sản phẩm bạn thích để lưu lại và mua sau nhé!
                </p>
                <Button 
                  onClick={onClose}
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl mt-2 text-xs"
                >
                  Khám phá thời trang ngay
                </Button>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-3.5 p-3 rounded-2xl border border-neutral-100 hover:border-neutral-300 transition bg-white shadow-2xs group"
                >
                  {/* Ảnh sản phẩm */}
                  <div 
                    onClick={() => {
                      if (onOpenProductDetail) onOpenProductDetail(item);
                      onClose();
                    }}
                    className="w-16 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 cursor-pointer"
                  >
                    <img 
                      src={item.image || item.thumbnail || (item.images && item.images[0])} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                  </div>

                  {/* Thông tin */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h4 
                        onClick={() => {
                          if (onOpenProductDetail) onOpenProductDetail(item);
                          onClose();
                        }}
                        className="text-xs font-bold text-neutral-900 truncate hover:text-amber-600 transition cursor-pointer"
                      >
                        {item.name}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs font-black text-neutral-950">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[10px] text-neutral-400 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-100">
                      <Button
                        onClick={() => {
                          if (onAddToCart) onAddToCart(item);
                          if (onRemoveFromWishlist) onRemoveFromWishlist(item.id);
                        }}
                        variant="primary"
                        size="sm"
                        className="flex-1 !py-1 text-[11px] rounded-lg bg-neutral-950 hover:bg-amber-600 text-white font-bold justify-center"
                      >
                        <ShoppingBag className="w-3 h-3 mr-1.5" /> Thêm giỏ hàng
                      </Button>

                      <button
                        onClick={() => onRemoveFromWishlist && onRemoveFromWishlist(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Xóa khỏi yêu thích"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Tự động lưu vào tài khoản của bạn</span>
              <button 
                onClick={onClose}
                className="font-bold text-neutral-950 hover:underline flex items-center gap-1"
              >
                Tiếp tục xem đồ <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
