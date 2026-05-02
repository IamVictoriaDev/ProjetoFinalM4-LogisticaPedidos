import { useEffect, useState } from "react";
import { useToast, type ToastItem } from "../../store/useToast";

export default function Toast() {
  const { toasts, remove } = useToast();
  const [progress, setProgress] = useState<Record<string, number>>({});

  // auto-remove timers per toast (fallback)
  useEffect(() => {
    const timers: { id: string; timer: number }[] = [];
    toasts.forEach((t: ToastItem) => {
      const duration = t.duration ?? 6000;
      const id = window.setTimeout(() => remove(t.id), duration);
      timers.push({ id: t.id, timer: id });
    });
    return () => timers.forEach((x) => clearTimeout(x.timer));
  }, [toasts, remove]);

  // progress updater
  useEffect(() => {
    if (!toasts.length) {
      const tid = window.setTimeout(() => setProgress({}), 0);
      return () => window.clearTimeout(tid);
    }

    const iv = window.setInterval(() => {
      const now = Date.now();
      const next: Record<string, number> = {};
      toasts.forEach((t: ToastItem) => {
        const duration = t.duration ?? 6000;
        const start = t.createdAt ?? now;
        const pct = Math.min(1, Math.max(0, (now - start) / duration));
        next[t.id] = pct;
      });
      setProgress(next);
    }, 100);

    return () => window.clearInterval(iv);
  }, [toasts]);

  if (!toasts.length) return null;

  // show up to 5 latest toasts
  const visible = toasts.slice(-5);

  return (
    <div
      className="fixed right-6 bottom-6 z-50 flex flex-col gap-3"
      role="region"
      aria-live="polite"
    >
      {visible.map((t: ToastItem) => {
        const pct = progress[t.id] ?? 0;
        return (
          <div
            key={t.id}
            className="bg-white shadow-lg rounded-lg px-4 py-3 flex flex-col w-80 toast-enter"
            role="status"
            aria-atomic="true"
            data-testid="toast"
            data-toast-id={t.id}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-700">{t.message}</div>
              <div className="flex items-center gap-3">
                {t.actionLabel && (
                  <button
                    onClick={() => {
                      t.onAction?.();
                      remove(t.id);
                    }}
                    className="text-sm text-brandOrange-600 font-medium"
                  >
                    {t.actionLabel}
                  </button>
                )}
                <button
                  onClick={() => remove(t.id)}
                  aria-label="Fechar"
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="w-full mt-3">
              <div className="h-1 bg-neutral-200 rounded overflow-hidden">
                <div
                  className="h-full bg-brandPurple-600"
                  style={{
                    width: `${(1 - pct) * 100}%`,
                    transition: "width 100ms linear",
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
