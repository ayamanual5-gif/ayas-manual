/**
 * The original HTML mockup embedded a large base64 JPEG as the logo. Rather than
 * hand-transcribing that binary blob into the codebase (risky to copy correctly
 * and bloats the repo), this is a small on-brand SVG mark using the same motif
 * as the hero illustration. Swap it for a real logo file later by dropping an
 * image into `public/` and rendering it with `next/image` here.
 */
export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="flex-shrink-0"
      style={{ boxShadow: "0 2px 8px rgba(0,80,85,.25)", borderRadius: "9999px" }}
    >
      <circle cx="32" cy="32" r="31" fill="var(--beige-100)" stroke="var(--beige-200)" strokeWidth="1.5" />
      <circle cx="26" cy="27" r="11" fill="none" stroke="var(--teal)" strokeWidth="3" />
      <circle cx="26" cy="27" r="11" fill="var(--teal)" opacity="0.1" />
      <circle cx="40" cy="38" r="8" fill="none" stroke="var(--rose)" strokeWidth="3" />
      <circle cx="40" cy="38" r="8" fill="var(--rose)" opacity="0.15" />
      <path d="M26 27c6 4 11 9 17 13" fill="none" stroke="var(--olive)" strokeWidth="2" strokeDasharray="1 4" strokeLinecap="round" />
    </svg>
  );
}
