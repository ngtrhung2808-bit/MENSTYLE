import React, { useState } from 'react';
import { BLOG_POSTS } from '../../data/blogData';
import { Calendar, User, Clock, ArrowRight, Share2, Sparkles, ChevronRight, Bookmark } from 'lucide-react';
import { Button } from '../common/Button';

export const BlogPage = ({ onSelectCategory, onSelectProduct, onOpenOutfitStylist }) => {
  const [selectedPost, setSelectedPost] = useState(BLOG_POSTS[0]); // Mặc định mở bài Fall Winter 2025 Collection
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <span className="hover:text-neutral-900 cursor-pointer">Trang chủ</span>
          <span>/</span>
          <span className="text-neutral-600 font-medium">Torano Journal</span>
          <span>/</span>
          <span className="text-amber-600 font-bold uppercase truncate max-w-xs">{selectedPost.title}</span>
        </div>

        {/* Banner Tiêu Đề Tạp Chí Thời Trang (Torano Journal Header) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black tracking-widest text-amber-600 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-300">
            MENSTYLE & TORANO JOURNAL
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-neutral-950 mt-3 mb-3 leading-tight tracking-tight uppercase">
            XU HƯỚNG & PHONG CÁCH QUÝ ÔNG
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto">
            Khám phá những bộ sưu tập thời trang nam mới nhất, cẩm nang phối đồ thông minh và bí quyết định hình phong cách đẳng cấp.
          </p>
        </div>

        {/* Bố cục 2 Cột: Cột Trái Nội Dung Bài Viết Chính - Cột Phải Sidebar Bài Viết & Gợi Ý AI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI (8 CỘT): CHI TIẾT BÀI BÁO (Article Detail) */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-10 border border-neutral-200 shadow-sm space-y-6">
            
            {/* Tag & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
              <span className="px-3 py-1 bg-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-lg">
                {selectedPost.category}
              </span>
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" /> {selectedPost.date}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-amber-500" /> {selectedPost.author}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> {selectedPost.readTime}
                </span>
              </div>
            </div>

            {/* Tiêu đề bài viết */}
            <h2 className="text-xl sm:text-3xl font-black text-neutral-950 leading-tight">
              {selectedPost.title}
            </h2>

            {/* Tóm tắt mở đầu (Lead paragraph) */}
            <p className="text-sm sm:text-base font-semibold text-neutral-700 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1 bg-amber-50/40 rounded-r-xl">
              {selectedPost.summary}
            </p>

            {/* Ảnh Hero Banner của bài viết */}
            <div className="rounded-2xl overflow-hidden aspect-[16/9] w-full shadow-md bg-neutral-100 border border-neutral-200">
              <img 
                src={selectedPost.banner} 
                alt={selectedPost.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>

            {/* Nội dung chi tiết các đoạn (Rich Content) */}
            <div className="space-y-6 pt-2 text-neutral-700 leading-relaxed text-sm sm:text-base">
              {selectedPost.content.map((block, index) => {
                if (block.type === 'heading') {
                  return (
                    <h3 key={index} className="text-lg sm:text-xl font-black text-neutral-950 mt-6 pt-2 border-t border-neutral-100">
                      {block.text}
                    </h3>
                  );
                }
                if (block.type === 'paragraph') {
                  return (
                    <p key={index} className="text-justify text-neutral-700 leading-relaxed">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === 'image') {
                  return (
                    <figure key={index} className="my-6">
                      <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-100 border border-neutral-200 shadow-sm">
                        <img 
                          src={block.url} 
                          alt={block.caption || 'Hình ảnh BST'} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="text-xs text-neutral-500 text-center italic mt-2">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                if (block.type === 'quote') {
                  return (
                    <div key={index} className="p-6 my-6 bg-neutral-950 text-white rounded-2xl shadow-lg text-center relative overflow-hidden">
                      <div className="absolute top-2 left-4 text-6xl text-amber-500/20 font-serif leading-none select-none">“</div>
                      <p className="text-sm sm:text-base font-bold italic text-amber-200 relative z-10">
                        {block.text}
                      </p>
                      <span className="block text-xs text-neutral-400 mt-2 font-medium tracking-widest uppercase">
                        — MENSTYLE x TORANO FASHION STATEMENT
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Footer bài viết: Chia sẻ & Khám phá sản phẩm */}
            <div className="pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleShare}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Đã Sao Chép Link!' : 'Chia Sẻ Bài Viết'}</span>
                </Button>
              </div>

              {selectedPost.relatedProductCategory && (
                <Button 
                  onClick={() => onSelectCategory && onSelectCategory(selectedPost.relatedProductCategory)}
                  className="bg-neutral-950 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition"
                >
                  <span>Xem Sản Phẩm Thuộc BST</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </article>

          {/* CỘT PHẢI (4 CỘT): SIDEBAR BÀI VIẾT KHÁC & KÊU GỌI PHỐI ĐỒ AI */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Box Widget AI Stylist Banner */}
            <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950 text-white p-6 rounded-3xl shadow-xl border border-neutral-800 relative overflow-hidden">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 fill-amber-400" />
                <span>Trợ Lý Gemini AI Stylist</span>
              </div>
              <h4 className="text-lg font-black text-white leading-tight mb-2">
                Chưa Biết Phối Đồ Cho Mùa Thu Đông?
              </h4>
              <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
                Hãy để chuyên gia AI Stylist thiết kế riêng 1 set đồ 3 món hoàn hảo theo vóc dáng và gu thẩm mỹ của bạn.
              </p>
              <Button 
                onClick={onOpenOutfitStylist}
                className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 fill-neutral-950" />
                <span>Tạo Set Đồ Ngay</span>
              </Button>
            </div>

            {/* Danh sách bài viết khác (Other Articles) */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
              <h4 className="text-sm font-black text-neutral-950 uppercase tracking-wider pb-3 border-b border-neutral-100 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-600" />
                Bài Viết Mới Nhất
              </h4>

              <div className="divide-y divide-neutral-100 mt-2">
                {BLOG_POSTS.map((post) => (
                  <div 
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post);
                      window.scrollTo({ top: 150, behavior: 'smooth' });
                    }}
                    className={`py-4 flex gap-3.5 group cursor-pointer transition ${
                      selectedPost.id === post.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200">
                      <img 
                        src={post.banner} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
                          {post.category}
                        </span>
                        <h5 className="text-xs font-bold text-neutral-900 group-hover:text-amber-600 transition line-clamp-2 leading-snug">
                          {post.title}
                        </h5>
                      </div>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {post.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Khối Đăng Ký Nhận Bản Tin Thời Trang */}
            <div className="bg-neutral-100 p-6 rounded-3xl border border-neutral-200 text-center">
              <span className="text-xl">📩</span>
              <h5 className="text-xs font-black text-neutral-900 uppercase tracking-wider mt-2 mb-1">
                Đăng Ký Nhận Bản Tin Quý Ông
              </h5>
              <p className="text-[11px] text-neutral-500 mb-3">
                Nhận sớm thông báo về các bộ sưu tập giới hạn và ưu đãi độc quyền 50% hàng tháng.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..." 
                  className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-neutral-300 outline-none focus:border-amber-500"
                />
                <Button className="bg-neutral-950 text-white text-xs px-3 py-2 rounded-xl font-bold shrink-0">
                  Gửi
                </Button>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};
