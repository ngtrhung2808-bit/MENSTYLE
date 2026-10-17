import React, { useState } from 'react';
import { Tag, Sparkles, Check, Copy } from 'lucide-react';
import { AVAILABLE_VOUCHERS } from '../../data/voucherConfig';

const VOUCHERS = AVAILABLE_VOUCHERS.filter(v => v.code !== 'MENSTYLE20');

export const HomeVouchersSection = ({ onToast }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    if (onToast) {
      onToast('Đã Lưu Mã Ưu Đãi', `Mã giảm giá ${code} đã được sao chép vào bộ nhớ tạm!`, 'success');
    }
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-b border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Đặc quyền mua sắm Online
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 mt-1 flex items-center gap-2">
            Mã Giảm Giá Độc Quyền Trên Website
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {VOUCHERS.map((v) => {
          const isCopied = copiedCode === v.code;
          return (
            <div
              key={v.code}
              className="relative p-4 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-950 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    ★ Độc Quyền Website
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {v.remaining}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-xs font-bold font-mono bg-neutral-100 text-neutral-900 px-2.5 py-1 rounded-md border border-neutral-200 tracking-wider">
                    {v.code}
                  </span>
                  <span className="text-base font-black text-neutral-950">
                    Giảm {v.displayDiscount || v.discount}
                  </span>
                </div>

                <p className="text-xs text-neutral-600">
                  {v.condition}
                </p>
                <p className="text-[11px] text-neutral-400">
                  {v.expiry}
                </p>
              </div>

              <button
                onClick={() => handleCopy(v.code)}
                className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-950 hover:bg-neutral-800 text-white'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Đã Lưu Mã
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Lưu Mã
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
