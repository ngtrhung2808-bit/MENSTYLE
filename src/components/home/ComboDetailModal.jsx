import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, Sparkles, Tag, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const ComboDetailModal = ({ isOpen, onClose, combo, products = [], onAddMultipleToCart }) => {
  if (!isOpen || !combo) return null;

  const [added, setAdded] = useState(false);

  // Lấy các sản phẩm thực tế trong kho theo itemIds của Combo
  const comboProducts = (combo.itemIds || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  // State lưu size và màu được chọn cho từng sản phẩm trong combo
  // Format: { [productId]: { size: 'L', color: 'Trắng Thanh Lịch' } }
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    if (comboProducts.length > 0) {
      const initial = {};
      comboProducts.forEach(prod => {
        initial[prod.id] = {
          size: prod.sizes?.[0] || 'L',
          color: prod.colors?.[0]?.name || ''
        };
      });
      setSelectedVariants(initial);
    }
  }, [combo]);

  const handleSelectSize = (productId, size) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        size
      }
    }));
  };

  const handleSelectColor = (productId, colorName) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        color: colorName
      }
    }));
  };

  const subTotal = comboProducts.reduce((sum, p) => sum + p.price, 0);
  const discountAmount = combo.discountAmount || 150000;
  const comboFinalPrice = Math.max(0, subTotal - discountAmount);

  const handleAddToCart = () => {
    if (onAddMultipleToCart && comboProducts.length > 0) {
      // Đóng gói sản phẩm kèm size & color đã chọn
      const itemsToAdd = comboProducts.map(prod => {
        const variant = selectedVariants[prod.id] || {};
        return {
          ...prod,
          selectedSize: variant.size || prod.sizes?.[0] || 'L',
          selectedColor: variant.color || prod.colors?.[0]?.name || ''
        };
      });

      onAddMultipleToCart(itemsToAdd);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-neutral-950 px-2 py-0.5 rounded-full">
                  {combo.saveText || 'Combo Ưu Đãi'}
                </span>
                <span className="text-xs text-neutral-500">Tùy chọn Size & Màu cho từng món</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-950 mt-0.5">
                {combo.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Danh sách từng món trong combo kèm bộ chọn Size & Màu */}
        <div className="py-4 space-y-4 max-h-[62vh] overflow-y-auto pr-1">
          <p className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-2xl border border-neutral-200 font-medium">
            <span className="font-bold text-neutral-800">Thành phần set: </span>
            {combo.desc}
          </p>

          <div className="space-y-3">
            {comboProducts.map((prod) => {
              const currentVariant = selectedVariants[prod.id] || {
                size: prod.sizes?.[0] || 'L',
                color: prod.colors?.[0]?.name || ''
              };

              // Tìm ảnh tương ứng nếu chọn màu
              const colorObj = prod.colors?.find(c => c.name === currentVariant.color);

              return (
                <div
                  key={prod.id}
                  className="p-3.5 rounded-2xl border border-neutral-200 bg-white hover:border-amber-400 transition-all shadow-sm"
                >
                  <div className="flex gap-3.5 items-start">
                    <img
                      src={prod.images?.[0] || prod.image}
                      alt={prod.name}
                      className="w-20 h-24 object-cover rounded-xl border border-neutral-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {prod.category}
                        </span>
                        <span className="text-xs font-black text-neutral-950">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mt-1 line-clamp-1">
                        {prod.name}
                      </h4>

                      {/* Chọn Màu Sắc */}
                      {prod.colors && prod.colors.length > 0 && (
                        <div className="mt-2.5">
                          <span className="text-[11px] font-bold text-neutral-600 block mb-1">
                            Màu sắc: <span className="text-amber-700 font-semibold">{currentVariant.color}</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {prod.colors.map((c) => {
                              const isSelected = currentVariant.color === c.name;
                              return (
                                <button
                                  key={c.name}
                                  type="button"
                                  onClick={() => handleSelectColor(prod.id, c.name)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                                    isSelected
                                      ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300'
                                  }`}
                                >
                                  {c.hex && (
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-white/40"
                                      style={{ backgroundColor: c.hex }}
                                    />
                                  )}
                                  <span>{c.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Chọn Size (nếu có size) */}
                      {prod.sizes && prod.sizes.length > 0 && (
                        <div className="mt-2.5">
                          <span className="text-[11px] font-bold text-neutral-600 block mb-1">
                            Kích cỡ (Size): <span className="text-amber-700 font-semibold">{currentVariant.size}</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {prod.sizes.map((sz) => {
                              const isSelected = currentVariant.size === sz;
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => handleSelectSize(prod.id, sz)}
                                  className={`min-w-8 py-0.5 px-2 text-center rounded-lg text-xs font-bold border transition cursor-pointer ${
                                    isSelected
                                      ? 'border-amber-500 bg-amber-500 text-neutral-950 shadow-sm'
                                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bảng tính giá Combo */}
          <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-2 mt-4">
            <div className="flex justify-between text-xs text-neutral-300">
              <span>Tổng giá mua lẻ các món:</span>
              <span className="line-through">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subTotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-amber-400 font-bold">
              <span>Ưu đãi mua cả set (Giảm trực tiếp):</span>
              <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-neutral-400 block">Giá trọn bộ Combo:</span>
                <span className="text-xl font-black text-amber-400">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(comboFinalPrice)}
                </span>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={added}
                className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-lg ${
                  added ? 'bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-neutral-950'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Đã Thêm Cả Combo Vào Giỏ!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Mua Ngay Nguyên Set Này
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
