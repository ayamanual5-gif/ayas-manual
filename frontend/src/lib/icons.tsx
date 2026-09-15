import type { JSX } from "react";

export type IconName = "bag" | "scarf" | "flower" | "plant" | "cardigan";

const icons: Record<IconName, JSX.Element> = {
  bag: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M18 26c0-8 6-14 14-14s14 6 14 14" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      <rect x="12" y="26" width="40" height="30" rx="8" fill="currentColor" opacity={0.15} />
      <rect x="12" y="26" width="40" height="30" rx="8" stroke="currentColor" strokeWidth={3} />
      <path d="M16 34h32" stroke="currentColor" strokeWidth={2} strokeDasharray="1 5" strokeLinecap="round" />
    </svg>
  ),
  scarf: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M6 20c6-8 10 8 16 0s10 8 16 0 10 8 16 0" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      <path
        d="M6 34c6-8 10 8 16 0s10 8 16 0 10 8 16 0"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.55}
      />
      <path d="M10 44l-4 10M54 44l4 10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  ),
  flower: (
    <svg viewBox="0 0 64 64" fill="currentColor">
      <circle cx="32" cy="18" r="8" opacity={0.9} />
      <circle cx="46" cy="28" r="8" opacity={0.75} />
      <circle cx="41" cy="44" r="8" opacity={0.6} />
      <circle cx="23" cy="44" r="8" opacity={0.6} />
      <circle cx="18" cy="28" r="8" opacity={0.75} />
      <circle cx="32" cy="32" r="7" fill="var(--beige-100)" stroke="currentColor" strokeWidth={2} />
    </svg>
  ),
  plant: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M22 40h20l-3 16H25z" fill="currentColor" opacity={0.2} stroke="currentColor" strokeWidth={2.5} />
      <path
        d="M32 40V14M32 22c-8-4-14 2-14 2s6 8 14 4M32 28c8-4 14 2 14 2s-6 8-14 4"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  cardigan: (
    <svg viewBox="0 0 64 64" fill="none">
      <path
        d="M20 14l-10 8 6 8 4-3v29h24V27l4 3 6-8-10-8-6 5h-8z"
        fill="currentColor"
        opacity={0.15}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path d="M32 19v37M20 14c0 0 4 6 12 6s12-6 12-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  ),
};

export function ProductIcon({ name, className }: { name: string; className?: string }) {
  const icon = icons[name as IconName] ?? icons.bag;
  return (
    <span className={className} aria-hidden="true">
      {icon}
    </span>
  );
}

export const tintColorVar: Record<string, string> = {
  teal: "var(--teal)",
  rose: "var(--rose)",
  olive: "var(--olive)",
};

export const tintBgVar: Record<string, string> = {
  teal: "rgba(0,80,85,.1)",
  rose: "rgba(190,110,119,.14)",
  olive: "rgba(147,113,47,.14)",
};
