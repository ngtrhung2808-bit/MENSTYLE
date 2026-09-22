import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts = [], onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              isSuccess 
                ? 'bg-neutral-950/95 text-white border-neutral-800' 
                : isError 
                ? 'bg-rose-950/95 text-white border-rose-800' 
                : 'bg-white/95 text-neutral-900 border-neutral-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
              
              <div>
                {toast.title && <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>}
                <p className="text-xs text-neutral-300 mt-0.5">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => onRemove && onRemove(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
