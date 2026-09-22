import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { Button } from '../common/Button';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!formData.name.trim()) {
        setError('Vui lòng nhập họ tên');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu nhập lại không khớp');
        return;
      }
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    // Đăng nhập thành công thành viên mẫu
    onLoginSuccess({
      name: formData.name.trim() || 'Quý Ông MENSTYLE',
      email: formData.email.trim(),
      memberLevel: 'Thành Viên Bạc',
      points: 100
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab chuyển Đăng nhập / Đăng ký */}
        <div className="flex border-b border-neutral-200 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 pb-3 text-sm font-bold transition text-center ${
              mode === 'login' 
                ? 'border-b-2 border-neutral-950 text-neutral-950' 
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Đăng Nhập Khách Hàng
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 pb-3 text-sm font-bold transition text-center ${
              mode === 'register' 
                ? 'border-b-2 border-neutral-950 text-neutral-950' 
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Đăng Ký Thành Viên
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Họ và tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none focus:border-neutral-950"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="quyong@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none focus:border-neutral-950"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none focus:border-neutral-950"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none focus:border-neutral-950"
                  required
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full justify-center bg-neutral-950 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-xs sm:text-sm mt-4 shadow-md transition"
          >
            {mode === 'login' ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản Mới'}
          </Button>
        </form>

        <div className="mt-5 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
          <p>🎁 Đăng ký ngay để nhận voucher <strong className="text-amber-600 font-bold">100.000đ</strong> và tích điểm thành viên VIP!</p>
        </div>
      </div>
    </div>
  );
};
