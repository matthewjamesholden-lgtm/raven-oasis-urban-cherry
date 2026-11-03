import { gbp } from "@/lib/plan/format";

export function PageTitle({ kicker, title, lede }: { kicker?: string; title: string; lede?: string }) {
  return (
    <header className="mb-6 max-w-2xl">
      {kicker ? <p className="text-xs font-semibold tracking-widest text-pine uppercase">{kicker}</p> : null}
      <h1 className="font-display mt-1 text-3xl tracking-tight text-ink sm:text-4xl">{title}</h1>
      {lede ? <p className="mt-2 text-base leading-relaxed text-muted">{lede}</p> : null}
    </header>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "ink",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "ink" | "pine" | "clay";
}) {
  const color = tone === "pine" ? "text-pine" : tone === "clay" ? "text-clay" : "text-ink";
  return (
    <div className="rounded-card border border-line bg-card px-4 py-4">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
      <p className={`font-display mt-2 text-3xl tracking-tight ${color}`}>{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

export function Money({ value, digits = 0 }: { value: number; digits?: number }) {
  const tone = value < -0.004 ? "text-clay" : "text-ink";
  return <span className={tone}>{gbp(value, digits)}</span>;
}

export const fieldClass =
  "min-h-11 w-full rounded-xl border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-pine";

export const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-pine px-4 py-2 text-sm font-semibold text-pine-ink hover:opacity-90";

export const ghostClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink hover:bg-paper";
