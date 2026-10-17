import React from 'react';
import { X, CheckCircle2, ArrowRight, Sparkles, Shield, Cpu, Wind, Droplets, ShoppingBag } from 'lucide-react';
import { Button } from '../common/Button';

export const FabricDetailModal = ({ 
  isOpen, 
  onClose, 
  fabric, 
  products = [],
  onSelectProduct,
  onExploreCategory
}) => {
  if (!isOpen || !fabric) return null;

  const Icon = fabric.icon || Sparkles;

  // Lọc các sản phẩm thực tế ứng dụng công nghệ chất vải này
  const appliedProducts = products.filter(p => {
    if (fabric.category && p.category === fabric.category) return true;
    if (fabric.id === 'thermo-lock' && (p.category.includes('Khoác') || p.category.includes('Blazer'))) return true;
    if (fabric.id === 'modal-silk' && p.category.includes('Sơ Mi')) return true;
    if (fabric.id === 'diamond-air' && p.category.includes('Polo')) return true;
    if (fabric.id === 'flex-stretch' && (p.category.includes('Quần') || p.name.includes('Quần'))) return true;
    return false;
  }).slice(0, 6);

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero Modal */}
        <div className="relative h-56 sm:h-64 overflow-hidden shrink-0">
          <img 
            src={fabric.image} 
            alt={fabric.name} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Icon className="w-3.5 h-3.5" /> Công nghệ chất liệu độc quyền
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                {fabric.name}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-amber-400 mt-0.5">
                {fabric.subtitle}
              </p>
            </div>
            
            <button
              onClick={() => {
                onClose();
                if (onExploreCategory) onExploreCategory(fabric.category);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
            >
              Xem toàn bộ danh mục {fabric.category} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Tuyên ngôn công năng */}
          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
              Đặc Tính & Nguyên Lý Vận Hành
            </h4>
            <p className="text-neutral-200 leading-relaxed font-medium">
              {fabric.tagline}
            </p>
          </div>

          {/* 4 Công năng kỹ thuật nổi bật */}
          <div>
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> 4 Công Năng Đột Phá Trên Sản Phẩm
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fabric.features.map((feat, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-neutral-800/50 border border-neutral-700/60 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-neutral-300 font-medium leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Danh mục sản phẩm ứng dụng */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" /> Sản Phẩm Tiêu Biểu Ứng Dụng ({appliedProducts.length} sản phẩm)
              </h4>
              <span className="text-[11px] text-neutral-400">
                Nhóm sản phẩm: <strong className="text-neutral-200">{fabric.category}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {appliedProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onClose();
                    if (onSelectProduct) onSelectProduct(prod);
                  }}
                  className="bg-neutral-950 rounded-xl p-2.5 border border-neutral-800 hover:border-amber-500/80 transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900 mb-2">
                    <img 
                      src={prod.images?.[0] || prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-neutral-950/80 backdrop-blur-xs text-amber-300 px-1.5 py-0.5 rounded border border-white/10">
                      Chất vải {fabric.name.split('™')[0]}
                    </span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-neutral-200 text-xs line-clamp-1 group-hover:text-amber-400 transition">
                      {prod.name}
                    </h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-amber-400 text-xs">{formatPrice(prod.price)}</span>
                      <span className="text-[10px] text-neutral-400 group-hover:text-white transition flex items-center gap-0.5">
                        Xem chi tiết <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hướng dẫn bảo quản */}
          <div className="p-3.5 rounded-xl bg-neutral-800/40 border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span><strong>Bảo quản đề xuất:</strong> {fabric.care}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
