export default function ConfirmDialog({
  icon,
  title,
  description,
  confirmLabel,
  confirmClassName,
  onConfirm,
  onCancel,
}) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 mx-auto mb-4">
            {icon}
          </div>
          <h3 className="text-white font-semibold text-center mb-1">{title}</h3>
          <p className="text-slate-400 text-sm text-center mb-6">
            {description}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-sm border border-slate-600 text-slate-300 hover:bg-slate-800/60 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all ${confirmClassName}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
