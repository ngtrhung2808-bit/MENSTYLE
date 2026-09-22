import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Inputs';

export const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6">
      {/* Background Decor & Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/85 to-transparent z-10" />
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
        alt="Bộ sưu tập thời trang mới"
        className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay opacity-60"
      />

      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28 lg:py-32 flex flex-col items-start max-w-2xl">
        <Badge variant="brand" className="mb-4 bg-brand-500/20 text-brand-300 border border-brand-400/30">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> New Season Collection 2026
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
          Nâng Tầm Phong Cách <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-200 to-amber-100">
            Tối Giản & Đẳng Cấp
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 mb-8 leading-relaxed">
          Khám phá bộ sưu tập Thu Đông mới nhất với chất liệu vải linen, dạ cừu tự nhiên và đường may may đo tinh tế.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="brand" size="lg" className="rounded-full shadow-lg shadow-brand-600/30">
            Khám phá bộ sưu tập <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-full !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 backdrop-blur-sm">
            Xem Lookbook
          </Button>
        </div>

        {/* Feature Badges dưới Hero */}
        <div className="grid grid-cols-3 gap-6 pt-12 mt-4 border-t border-neutral-800/80 w-full text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-400" />
            <span>Freeship từ 499k</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-brand-400" />
            <span>Đổi trả 30 ngày</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>100% Chính hãng</span>
          </div>
        </div>
      </div>
    </section>
  );
};
