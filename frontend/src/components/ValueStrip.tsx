"use client";

import { useLang } from "@/context/LangContext";

export default function ValueStrip() {
  const { t } = useLang();

  const values = [
    {
      key: "value1",
      icon: (
        <path d="M12 21s-7-4.35-9.5-8.5C.7 8.5 2.7 4.5 6.5 4.2c2-.15 3.6 1 5.5 2.9C13.9 5.2 15.5 4.05 17.5 4.2c3.8.3 5.8 4.3 4 8.3C19 16.65 12 21 12 21z" />
      ),
    },
    {
      key: "value2",
      icon: (
        <>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a4 4 0 0 1 8 0v2" />
        </>
      ),
    },
    {
      key: "value3",
      icon: <path d="M2 12h6l2-3 4 6 2-3h6" strokeLinecap="round" strokeLinejoin="round" />,
    },
  ] as const;

  return (
    <section className="text-beige-100" style={{ background: "var(--teal)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid sm:grid-cols-3 gap-5 text-sm">
        {values.map((v) => (
          <div key={v.key} className="flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {v.icon}
            </svg>
            <span>{t(v.key)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
