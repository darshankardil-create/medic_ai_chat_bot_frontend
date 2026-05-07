export default function Toast({ toasts, remove, Icons }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border backdrop-blur-sm transition-all duration-300
            ${
              t.type === "error"
                ? "bg-red-950/90 border-red-800 text-red-200"
                : t.type === "success"
                  ? "bg-emerald-950/90 border-emerald-800 text-emerald-200"
                  : "bg-slate-900/90 border-slate-700 text-slate-200"
            }`}
        >
          <span>{t.msg}</span>
          <button
            onClick={() => remove(t.id)}
            className="opacity-60 hover:opacity-100"
          >
            <Icons.Close />
          </button>
        </div>
      ))}
    </div>
  );
}
