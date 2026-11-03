export function gbp(value: number, digits = 0) {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return value < -0.004 ? `−${formatted}` : formatted;
}

export function gbpExact(value: number) {
  return gbp(value, Math.abs(value) < 100 && Math.abs(value % 1) > 0.001 ? 2 : value % 1 === 0 ? 0 : 2);
}

export function years(age: number) {
  return age.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function localDay(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function prettyStamp(iso: string) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return iso;
  return dt.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function balanceNote(
  source: "aureli" | "manual",
  checkedOn: string | null,
  changedOn: string | null,
  notedAt: string | null,
  amount: number | null,
) {
  if (source === "manual") {
    if (amount === null) return "By hand · not entered yet";
    if (notedAt) return `By hand · saved ${prettyStamp(notedAt)}`;
    if (checkedOn) return `In the plan since ${prettyDate(checkedOn)}`;
    return "By hand · not dated";
  }
  if (!checkedOn) return "Aureli · no date stored";
  const checked = prettyDate(checkedOn);
  if (changedOn && changedOn !== checkedOn) {
    return `Aureli · checked ${checked} · same balance since ${prettyDate(changedOn)}`;
  }
  return `Aureli · balance updated ${checked}`;
}

export function monthLabel(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, 1));
  return dt.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function addMonths(iso: string, count: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1 + count, 1));
  const dim = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const day = Math.min(d, dim);
  const yy = first.getUTCFullYear();
  const mm = first.getUTCMonth() + 1;
  return `${yy}-${String(mm).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function pct(rate: number) {
  return `${(rate * 100).toLocaleString("en-GB", { maximumFractionDigits: 2 })}%`;
}
