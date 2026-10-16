import React, { useState, useMemo } from 'react';
import { X, Ruler, Sparkles, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { Button } from '../common/Button';

export const SmartSizeGuideModal = ({ isOpen, onClose, productCategory = 'Áo Polo', onSelectSize }) => {
  if (!isOpen) return null;

  const [heightCm, setHeightCm] = useState(172);
  const [weightKg, setWeightKg] = useState(66);
  const [fitPreference, setFitPreference] = useState('vừa-vặn'); // 'ôm-body' | 'vừa-vặn' | 'thoải-mái'

  // Thuật toán tính toán Size chuẩn thời trang nam MENSTYLE
  const recommendedSize = useMemo(() => {
    let baseScore = 0;

    // Phân tích Chiều cao (cm)
    if (heightCm < 165) baseScore += 1;
    else if (heightCm <= 170) baseScore += 2;
    else if (heightCm <= 176) baseScore += 3;
    else if (heightCm <= 182) baseScore += 4;
    else baseScore += 5;

    // Phân tích Cân nặng (kg)
    if (weightKg < 55) baseScore += 1;
    else if (weightKg <= 64) baseScore += 2;
    else if (weightKg <= 72) baseScore += 3;
    else if (weightKg <= 80) baseScore += 4;
    else baseScore += 5;

    // Trung bình điểm số
    let finalScore = Math.round(baseScore / 2);

    // Điều chỉnh theo form dáng mong muốn
    if (fitPreference === 'ôm-body' && finalScore > 1) finalScore -= 0; // Giữ form slim
    if (fitPreference === 'thoải-mái' && finalScore < 5) finalScore += 1; // Tăng 1 size nếu thích mặc rộng

    const sizeMap = {
      1: 'S',
      2: 'M',
      3: 'L',
      4: 'XL',
      5: '2XL'
    };

    return sizeMap[Math.min(5, Math.max(1, finalScore))] || 'L';
  }, [heightCm, weightKg, fitPreference]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-7 shadow-2xl z-10 border border-neutral-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Nút đóng */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-neutral-950">Gợi Ý Chọn Size Chuẩn MENSTYLE</h3>
            <p className="text-xs text-neutral-500">Phù hợp danh mục: <strong>{productCategory}</strong></p>
          </div>
        </div>

        {/* Box Gợi Ý Size Thông Minh */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-neutral-950 to-neutral-800 text-white flex items-center justify-between border border-neutral-800 shadow-md">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Size đề xuất cho vóc dáng bạn:
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-400">{recommendedSize}</span>
              <span className="text-xs text-neutral-300">
                ({heightCm}cm • {weightKg}kg • {fitPreference === 'vừa-vặn' ? 'Form Regular' : fitPreference === 'ôm-body' ? 'Form Slimfit' : 'Form Thoải mái'})
              </span>
            </div>
          </div>

          {onSelectSize && (
            <Button
              onClick={() => {
                onSelectSize(recommendedSize);
                onClose();
              }}
              variant="primary"
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-xl text-xs shrink-0 cursor-pointer"
            >
              Chọn Size {recommendedSize}
            </Button>
          )}
        </div>

        {/* Sliders đo chiều cao & cân nặng */}
        <div className="mt-5 space-y-4">
          {/* 1. Chiều cao */}
          <div>
            <div className="flex justify-between text-xs font-bold text-neutral-800 mb-1.5">
              <span>Chiều cao của bạn:</span>
              <span className="text-amber-600 font-black text-sm">{heightCm} cm</span>
            </div>
            <input 
              type="range" 
              min="150" 
              max="195" 
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full accent-neutral-950 h-2 bg-neutral-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>150 cm</span>
              <span>170 cm</span>
              <span>195 cm</span>
            </div>
          </div>

          {/* 2. Cân nặng */}
          <div>
            <div className="flex justify-between text-xs font-bold text-neutral-800 mb-1.5">
              <span>Cân nặng của bạn:</span>
              <span className="text-amber-600 font-black text-sm">{weightKg} kg</span>
            </div>
            <input 
              type="range" 
              min="45" 
              max="105" 
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-neutral-950 h-2 bg-neutral-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>45 kg</span>
              <span>75 kg</span>
              <span>105 kg</span>
            </div>
          </div>

          {/* 3. Gu mặc (Fit preference) */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-2">Sở thích form dáng mặc:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ôm-body', label: 'Ôm Body', desc: 'Tôn vóc dáng' },
                { id: 'vừa-vặn', label: 'Vừa Vặn', desc: 'Chuẩn phong độ' },
                { id: 'thoải-mái', label: 'Thoải Mái', desc: 'Rộng rãi dễ thở' }
              ].map((fit) => (
                <button
                  key={fit.id}
                  type="button"
                  onClick={() => setFitPreference(fit.id)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    fitPreference === fit.id 
                      ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm' 
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <p className="text-xs font-bold">{fit.label}</p>
                  <p className={`text-[10px] mt-0.5 ${fitPreference === fit.id ? 'text-amber-400' : 'text-neutral-400'}`}>{fit.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bảng Size Chuẩn Chi Tiết (Collapsible hoặc hiển thị ngay) */}
        <div className="mt-5 pt-4 border-t border-neutral-100">
          <p className="text-xs font-bold text-neutral-800 mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-neutral-500" /> Bảng quy đổi thông số cơ bản MENSTYLE:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-neutral-100 text-neutral-800 font-bold">
                <tr>
                  <th className="py-1.5 px-2 border-r border-neutral-200">Size</th>
                  <th className="py-1.5 px-2 border-r border-neutral-200">Chiều cao</th>
                  <th className="py-1.5 px-2 border-r border-neutral-200">Cân nặng</th>
                  <th className="py-1.5 px-2">Phom dáng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                <tr className={recommendedSize === 'S' ? 'bg-amber-50 font-bold text-amber-900' : ''}>
                  <td className="py-1.5 px-2 border-r border-neutral-200">S</td>
                  <td className="py-1.5 px-2 border-r border-neutral-200">1m60 - 1m68</td>
                  <td className="py-1.5 px-2 border-r border-neutral-200">50 - 58kg</td>
                  <td className="py-1.5 px-2">Vừa vặn</td>
                </tr>
                <tr className={recommendedSize === 'M' ? 'bg-amber-50 font-bold text-amber-900' : ''}>
                  <td className="py-1.5 px-2 border-r border-neutral-200">M</td>
                  <td className="py-1.5 px-2 border-r border-neutral-200">1m68 - 1m74</td>
                  <td className="py-1.5 px-2 border-r border-neutral-200">59 - 67kg</td>
                  <td className="py-1.5 px-2">Chuẩn đẹp</td>
                </tr>
                <tr className={recommendedSize === 'L' ? 'bg-amber-50 font-bold text-amber-900' : ''}>
                  <td className="py-1.5 px-2 border-r border-neutral-200">L</td>
                  <td className="py-1.5 px-2 border-r border-neutral-200">1m74 - 1m80</td>
                  <td className="py-1.5 px-2 border-r border-neutral-200">68 - 75kg</td>
                  <td className="py-1.5 px-2">Chuẩn quý ông</td>
                </tr>
                <tr className={recommendedSize === 'XL' ? 'bg-amber-50 font-bold text-amber-900' : ''}>
                  <td className="py-1.5 px-2 border-r border-neutral-200">XL</td>
                  <td className="py-1.5 px-2 border-r border-neutral-200">1m78 - 1m85</td>
                  <td className="py-1.5 px-2 border-r border-neutral-200">76 - 84kg</td>
                  <td className="py-1.5 px-2">Phong độ</td>
                </tr>
                <tr className={recommendedSize === '2XL' ? 'bg-amber-50 font-bold text-amber-900' : ''}>
                  <td className="py-1.5 px-2 border-r border-neutral-200">2XL</td>
                  <td className="py-1.5 px-2 border-r border-neutral-200">&gt; 1m80</td>
                  <td className="py-1.5 px-2 border-r border-neutral-200">85 - 95kg</td>
                  <td className="py-1.5 px-2">Thoải mái</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
