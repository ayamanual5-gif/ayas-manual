"use client";

import { useToast } from "@/context/ToastContext";

export default function Toast() {
  const { message, visible } = useToast();

  return (
    <div
      className={`toast fixed bottom-5 z-50 px-5 py-3 rounded-full text-sm font-semibold shadow-xl ${
        visible ? "show" : ""
      }`}
      style={{
        insetInlineStart: "50%",
        transform: "translateX(-50%)",
        background: "var(--teal)",
        color: "var(--beige-100)",
      }}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
