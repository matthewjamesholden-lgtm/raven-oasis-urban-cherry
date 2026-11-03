import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Money, PageTitle, buttonClass, fieldClass, ghostClass } from "@/components/bits";
import { runCash } from "@/lib/plan/cashflow";
import { localToday, shapeCashflow } from "@/lib/plan/cards";
import { monthLabel } from "@/lib/plan/format";
import { usePlanStore } from "@/lib/plan/store";
import type { AccountId, Payment } from "@/lib/plan/types";

export const Route = createFileRoute("/cashflow")({ component: CashflowPage });

function CashflowPage() {
  const inputs = usePlanStore((s) => s.inputs);
  const payments = usePlanStore((s) => s.payments);
  const cards = usePlanStore((s) => s.cards);
  const charges = usePlanStore((s) => s.charges);
  const trips = usePlanStore((s) => s.trips);
  const today = localToday();
  const shaped = useMemo(() => shapeCashflow(payments, cards, charges, today), [payments, cards, charges, today]);
  const upsert = usePlanStore((s) => s.upsertPayment);
  const remove = usePlanStore((s) => s.removePayment);
  const [showOld, setShowOld] = useState(false);
  const [draft, setDraft] = useState({
    item: "",
    amount: "",
    account: "ultimate" as AccountId,
    date: inputs.asOf,
    tripId: "",
  });

  const lines = useMemo(
    () => runCash(shaped.payments, inputs.rewardOpen, inputs.ultimateOpen),
    [shaped.payments, inputs.rewardOpen, inputs.ultimateOpen],
  );

  const cutoff = shiftDays(inputs.asOf, -30);
  const visible = lines.filter((line) => showOld || line.status !== "actual" || line.date >= cutoff);
  const hidden = lines.length - visible.length;
  const lowest = lines.reduce((min, line) => Math.min(min, line.total), Number.POSITIVE_INFINITY);

  const groups: { month: string; rows: typeof visible }[] = [];
  for (const line of visible) {
    const month = line.date.slice(0, 7);
    const last = groups[groups.length - 1];
    if (!last || last.month !== month) groups.push({ month, rows: [line] });
    else last.rows.push(line);
  }

  return (
    <div>
      <PageTitle
        kicker="Date order"
        title="Cashflow"
        lede="Starts from the Aureli balances on 2 Nov. October is already in those balances, and so are the November bills that left today: mortgage, both loans, Lloyds, energy, life cover and the service plan. They are not listed again."
      />
      <p className="mb-4 text-sm text-muted">{shaped.note}</p>

      <p className="mb-4 text-sm text-muted">
        Lowest combined balance on this list:{" "}
        <span className="font-semibold text-ink">
          <Money value={Number.isFinite(lowest) ? lowest : 0} digits={2} />
        </span>
        . Opening balances are the bank on 2 Nov: Reward <Money value={inputs.rewardOpen} digits={2} /> and Ultimate{" "}
        <Money value={inputs.ultimateOpen} digits={2} />.
      </p>

      <form
        className="mb-6 grid gap-3 rounded-card border border-line bg-card p-4 sm:grid-cols-6"
        onSubmit={(event) => {
          event.preventDefault();
          const amount = Number(draft.amount);
          if (!draft.item || !draft.date || Number.isNaN(amount)) return;
          upsert({
            id: `pay-${Date.now()}`,
            item: draft.item,
            amount,
            account: draft.account,
            date: draft.date,
            status: "estimate",
            tripId: draft.tripId || undefined,
          });
          setDraft({ ...draft, item: "", amount: "" });
        }}
      >
        <label className="sm:col-span-2 text-sm text-muted">
          Item
          <input className={`${fieldClass} mt-1`} value={draft.item} onChange={(e) => setDraft({ ...draft, item: e.target.value })} />
        </label>
        <label className="text-sm text-muted">
          Amount
          <input className={`${fieldClass} mt-1`} inputMode="decimal" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} placeholder="-200" />
        </label>
        <label className="text-sm text-muted">
          Account
          <select className={`${fieldClass} mt-1`} value={draft.account} onChange={(e) => setDraft({ ...draft, account: e.target.value as AccountId })}>
            <option value="ultimate">Ultimate</option>
            <option value="reward">Reward</option>
          </select>
        </label>
        <label className="text-sm text-muted">
          Date
          <input className={`${fieldClass} mt-1`} type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
        </label>
        <div className="flex items-end">
          <button className={`${buttonClass} w-full`} type="submit" aria-label="Add cashflow row">
            Add
          </button>
        </div>
        <label className="sm:col-span-3 text-sm text-muted">
          Trip, if this is holiday spending
          <select className={`${fieldClass} mt-1`} value={draft.tripId} onChange={(e) => setDraft({ ...draft, tripId: e.target.value })}>
            <option value="">Everyday</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.code} · {trip.place}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{hidden > 0 ? `${hidden} paid rows hidden` : "Nothing paid and old enough to hide"}</p>
        <button className={ghostClass} type="button" onClick={() => setShowOld((v) => !v)}>
          {showOld ? "Hide old paid rows" : "Show history"}
        </button>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.month}>
            <h2 className="font-display text-xl">{monthLabel(`${group.month}-01`)}</h2>
            <ul className="mt-2 divide-y divide-line overflow-hidden rounded-card border border-line bg-card">
              {group.rows.map((line) => (
                <CashRow key={line.id} line={line} onChange={upsert} onRemove={remove} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function CashRow({
  line,
  onChange,
  onRemove,
}: {
  line: Payment & { reward: number; ultimate: number; total: number };
  onChange: (payment: Payment) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="grid grid-cols-[1fr_auto] gap-2 px-3 py-3 sm:grid-cols-[11rem_1fr_6rem_6rem_6rem_auto] sm:items-center">
      <div className="text-sm text-muted">
        <input
          className={fieldClass}
          type="date"
          aria-label={`Date for ${line.item}`}
          value={line.date}
          onChange={(e) => onChange(commit(line, { date: e.target.value }))}
        />
      </div>
      <div>
        <p className={`font-semibold ${line.status === "actual" ? "text-muted line-through" : "text-ink"}`}>{line.item}</p>
        <p className="text-xs text-muted">{line.account === "reward" ? "Reward" : "Ultimate"} · {line.status}</p>
      </div>
      <label className="text-right text-sm font-semibold">
        <span className="sr-only">Amount for {line.item}</span>
        <input
          className={`${fieldClass} text-right`}
          inputMode="decimal"
          aria-label={`Amount for ${line.item}`}
          defaultValue={String(line.amount)}
          key={`${line.id}-${line.amount}`}
          onBlur={(e) => {
            const next = Number(e.target.value.replace(/[£,\s]/g, ""));
            if (!Number.isFinite(next) || next === line.amount) return;
            onChange(commit(line, { amount: next }));
          }}
        />
      </label>
      <p className="hidden text-right text-sm sm:block">
        <span className="text-muted">R </span>
        <Money value={line.reward} digits={0} />
      </p>
      <p className="hidden text-right text-sm sm:block">
        <span className="text-muted">U </span>
        <Money value={line.ultimate} digits={0} />
      </p>
      <div className="col-span-2 flex justify-end gap-2 sm:col-span-1">
        <button
          type="button"
          className={ghostClass}
          onClick={() => onChange(commit(line, { status: line.status === "actual" ? "estimate" : "actual" }))}
        >
          {line.status === "actual" ? "Undo" : "Paid"}
        </button>
        <button type="button" className={ghostClass} aria-label={`Delete ${line.item}`} onClick={() => onRemove(line.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

function commit(line: Payment & { reward: number; ultimate: number; total: number }, patch: Partial<Payment>): Payment {
  return {
    id: line.id,
    date: patch.date ?? line.date,
    item: line.item,
    amount: patch.amount ?? line.amount,
    account: line.account,
    status: patch.status ?? line.status,
    tripId: line.tripId,
  };
}

function shiftDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}
