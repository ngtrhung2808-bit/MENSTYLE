import React from 'react';
import { PackageSearch, ShoppingBag, SearchX } from 'lucide-react';
import { Button } from './Button';

// 1. Skeleton Card Sản Phẩm (Dùng khi đang tải dữ liệu)
export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl p-3 border border-neutral-100 animate-pulse">
      <div className="aspect-[3/4] w-full rounded-xl bg-neutral-200 mb-3" />
      <div className="h-3 w-1/3 bg-neutral-200 rounded mb-2" />
      <div className="h-4 w-5/6 bg-neutral-200 rounded mb-3" />
      <div className="h-4 w-1/2 bg-neutral-200 rounded mt-auto" />
    </div>
  );
};

// 2. Skeleton Grid
export const ProductGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

// 3. Empty State (Không tìm thấy sản phẩm hoặc Giỏ hàng trống)
export const EmptyState = ({ 
  icon: Icon = SearchX, 
  title = 'Không tìm thấy kết quả', 
  description = 'Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc của bạn.', 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-neutral-200/80 my-4">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm" className="rounded-xl font-bold px-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
