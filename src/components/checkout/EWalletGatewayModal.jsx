import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Smartphone, 
  QrCode, 
  ExternalLink, 
  ShieldCheck, 
  Loader2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../common/Button';

export const EWalletGatewayModal = ({ 
  isOpen, 
  onClose, 
  walletType = 'momo', // 'momo' | 'zalopay' | 'vnpay'
  orderInfo = {},
  onPaymentSuccess
}) => {
  const [step, setStep] = useState('gateway'); // 'gateway' | 'processing' | 'success'
  const [countdown, setCountdown] = useState(300); // 5 phút đếm ngược

  const formatPrice = (price) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  // Cấu hình từng ví điện tử
  const walletConfigs = {
    momo: {
      name: 'Ví MoMo',
      color: '#A50064',
      bgHeader: 'bg-[#A50064]',
      logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png',
      fallbackLogo: 'momo',
      webUrl: 'https://momo.vn/',
      deepLink: 'https://me.momo.vn/',
      guideText: 'Mở ứng dụng MoMo hoặc đăng nhập trên trình duyệt để hoàn tất thanh toán'
    },
    zalopay: {
      name: 'Ví ZaloPay',
      color: '#0068FF',
      bgHeader: 'bg-[#0068FF]',
      logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png',
      webUrl: 'https://zalopay.vn/',
      deepLink: 'https://zalopay.vn/',
      guideText: 'Mở ứng dụng Zalo / ZaloPay hoặc liên kết tài khoản để xác nhận thanh toán'
    },
    vnpay: {
      name: 'Cổng VNPAY-QR',
      color: '#005BAA',
      bgHeader: 'bg-[#005BAA]',
      logo: 'https://vnpay.vn/assets/images/logo-vnpay.svg',
      webUrl: 'https://vnpay.vn/',
      deepLink: 'https://vnpay.vn/',
      guideText: 'Quét mã VNPAY-QR bằng hơn 30+ App Ngân Hàng hoặc Ví VNPAY'
    }
  };

  const config = walletConfigs[walletType] || walletConfigs.momo;

  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const handleSimulatePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }, 1500);
    }, 2000);
  };

  const handleOpenAppOrWeb = () => {
    window.open(config.webUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl z-10 border border-neutral-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header với thương hiệu Ví */}
        <div className={`${config.bgHeader} p-5 text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow">
              <img src={config.logo} alt={config.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/80 block">
                Cổng liên kết thanh toán trực tuyến
              </span>
              <h3 className="text-base font-black text-white">{config.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Nội dung thanh toán */}
        <div className="p-5 sm:p-6 space-y-4">
          {step === 'gateway' && (() => {
            const finalAmount = Number(orderInfo.total ?? orderInfo.grandTotal ?? 0);
            return (
            <>
              {/* Tóm tắt số tiền */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-neutral-500 block">Số tiền cần thanh toán</span>
                  <span className="text-lg font-black text-neutral-950">
                    {formatPrice(finalAmount)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-500 block">Đơn hàng</span>
                  <span className="text-xs font-mono font-bold text-amber-700">
                    {orderInfo.orderCode || 'MENSTYLE-DH'}
                  </span>
                </div>
              </div>

              {/* Mã QR thanh toán */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-center shadow-xs">
                <p className="text-xs font-semibold text-neutral-700 mb-2">
                  {config.guideText}
                </p>
                <div className="relative inline-block p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                  <img
                    src={`https://api.vietqr.io/image/970422-0988776655-compact2.jpg?amount=${finalAmount}&addInfo=${encodeURIComponent(orderInfo.orderCode || 'MENSTYLE')}&accountName=MENSTYLE%20STORE`}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-neutral-200 flex items-center justify-center overflow-hidden">
                      <img 
                        src={config.logo} 
                        alt="icon" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span style="font-weight:900;font-size:12px;color:${config.color}">M</span>`;
                        }}
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                  <span>Giao dịch hết hạn sau:</span>
                  <span className="font-mono font-bold text-rose-600">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Các nút hành động liên kết */}
              <div className="space-y-2 pt-1">
                <Button
                  onClick={handleOpenAppOrWeb}
                  className="w-full justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 font-bold py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Mở / Đăng nhập {config.name} trên trình duyệt
                </Button>

                <Button
                  onClick={handleSimulatePayment}
                  className="w-full justify-center bg-neutral-950 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Tôi Đã Hoàn Tất Chuyển Tiền Trên {config.name}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Liên kết mã hóa chuẩn PCI-DSS & Sandbox API</span>
              </div>
            </>
            );
          })()}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
              <h4 className="font-bold text-sm text-neutral-900">
                Đang xác thực giao dịch từ {config.name}...
              </h4>
              <p className="text-xs text-neutral-500">
                Vui lòng không tắt trình duyệt trong giây lát
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-black text-base text-neutral-950">
                Thanh Toán Thành Công Qua {config.name}!
              </h4>
              <p className="text-xs text-neutral-500">
                Đơn hàng đã được xác nhận thanh toán trực tuyến và lưu vào hệ thống.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
