"use client";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="card max-w-sm w-full p-6">
        <h3 className="font-semibold text-lg" style={{ color: "var(--teal)" }}>
          {title}
        </h3>
        <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
          {message}
        </p>
        <div className="mt-6 flex gap-3">
          <button className="btn btn-outline flex-1 py-2.5" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`btn flex-1 py-2.5 ${danger ? "btn-rose" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
