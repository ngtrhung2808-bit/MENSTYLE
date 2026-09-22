import React, { useState, useMemo } from 'react';
import { SidebarFilter } from './SidebarFilter';
import { ProductCard } from './ProductCard';
import { ArrowUpDown, SlidersHorizontal, Grid, ListFilter } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';

export const ProductListingPage = ({ onQuickView, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedSize, setSelectedSize] = useState('');
  const [priceRange, setPriceRange] = useState(2000000);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((item) => {
      // Filter Category
      if (selectedCategory !== 'Tất cả' && item.category !== selectedCategory) {
        return false;
      }
      // Filter Price
      if (item.price > priceRange) {
        return false;
      }
      // Filter Size
      if (selectedSize && item.sizes && !item.sizes.includes(selectedSize)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // featured
    });
  }, [selectedCategory, selectedSize, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('Tất cả');
    setSelectedSize('');
    setPriceRange(2000000);
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb & Tiêu đề trang */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span>Trang chủ</span>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">Thời Trang Quý Ông</span>
          {selectedCategory !== 'Tất cả' && (
            <>
              <span>/</span>
              <span className="text-amber-600 font-bold">{selectedCategory}</span>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950">
              Bộ Sưu Tập {selectedCategory === 'Tất cả' ? 'Đẳng Cấp Phái Mạnh' : selectedCategory}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Hiển thị <span className="font-bold text-neutral-900">{filteredProducts.length}</span> sản phẩm được chọn lọc kỹ lưỡng
            </p>
          </div>

          {/* Nút lọc nhanh cho Mobile */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 py-2 px-4 bg-neutral-950 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Bộ Lọc & Phân Loại</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout (Sidebar + Grid) */}
      <div className="flex gap-8 items-start">
        {/* Sidebar Bộ Lọc */}
        <SidebarFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(c) => { setSelectedCategory(c); setCurrentPage(1); }}
          selectedSize={selectedSize}
          onSelectSize={(s) => { setSelectedSize(s); setCurrentPage(1); }}
          priceRange={priceRange}
          onPriceChange={(p) => { setPriceRange(p); setCurrentPage(1); }}
          onResetFilters={handleResetFilters}
          isOpenMobile={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        {/* Cột Danh Sách Sản Phẩm */}
        <div className="flex-1 w-full">
          {/* Toolbar sắp xếp */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-neutral-200 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <ListFilter className="w-4 h-4 text-neutral-700" />
              <span>Sắp xếp theo:</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-50 text-xs sm:text-sm border border-neutral-300 rounded-lg px-3 py-1.5 font-medium outline-none focus:border-neutral-900 cursor-pointer"
              >
                <option value="featured">Nổi bật nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {/* Grid Sản Phẩm */}
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
              <p className="text-base font-semibold text-neutral-800">Không tìm thấy sản phẩm phù hợp!</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Hãy thử nới rộng khoảng giá hoặc chọn danh mục khác để xem thêm nhiều mẫu mã hơn.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-5 py-2 bg-neutral-950 text-amber-400 text-xs font-bold rounded-full hover:bg-neutral-800 transition"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}

          {/* Phân Trang (Pagination) */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 text-xs font-bold rounded-lg border transition ${
                    currentPage === page
                      ? 'bg-neutral-950 border-neutral-950 text-white shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-950'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
