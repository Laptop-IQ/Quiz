import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

export const cx = (...c) => c.filter(Boolean).join(" ");

export const Card = ({ className = "", children, ...rest }) => (
  <div className={cx("rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]", className)} {...rest}>
    {children}
  </div>
);

export const PageHeader = ({ title, subtitle, children }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
    {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
  </div>
);

export const Badge = ({ className = "", children }) => (
  <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset", className)}>
    {children}
  </span>
);

export const Skeleton = ({ className = "" }) => <div className={cx("animate-pulse rounded-xl bg-slate-200/70", className)} />;

export const StatCard = ({ icon: Icon, label, value, detail, tone = "bg-blue-50 text-blue-600", loading }) => (
  <Card className="relative overflow-hidden p-5">
    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50" />
    <div className="relative flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
        {loading ? (
          <Skeleton className="mt-3 h-8 w-20" />
        ) : (
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 tabular-nums">{value}</p>
        )}
        {detail && !loading && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
      </div>
      <div className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tone)}>
        <Icon size={20} />
      </div>
    </div>
  </Card>
);

export const buttonStyles = {
  primary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
  secondary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400",
  danger:
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500",
  icon:
    "inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-400",
};

export const inputStyles =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

export const Spinner = ({ size = 16 }) => <Loader2 size={size} className="animate-spin" />;

export const ErrorState = ({ message, onRetry }) => (
  <Card className="flex flex-col items-center px-6 py-14 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
      <AlertTriangle size={22} />
    </div>
    <p className="mt-4 text-base font-extrabold text-slate-900">Something went wrong</p>
    <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className={cx(buttonStyles.secondary, "mt-5")}>
        <RefreshCw size={15} /> Try again
      </button>
    )}
  </Card>
);

export const EmptyState = ({ icon: Icon, title, text, children }) => (
  <Card className="flex flex-col items-center px-6 py-14 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
      <Icon size={22} />
    </div>
    <p className="mt-4 text-base font-extrabold text-slate-900">{title}</p>
    {text && <p className="mt-1 max-w-md text-sm text-slate-500">{text}</p>}
    {children && <div className="mt-5">{children}</div>}
  </Card>
);

// Accessible confirmation modal (Esc to cancel, focus moves to the safe button)
export const ConfirmDialog = ({ open, title, children, confirmLabel = "Confirm", danger, busy, onConfirm, onCancel }) => {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    cancelRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && !busy && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && !busy && onCancel()}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className={cx("mb-4 flex h-11 w-11 items-center justify-center rounded-xl", danger ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600")}>
          <AlertTriangle size={20} />
        </div>
        <h2 id="confirm-title" className="text-lg font-extrabold text-slate-950">{title}</h2>
        <div className="mt-2 text-sm leading-6 text-slate-500">{children}</div>
        <div className="mt-6 flex gap-3">
          <button onClick={onConfirm} disabled={busy} className={cx(danger ? buttonStyles.danger : buttonStyles.primary, "flex-1")}>
            {busy && <Spinner />} {confirmLabel}
          </button>
          <button ref={cancelRef} onClick={onCancel} disabled={busy} className={cx(buttonStyles.secondary, "flex-1")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
