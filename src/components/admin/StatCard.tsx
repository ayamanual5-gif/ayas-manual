import Link from "next/link";

export default function StatCard({
  label,
  value,
  href,
  accent = "teal",
}: {
  label: string;
  value: number | string;
  href?: string;
  accent?: "teal" | "rose" | "olive";
}) {
  const content = (
    <div className="card p-6 flex flex-col gap-2 h-full">
      <span className="text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>
        {label}
      </span>
      <span className="text-4xl font-bold" style={{ color: `var(--${accent})` }}>
        {value}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-transform hover:-translate-y-0.5">
        {content}
      </Link>
    );
  }

  return content;
}
