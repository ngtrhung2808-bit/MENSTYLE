import React, { useState } from 'react';
import { Filter, X, Check, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';
import { CATEGORIES, SIZES } from '../../data/mockProducts';

export const SidebarFilter = ({ 
  selectedCategory, 
  onSelectCategory, 
  selectedSize, 
  onSelectSize, 
  priceRange, 
  onPriceChange,
  onResetFilters,
  isOpenMobile,
  onCloseMobile
}) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    sizes: true,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  const filterContent = (
    <div className="space-y-6">
      {/* Header Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <span className="font-bold text-neutral-900 flex items-center gap-2 text-sm sm:text-base">
          <Filter className="w-4 h-4 text-amber-600" /> Bộ Lọc Tìm Kiếm
        </span>
        <button 
          onClick={onResetFilters}
          className="text-xs text-neutral-500 hover:text-amber-600 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" /> Thiết lập lại
        </button>
      </div>

      {/* 1. Danh Mục */}
      <div className="border-b border-neutral-100 pb-5">
        <button 
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full font-semibold text-neutral-900 text-sm mb-3"
        >
          <span>Danh Mục Nam</span>
          {openSections.categories ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
        </button>
        {openSections.categories && (
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left text-xs sm:text-sm py-1.5 px-3 rounded-lg flex items-center justify-between transition ${
                  selectedCategory === cat 
                    ? 'bg-neutral-900 text-amber-400 font-semibold shadow-xs' 
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
                }`}
              >
                <span>{cat}</span>
                {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Khoảng Giá */}
      <div className="border-b border-neutral-100 pb-5">
        <button 
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full font-semibold text-neutral-900 text-sm mb-3"
        >
          <span>Khoảng Giá</span>
          {openSections.price ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
        </button>
        {openSections.price && (
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 mb-2">
              <span>0đ</span>
              <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{formatPrice(priceRange)}</span>
            </div>
            <input 
              type="range" 
              min="200000" 
              max="2000000" 
              step="50000"
              value={priceRange}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="w-full accent-neutral-950 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1.5">
              <span>200.000đ</span>
              <span>2.000.000đ+</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Kích Thước (Size) */}
      <div className="border-b border-neutral-100 pb-5">
        <button 
          onClick={() => toggleSection('sizes')}
          className="flex items-center justify-between w-full font-semibold text-neutral-900 text-sm mb-3"
        >
          <span>Kích Cỡ (Size)</span>
          {openSections.sizes ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
        </button>
        {openSections.sizes && (
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((size) => {
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => onSelectSize(active ? '' : size)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                    active 
                      ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs' 
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Cam kết thương hiệu */}
      <div className="bg-neutral-100/70 p-3.5 rounded-xl text-xs space-y-1.5 text-neutral-600">
        <p className="font-semibold text-neutral-900">🛡️ Tiêu Chuẩn MENSTYLE</p>
        <p>• Đổi trả trong 30 ngày</p>
        <p>• Freeship đơn từ 500k</p>
        <p>• Kiểm tra hàng trước khi nhận</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-6 border-r border-neutral-200">
        {filterContent}
      </aside>

      {/* Mobile Drawer Filter */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
                <span className="font-bold text-neutral-950 text-base">Bộ Lọc</span>
                <button 
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
            </div>
            <div className="pt-4 border-t border-neutral-200 mt-6">
              <Button 
                onClick={onCloseMobile}
                className="w-full justify-center bg-neutral-950 text-white py-2.5 rounded-xl font-bold text-sm"
              >
                Áp Dụng Bộ Lọc
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
