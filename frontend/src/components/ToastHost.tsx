import React from 'react';
import { useStore } from '../store/useStore';

export const ToastHost: React.FC = () => {
  const toasts = useStore((state) => state.toasts);
  const removeToast = useStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-3 w-[min(92vw,360px)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl border p-4 shadow-lg backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-100'
              : toast.type === 'error'
                ? 'bg-rose-500/20 border-rose-400/30 text-rose-100'
                : 'bg-sky-500/20 border-sky-400/30 text-sky-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">{toast.title}</p>
              <p className="text-xs mt-1 opacity-90">{toast.message}</p>
            </div>
            <button className="text-xs" onClick={() => removeToast(toast.id)} type="button">
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
