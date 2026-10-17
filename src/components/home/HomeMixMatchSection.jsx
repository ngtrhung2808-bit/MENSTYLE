import React from 'react';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';

export const LOOKS = [
  {
    id: 1,
    title: 'Set Thu Đông Urban Casual 01',
    saveText: 'Tiết kiệm 150.000₫',
    discountAmount: 150000,
    desc: 'Áo khoác gió Windtherm GWCU055 + Quần kaki Smart HABF801',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800&auto=format&fit=crop',
    itemIds: [1072047377, 1073757669]
  },
  {
    id: 2,
    title: 'Set Executive Công Sở 02',
    saveText: 'Tiết kiệm 180.000₫',
    discountAmount: 180000,
    desc: 'Sơ mi ngắn tay HSTB301 + Quần âu Flex Motion HABF802 + Thắt lưng GAAL003',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop',
    itemIds: [1074541031, 1073656503, 1071203359]
  },
  {
    id: 3,
    title: 'Set Weekend Dạo Phố 03',
    saveText: 'Tiết kiệm 120.000₫',
    discountAmount: 120000,
    desc: 'Áo polo Silk Touch HSTP904 + Short khaki HSBK800',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop',
    itemIds: [1075102717, 1074662406]
  },
  {
    id: 4,
    title: 'Set Lịch Lãm Tiệc Tối 04',
    saveText: 'Tiết kiệm 220.000₫',
    discountAmount: 220000,
    desc: 'Áo blazer túi cơi FWTV002 + Quần âu Flex Motion HABF802 + Thắt lưng GAAL003',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
    itemIds: [1057429019, 1073656503, 1071203359]
  }
];

export const HomeMixMatchSection = ({ onSelectCombo, onOpenAllCombos }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Gợi Ý Trang Phục Hoàn Chỉnh
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mt-1">
            Combo Mix & Match • Mua Cả Bộ Tiết Kiệm
          </h2>
        </div>
        <button
          onClick={() => onSelectCombo && onSelectCombo(LOOKS[0])}
          className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1.5 transition cursor-pointer"
        >
          <span>Xem tất cả set đồ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {LOOKS.map((look) => (
          <div
            key={look.id}
            onClick={() => onSelectCombo && onSelectCombo(look)}
            className="group relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[3/4] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src={look.image}
              alt={look.title}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Lớp phủ thông tin ở đáy */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                {look.saveText}
              </span>
              <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                {look.title}
              </h3>
              <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                {look.desc}
              </p>

              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:text-amber-400 transition-colors">
                <Eye className="w-3.5 h-3.5" />
                <span>Xem chi tiết combo & mua cả bộ</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
