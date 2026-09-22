import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';

export const AdminLogin = ({ onLoginSuccess, onBackToClient }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Tài khoản & Mật khẩu mặc định dành cho Admin Local
      if (username.trim() === 'admin' && password === 'admin123') {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Tài khoản hoặc mật khẩu quản trị không chính xác!');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 relative font-sans">
      {/* Nút quay lại trang bán hàng */}
      <button
        onClick={onBackToClient}
        className="absolute top-6 left-6 text-neutral-400 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Về Cửa Hàng
      </button>

      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient light */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-neutral-950 mx-auto flex items-center justify-center font-black text-2xl shadow-lg mb-3">
            M
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            CỔNG QUẢN TRỊ MENSTYLE
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Dành riêng cho ban quản trị và kỹ thuật viên nội bộ
          </p>
        </div>

        {/* Thông báo lỗi */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Gợi ý tài khoản local */}
        <div className="mb-6 p-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-[11px] text-neutral-300 space-y-0.5">
          <p className="font-bold text-amber-400">🔑 Tài khoản đăng nhập nội bộ (Local):</p>
          <p>• Tên đăng nhập: <code className="text-white font-mono bg-neutral-900 px-1.5 py-0.5 rounded">admin</code></p>
          <p>• Mật khẩu: <code className="text-white font-mono bg-neutral-900 px-1.5 py-0.5 rounded">admin123</code></p>
        </div>

        {/* Form Đăng Nhập */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Tên tài khoản
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên quản trị viên..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Mật khẩu bảo mật
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full justify-center bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold py-3 rounded-xl text-sm mt-6 shadow-md transition disabled:opacity-50"
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng Nhập Vào Quản Trị'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-[11px] text-neutral-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Hệ thống bảo mật 2 lớp MENSTYLE Security
          </span>
        </div>
      </div>
    </div>
  );
};
