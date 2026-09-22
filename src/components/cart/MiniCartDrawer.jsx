import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const MiniCartDrawer = ({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout 
}) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeshipProgress = Math.min(100, (totalPrice / 500000) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop mờ */}
      <div 
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header Giỏ Hàng */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-950" />
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                Giỏ Hàng Của Bạn <span className="text-xs text-neutral-500 font-normal">({cartItems.length} món)</span>
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Thanh Tiến Trình Freeship */}
          <div className="bg-amber-50/60 border-b border-amber-100 px-4 py-2.5 text-xs text-neutral-700">
            {totalPrice >= 500000 ? (
              <p className="font-semibold text-emerald-600 flex items-center gap-1.5">
                🎉 Bạn đã đủ điều kiện nhận <strong>Miễn Phí Vận Chuyển</strong>!
              </p>
            ) : (
              <p>
                Mua thêm <strong>{formatPrice(500000 - totalPrice)}</strong> để được <strong>FREESHIP</strong>!
              </p>
            )}
            <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeshipProgress}%` }}
              />
            </div>
          </div>

          {/* Danh Sách Món Hàng */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-neutral-800">Giỏ hàng của bạn đang trống</p>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Hãy khám phá bộ sưu tập phong cách quý ông và chọn cho mình trang phục ưng ý!
                </p>
                <Button 
                  onClick={onClose}
                  variant="outline" 
                  size="sm" 
                  className="rounded-full mt-2 font-bold"
                >
                  Mua Sắm Ngay
                </Button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemImg = item.images?.[0] || item.image;
                return (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="py-4 flex gap-3.5">
                    {/* Ảnh sản phẩm */}
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                      <img src={itemImg} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Thông tin */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <button 
                            onClick={() => onRemoveItem(item)}
                            className="text-neutral-400 hover:text-rose-600 transition p-1"
                            title="Xóa món này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Variant Tags */}
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                          {item.selectedSize && (
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded font-medium">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="bg-neutral-100 px-1.5 py-0.5 rounded font-medium truncate max-w-[120px]">
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Giá & Bộ Tăng Giảm Số Lượng */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs sm:text-sm font-bold text-neutral-950">
                          {formatPrice(item.price)}
                        </span>

                        <div className="flex items-center border border-neutral-200 rounded-md bg-white">
                          <button 
                            onClick={() => onUpdateQuantity(item, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-neutral-500 hover:bg-neutral-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-neutral-800">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                            className="px-2 py-1 text-neutral-500 hover:bg-neutral-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Tạm Tính & Nút Thanh Toán */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Tạm tính:</span>
                <span className="text-base sm:text-lg font-black text-neutral-950">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                * Phí vận chuyển và mã giảm giá sẽ được tính ở bước thanh toán.
              </p>
              <Button 
                onClick={onCheckout}
                className="w-full justify-center bg-neutral-950 hover:bg-amber-600 text-white py-3 rounded-xl font-bold text-sm shadow-md transition"
              >
                Tiến Hành Thanh Toán <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
