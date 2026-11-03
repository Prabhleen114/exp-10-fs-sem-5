import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { removeToast } from '../../store/slices/notificationSlice';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastCenter: React.FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.notifications.toasts);

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{ toast: any; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />,
  };

  const styleVariants = {
    success: 'border-emerald-200/80 dark:border-emerald-800/80 bg-white dark:bg-slate-900',
    warning: 'border-amber-200/80 dark:border-amber-800/80 bg-white dark:bg-slate-900',
    error: 'border-rose-200/80 dark:border-rose-800/80 bg-white dark:bg-slate-900',
    info: 'border-indigo-200/80 dark:border-indigo-800/80 bg-white dark:bg-slate-900',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
        styleVariants[toast.type as keyof typeof styleVariants] || styleVariants.info
      }`}
    >
      {icons[toast.type as keyof typeof icons] || icons.info}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {toast.title}
          </p>
        )}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export { ToastCenter as ToastContainer };
