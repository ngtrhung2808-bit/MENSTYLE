import React from 'react';
import { ArrowRight, Cpu, Wind, Shield, Droplets } from 'lucide-react';

const FABRICS = [
  {
    id: 1,
    name: 'THERMO-LOCK™',
    subtitle: 'Khóa Nhiệt Tối Đa',
    desc: 'Bông chần ô siêu nhẹ 120gsm khóa nhiệt đa khoang, giữ ấm cơ thể trong mọi điều kiện rét đại hàn mà không cồng kềnh.',
    icon: Wind,
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
    category: 'Áo Khoác & Blazer'
  },
  {
    id: 2,
    name: 'MODAL-SILK™',
    subtitle: 'Chống Nhăn Tự Nhiên',
    desc: 'Sợi sồi tự nhiên kết hợp tơ tằm đem lại độ óng ả mềm mịn, khả năng chống nhăn và thông thoáng gấp 2 lần sợi cotton thông thường.',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    category: 'Áo Sơ Mi'
  },
  {
    id: 3,
    name: 'DIAMOND-AIR™',
    subtitle: 'Dệt Tổ Ong Thoáng Khí',
    desc: 'Cấu trúc dệt kim hình kim cương micro hút ẩm siêu tốc, giải nhiệt tức thì, tạo cảm giác dễ chịu suốt ngày dài vận động.',
    icon: Cpu,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
    category: 'Áo Polo'
  },
  {
    id: 4,
    name: 'FLEX-STRETCH 4D™',
    subtitle: 'Co Giãn Đa Chiều',
    desc: 'Công nghệ dệt pha Spandex đàn hồi 4 chiều cho quần âu và quần kaki, vừa vặn phom dáng mà không gây cảm giác bó chật.',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop',
    category: 'Quần Âu Công Sở'
  }
];

export const HomeFabricTechSection = ({ onSelectCategory }) => {
  return (
    <section className="bg-neutral-900 text-white py-12 sm:py-16 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Đột Phá Kỹ Thuật Dệt May
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Công Nghệ Chất Vải MENSTYLE™
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-2">
            Ứng dụng chất liệu kỹ thuật số thế hệ mới, tối ưu hóa công năng và mang lại trải nghiệm êm ái, bền bỉ vượt thời gian.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FABRICS.map((fab) => {
            const Icon = fab.icon;
            return (
              <div
                key={fab.id}
                onClick={() => onSelectCategory && onSelectCategory(fab.category)}
                className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/60 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden bg-neutral-800">
                  <img
                    src={fab.image}
                    alt={fab.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-neutral-950/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-amber-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-base text-white group-hover:text-amber-400 transition-colors">
                      {fab.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-400/90 mb-1">
                      {fab.subtitle}
                    </p>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {fab.desc}
                    </p>
                  </div>

                  <div className="pt-3 inline-flex items-center gap-1.5 text-xs font-bold text-neutral-300 group-hover:text-amber-400 transition-colors">
                    <span>Xem sản phẩm ứng dụng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
