import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { FABRIC_LIST } from '../../data/fabricData';

export const HomeFabricTechSection = ({ onSelectFabric, onSelectCategory }) => {
  return (
    <section className="bg-neutral-900 text-white py-12 sm:py-16 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Đột Phá Kỹ Thuật Dệt May
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Công Nghệ Chất Vải MENSTYLE™
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-2">
            Ứng dụng chất liệu kỹ thuật số thế hệ mới, tối ưu hóa công năng và mang lại trải nghiệm êm ái, bền bỉ vượt thời gian. Bấm vào từng loại vải để khám phá chi tiết công nghệ và danh sách sản phẩm tương ứng.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FABRIC_LIST.map((fab) => {
            const Icon = fab.icon;
            return (
              <div
                key={fab.id}
                onClick={() => onSelectFabric && onSelectFabric(fab)}
                className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/80 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
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
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                      {fab.tagline}
                    </p>
                  </div>

                  <div className="pt-3 inline-flex items-center gap-1.5 text-xs font-bold text-neutral-300 group-hover:text-amber-400 transition-colors">
                    <span>Khám phá công nghệ & sản phẩm</span>
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
