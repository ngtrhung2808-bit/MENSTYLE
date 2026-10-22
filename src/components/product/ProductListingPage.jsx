import React, { useState, useMemo, useEffect } from 'react';
import { SidebarFilter } from './SidebarFilter';
import { ProductCard } from './ProductCard';
import { ArrowUpDown, SlidersHorizontal, Grid, ListFilter, Sparkles, Loader2, X, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { parseSemanticSearchWithAI } from '../../services/geminiService';
import { ProductGridSkeleton } from '../common/FeedbackStates';

export const ProductListingPage = ({ 
  products = [],
  loading = false,
  error = '',
  onRetry,
  onQuickView, 
  onAddToCart, 
  initialCategory = 'Tất cả', 
  onCategoryChange,
  searchQuery = '',
  wishlistIds = [],
  onToggleWishlist,
  currentUser,
  onRequireAuth
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState('');
  const [priceRange, setPriceRange] = useState(null);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const maxProductPrice = Math.max(2000000, ...products.map((product) => product.price || 0));
  const activePriceRange = priceRange ?? maxProductPrice;
  const categories = useMemo(() => [
    'Tất cả',
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ], [products]);
  const sizes = useMemo(() => [
    ...new Set(products.flatMap((product) => product.sizes || []).map(String)),
  ], [products]);

  // Trạng thái AI Semantic Search
  const [aiSemanticResult, setAiSemanticResult] = useState(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Tự động phân tích ngữ nghĩa bằng Gemini AI khi người dùng tìm kiếm (Yêu cầu đăng ký tài khoản)
  useEffect(() => {
    if (!currentUser || !searchQuery || searchQuery.trim().length < 2) {
      setAiSemanticResult(null);
      setIsAiSearching(false);
      return;
    }

    let isMounted = true;
    setIsAiSearching(true);

    const categories = ['Áo Polo', 'Áo Sơ Mi', 'Áo Khoác & Blazer', 'Quần Âu Công Sở', 'Quần Jeans & Khaki', 'Quần Short', 'Phụ Kiện'];
    parseSemanticSearchWithAI(searchQuery, categories)
      .then(res => {
        if (isMounted) {
          setAiSemanticResult(res);
        }
      })
      .catch(err => console.warn('AI Semantic Search error:', err))
      .finally(() => {
        if (isMounted) setIsAiSearching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, currentUser]);

  // Tự động đồng bộ khi người dùng bấm danh mục trên Header / Menu
  useEffect(() => {
    setSelectedCategory(initialCategory);
    setCurrentPage(1);
  }, [initialCategory]);

  // Lọc sản phẩm thông minh kết hợp AI Ngữ Nghĩa & Text Search
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Phân loại theo Search Query (Text thông thường + AI Semantic Expansion)
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const itemName = item.name.toLowerCase();
        const itemCat = item.category.toLowerCase();
        const itemDesc = (item.description || '').toLowerCase();

        // Ràng buộc nghiêm ngặt: Nếu tìm QUẦN thì loại ngay ÁO; Nếu tìm ÁO thì loại ngay QUẦN
        const isQueryingPant = q.includes('quần') || (aiSemanticResult && aiSemanticResult.typeConstraint === 'bottom');
        const isQueryingShirt = q.includes('áo') || (aiSemanticResult && aiSemanticResult.typeConstraint === 'top');

        const isItemPant = itemCat.includes('quần') || itemName.includes('quần');
        const isItemShirt = itemCat.includes('áo') || itemName.includes('áo');

        if (isQueryingPant && isItemShirt && !isItemPant) {
          return false;
        }
        if (isQueryingShirt && isItemPant && !isItemShirt) {
          return false;
        }

        // Kiểm tra khớp từ khóa trực tiếp
        const directMatch = itemName.includes(q) || itemCat.includes(q);

        // Kiểm tra khớp mở rộng theo phân tích của AI Gemini
        let aiMatch = false;
        if (aiSemanticResult) {
          const { relatedCategories = [], expandedKeywords = [] } = aiSemanticResult;
          // Khớp theo danh mục AI đề xuất
          const matchAiCat = relatedCategories.some(cat => 
            cat.toLowerCase() === itemCat || itemCat.includes(cat.toLowerCase())
          );
          // Khớp theo từ khóa mở rộng AI sinh ra
          const matchAiKw = expandedKeywords.some(kw => {
            const k = kw.toLowerCase().trim();
            return k.length > 2 && (itemName.includes(k) || itemCat.includes(k));
          });
          aiMatch = matchAiCat || matchAiKw;
        }

        if (!directMatch && !aiMatch) return false;
      }

      // 2. Filter Category
      if (selectedCategory !== 'Tất cả' && item.category !== selectedCategory) {
        return false;
      }
      // 3. Filter Price
      if (item.price > activePriceRange) {
        return false;
      }
      // 4. Filter Size
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
  }, [products, selectedCategory, selectedSize, activePriceRange, sortBy, searchQuery, aiSemanticResult]);

  const handleResetFilters = () => {
    setSelectedCategory('Tất cả');
    setSelectedSize('');
    setPriceRange(null);
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
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 flex items-center gap-2.5">
              <span>{searchQuery ? `Kết Quả Tìm Kiếm: "${searchQuery}"` : `Bộ Sưu Tập ${selectedCategory === 'Tất cả' ? 'Đẳng Cấp Phái Mạnh' : selectedCategory}`}</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  AI Semantic Search
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Hiển thị <span className="font-bold text-neutral-900">{filteredProducts.length}</span> sản phẩm phù hợp nhất
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

        {/* AI Semantic Suggestion Banner khi tìm kiếm */}
        {searchQuery && (
          currentUser ? (
            <div className="mt-3 p-3.5 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shrink-0">
                  {isAiSearching ? <Loader2 className="w-4 h-4 animate-spin text-neutral-950" /> : <Sparkles className="w-4 h-4 fill-neutral-950" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                      {isAiSearching ? 'AI Đang Phân Tích Ý Định...' : 'AI Phân Tích Ý Định Tìm Kiếm'}
                    </span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-neutral-300 border border-white/10">
                      Smart AI Active
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200 mt-0.5">
                    {isAiSearching 
                      ? `Đang giải mã ngữ cảnh tìm kiếm "${searchQuery}" theo phong cách và công năng thời trang nam...`
                      : (aiSemanticResult?.aiExplanation || `Đã tìm kiếm và đề xuất các sản phẩm phù hợp cho nhu cầu "${searchQuery}".`)
                    }
                  </p>
                </div>
              </div>

              {aiSemanticResult?.relatedCategories?.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                  <span className="text-[11px] text-amber-300 font-medium">Danh mục đề xuất:</span>
                  {aiSemanticResult.relatedCategories.map((c, i) => (
                    <span key={i} className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-lg">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-3 p-3.5 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-amber-500/40 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xs shrink-0">
                  AI
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                      Smart AI Semantic Search
                    </span>
                    <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700">
                      Tính năng đặc quyền thành viên
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Đăng ký tài khoản để kích hoạt công nghệ AI giải mã ngữ cảnh tìm kiếm, gợi ý trang phục theo từng dịp và phối đồ chuyên sâu!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRequireAuth && onRequireAuth()}
                className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-bold transition shadow"
              >
                Đăng Ký / Mở Khóa AI
              </button>
            </div>
          )
        )}
      </div>

      {/* Main Content Layout (Sidebar + Grid) */}
      <div className="flex gap-8 items-start">
        {/* Sidebar Bộ Lọc */}
        <SidebarFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(c) => { 
            setSelectedCategory(c); 
            if (onCategoryChange) onCategoryChange(c);
            setCurrentPage(1); 
          }}
          selectedSize={selectedSize}
          onSelectSize={(s) => { setSelectedSize(s); setCurrentPage(1); }}
          priceRange={priceRange}
          onPriceChange={(p) => { setPriceRange(p); setCurrentPage(1); }}
          onResetFilters={() => {
            handleResetFilters();
            if (onCategoryChange) onCategoryChange('Tất cả');
          }}
          categories={categories}
          sizes={sizes}
          maxPrice={maxProductPrice}
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
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : error ? (
            <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center">
              <p className="text-base font-semibold text-neutral-800">Không tải được danh sách sản phẩm</p>
              <p className="text-xs text-neutral-500 mt-2">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-4 px-5 py-2 bg-neutral-950 text-amber-400 text-xs font-bold rounded-full hover:bg-neutral-800 transition"
                >
                  Thử tải lại
                </button>
              )}
            </div>
          ) : paginatedProducts.length === 0 ? (
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
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          )}

          {/* Phân Trang (Pagination) & Nút Xem Thêm Chuẩn Thương Mại */}
          {totalPages > 1 && (
            <div className="mt-10 pt-6 border-t border-neutral-200/80 flex flex-col items-center gap-4">
              {/* Nút Xem Thêm Trang Kế Tiếp */}
              {currentPage < totalPages && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-white hover:bg-neutral-950 text-neutral-900 hover:text-white border-2 border-neutral-950 rounded-full text-xs sm:text-sm font-black transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer group"
                >
                  <span>Xem Thêm ({filteredProducts.length - currentPage * itemsPerPage} sản phẩm tiếp theo)</span>
                  <ChevronsRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {/* Dải Nút Trang 1, 2, 3, 4... */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                {/* Nút Về Trước */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="px-3 py-2 rounded-xl border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-950 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Trước</span>
                </button>

                {/* Các nút số trang 1, 2, 3, 4 ... */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (totalPages > 7) {
                    if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 2) {
                      if (page === 2 || page === totalPages - 1) {
                        return <span key={page} className="px-1 text-xs text-neutral-400 font-bold">...</span>;
                      }
                      return null;
                    }
                  }

                  const isActive = currentPage === page;
                  return (
                    <button
                      type="button"
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm font-black rounded-xl border transition cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-neutral-950 border-neutral-950 text-amber-400 shadow-md scale-105'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-950 hover:bg-neutral-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Nút Kế Tiếp */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="px-3 py-2 rounded-xl border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-950 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thông tin số trang hiện tại */}
              <p className="text-[11px] text-neutral-500 font-medium">
                Đang xem trang <strong className="text-neutral-900">{currentPage}</strong> / {totalPages} (Tổng {filteredProducts.length} sản phẩm)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
