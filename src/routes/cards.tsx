import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Money, PageTitle, buttonClass, fieldClass, ghostClass } from "@/components/bits";
import { BANK_PULLED_AT, BANK_ROWS } from "@/lib/plan/bank-import";
import {
  balanceIsStale,
  everyday,
  guessCategory,
  isAbroad,
  localToday,
  merchantKey,
  monthOf,
  paymentStatus,
  payoff,
  projectStatement,
  shapeCashflow,
  tripForDate,
  weekRange,
} from "@/lib/plan/cards";
import { balanceNote, gbp, prettyDate, prettyStamp } from "@/lib/plan/format";
import { usePlanStore } from "@/lib/plan/store";
import { CATEGORIES, type CardCharge } from "@/lib/plan/types";

export const Route = createFileRoute("/cards")({ component: CardsPage });

function CardsPage() {
  const cards = usePlanStore((s) => s.cards);
  const balances = usePlanStore((s) => s.balances ?? []);
  const charges = usePlanStore((s) => s.charges);
  const trips = usePlanStore((s) => s.trips);
  const inputs = usePlanStore((s) => s.inputs);
  const payments = usePlanStore((s) => s.payments);
  const rules = usePlanStore((s) => s.merchantRules);
  const dismissed = usePlanStore((s) => s.dismissedBankIds);
  const pulled = usePlanStore((s) => s.chargesPulledAt);
  const updateCard = usePlanStore((s) => s.updateCard);
  const upsert = usePlanStore((s) => s.upsertCharge);
  const remove = usePlanStore((s) => s.removeCharge);
  const remember = usePlanStore((s) => s.rememberMerchant);
  const importCharges = usePlanStore((s) => s.importCharges);
  const today = localToday();
  const month = monthOf(today);
  const week = weekRange(today);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    date: today,
    cardId: "tesco",
    merchant: "",
    amount: "",
    category: "Groceries",
    tripId: "",
  });

  useEffect(() => {
    if (pulled === BANK_PULLED_AT) return;
    const incoming = BANK_ROWS.filter((row) => !dismissed.includes(row.id)).map((row) => {
      const existing = charges.find((charge) => charge.bankId === row.id);
      const rule = rules.find((item) => item.merchant === merchantKey(row.merchant));
      const category = existing?.categoryLocked ? existing.category : (rule?.category ?? guessCategory(row.merchant, row.detail));
      const abroad = isAbroad(row.detail);
      const tripId = existing?.tripLocked ? existing.tripId : abroad || category === "Travel" ? tripForDate(trips, row.date, category) : undefined;
      const charge: CardCharge = {
        id: existing?.id ?? `bank-${row.id}`,
        bankId: row.id,
        date: row.date,
        cardId: row.cardId,
        merchant: row.merchant,
        detail: row.detail,
        amount: row.amount,
        pending: row.pending,
        category,
        tripId,
        abroad,
        savedAt: existing?.savedAt ?? BANK_PULLED_AT,
        categoryLocked: existing?.categoryLocked,
        tripLocked: existing?.tripLocked,
      };
      return charge;
    });
    importCharges([...charges.filter((charge) => !charge.bankId), ...incoming], BANK_PULLED_AT);
  }, [pulled, charges, dismissed, rules, trips, importCharges]);

  const monthCharges = charges.filter((charge) => charge.date.startsWith(month));
  const everydayMonth = monthCharges.filter(everyday);
  const tripMonth = monthCharges.filter((charge) => charge.tripId);
  const monthTotal = everydayMonth.reduce((sum, charge) => sum + charge.amount, 0);
  const weekTotal = everydayMonth.filter((charge) => charge.date >= week.from && charge.date <= week.to).reduce((sum, charge) => sum + charge.amount, 0);
  const tripTotal = tripMonth.reduce((sum, charge) => sum + charge.amount, 0);
  const shaped = useMemo(() => shapeCashflow(payments, cards, charges, today), [payments, cards, charges, today]);
  const dayOfMonth = Number(today.slice(8));
  const daysInMonth = new Date(Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)), 0)).getUTCDate();
  const projectedMonth = (monthTotal / Math.max(1, dayOfMonth)) * daysInMonth;
  const over = projectedMonth > inputs.cardBudget;

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const charge of everydayMonth) map.set(charge.category, (map.get(charge.category) ?? 0) + charge.amount);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [everydayMonth]);
  const byTrip = useMemo(() => {
    const map = new Map<string, number>();
    for (const charge of tripMonth) map.set(charge.tripId ?? "Trip", (map.get(charge.tripId ?? "Trip") ?? 0) + charge.amount);
    return [...map.entries()];
  }, [tripMonth]);

  return (
    <div>
      <PageTitle
        kicker="Tesco, Amex, Lloyds"
        title="Cards"
        lede="Charges are saved in the app, so the same list shows on every device. Tesco and Amex come from the bank. Lloyds is not on that feed yet."
      />
      <p className="mb-4 text-sm text-muted">
        {prettyDate(`${month}-01`).replace(/^\d+\s/, "")} everyday spending{" "}
        <span className="font-semibold text-ink">{gbp(monthTotal, 2)}</span> of {gbp(inputs.cardBudget)}. This week{" "}
        <span className="font-semibold text-ink">{gbp(weekTotal, 2)}</span> of {gbp(inputs.weekSpend)}. Trip spending{" "}
        <span className="font-semibold text-ink">{gbp(tripTotal, 2)}</span>, from the holiday pot, not the everyday budget.
      </p>
      {over ? (
        <p className="mb-4 rounded-card border border-line bg-clay-soft px-4 py-3 text-sm text-clay">
          Projected everyday spending this month is {gbp(projectedMonth, 2)}, over the {gbp(inputs.cardBudget)} card budget.
        </p>
      ) : null}
      <p className="mb-4 text-sm text-muted">
        Bank charges pulled {prettyStamp(BANK_PULLED_AT)}. {shaped.note}
      </p>

      <div className="grid gap-3 lg:grid-cols-3">
        {cards.map((card) => {
          const watched = balances.find((row) => row.id === card.id);
          const owed = watched?.amount ?? card.balance;
          const view = projectStatement(card, charges, today);
          const status = paymentStatus(card, today);
          const clear = card.id === "lloyds" ? payoff(owed, card.apr, card.monthlyPayment, today) : null;
          const stale = balanceIsStale(watched?.changedOn ?? null, today);
          const paysFrom = card.payMethod === "hand" ? "Paid by hand" : card.payMethod === "ultimate" ? "From Ultimate" : "Direct debit from Ultimate";
          return (
            <article key={card.id} className="rounded-card border border-line bg-card p-4">
              <h2 className="font-display text-2xl">{card.name}</h2>
              <p className="text-sm text-muted">{paysFrom}</p>
              <p className="mt-3 font-display text-3xl tracking-tight">
                <Money value={-owed} digits={2} />
              </p>
              <p className="text-sm text-muted">
                {watched ? balanceNote(watched.source, watched.checkedOn, watched.changedOn, watched.notedAt, watched.amount) : "Balance not stored"}
              </p>
              {stale ? <p className="mt-2 text-sm text-clay">Balance may be stale. It has not changed for more than 35 days.</p> : null}
              {card.id !== "lloyds" ? (
                <p className="mt-3 text-sm text-muted">
                  Spent this statement {gbp(view.spent, 2)}. Projected statement {gbp(view.projected, 2)}
                  {view.known ? "" : ". Statement date is not known, so this runs to the end of the month"}.
                </p>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  {card.apr > 0 ? `APR ${(card.apr * 100).toFixed(2)}% is included. ` : "No interest is included until you enter the APR. "}
                  {clear === null
                    ? "Add a payment to see a clear date."
                    : clear.months === Infinity
                      ? "That payment does not cover the interest."
                      : `Clears ${prettyDate(clear.date ?? today)}, about ${clear.months} months. The £${card.monthlyPayment} then goes to ${card.redirectTo === "loan" ? "the loan" : "the investment"}.`}
                </p>
              )}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Field label="Statement date" value={card.statementOn ?? ""} type="date" onChange={(statementOn) => updateCard(card.id, { statementOn: statementOn || null })} />
                <Field label="Due date" value={card.dueOn ?? ""} type="date" onChange={(dueOn) => updateCard(card.id, { dueOn: dueOn || null })} />
                <Field label="Statement balance" value={card.statementBalance ?? ""} onChange={(value) => updateCard(card.id, { statementBalance: value === "" ? null : Number(value) })} />
                <Field label="Minimum" value={card.minimum ?? ""} onChange={(value) => updateCard(card.id, { minimum: value === "" ? null : Number(value) })} />
                <Field label="Amount paid" value={card.amountPaid ?? ""} onChange={(value) => updateCard(card.id, { amountPaid: value === "" ? null : Number(value) })} />
                <Field label="Date paid" value={card.datePaid ?? ""} type="date" onChange={(datePaid) => updateCard(card.id, { datePaid: datePaid || null })} />
                {card.id === "lloyds" ? (
                  <>
                    <Field label="APR %" value={card.apr ? card.apr * 100 : ""} onChange={(value) => updateCard(card.id, { apr: (Number(value) || 0) / 100 })} />
                    <Field label="Paid / month" value={card.monthlyPayment || ""} onChange={(value) => updateCard(card.id, { monthlyPayment: Number(value) || 0 })} />
                  </>
                ) : null}
              </div>
              <p className="mt-2 text-sm">
                {status ? <span className="font-semibold">{status}</span> : <span className="text-muted">Due date not known</span>}
                {card.id === "amex" ? <span className="text-muted"> · paid by hand</span> : null}
              </p>
              {card.id === "lloyds" ? (
                <label className="mt-2 block text-sm text-muted">
                  When it clears, the £400 goes to
                  <select className={`${fieldClass} mt-1`} value={card.redirectTo} onChange={(e) => updateCard(card.id, { redirectTo: e.target.value as "loan" | "investment" })}>
                    <option value="investment">Investment</option>
                    <option value="loan">The loan</option>
                  </select>
                </label>
              ) : null}
            </article>
          );
        })}
      </div>

      <form
        className="mt-6 grid gap-3 rounded-card border border-line bg-card p-4 sm:grid-cols-6"
        onSubmit={(event) => {
          event.preventDefault();
          const amount = Number(draft.amount);
          if (!draft.merchant || !draft.date || !(amount > 0)) return;
          const now = new Date().toISOString();
          upsert({
            id: editing ?? `chg-${Date.now()}`,
            date: draft.date,
            cardId: draft.cardId,
            merchant: draft.merchant,
            amount,
            category: draft.category,
            tripId: draft.tripId || undefined,
            savedAt: now,
            categoryLocked: true,
            tripLocked: true,
          });
          if (draft.category) remember(merchantKey(draft.merchant), draft.category);
          setEditing(null);
          setDraft({ ...draft, merchant: "", amount: "" });
        }}
      >
        <label className="sm:col-span-2 text-sm text-muted">
          Merchant
          <input className={`${fieldClass} mt-1`} value={draft.merchant} onChange={(e) => setDraft({ ...draft, merchant: e.target.value })} />
        </label>
        <label className="text-sm text-muted">
          Amount
          <input className={`${fieldClass} mt-1`} inputMode="decimal" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} />
        </label>
        <label className="text-sm text-muted">
          Card
          <select className={`${fieldClass} mt-1`} value={draft.cardId} onChange={(e) => setDraft({ ...draft, cardId: e.target.value })}>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>{card.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-muted">
          Category
          <select className={`${fieldClass} mt-1`} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-muted">
          Date
          <input className={`${fieldClass} mt-1`} type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
        </label>
        <label className="sm:col-span-3 text-sm text-muted">
          Trip
          <select className={`${fieldClass} mt-1`} value={draft.tripId} onChange={(e) => setDraft({ ...draft, tripId: e.target.value })}>
            <option value="">Everyday</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>{trip.code} · {trip.place}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2 sm:col-span-3">
          <button className={buttonClass} type="submit">{editing ? "Save charge" : "Add charge"}</button>
        </div>
      </form>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <aside className="rounded-card border border-line bg-card p-4">
          <h2 className="font-display text-xl">By category</h2>
          {byCategory.length === 0 ? <p className="mt-2 text-sm text-muted">Nothing this month.</p> : (
            <ul className="mt-3 space-y-2">
              {byCategory.map(([category, amount]) => (
                <li key={category} className="flex justify-between text-sm"><span>{category}</span><Money value={amount} digits={2} /></li>
              ))}
            </ul>
          )}
        </aside>
        <aside className="rounded-card border border-line bg-card p-4">
          <h2 className="font-display text-xl">By trip</h2>
          {byTrip.length === 0 ? <p className="mt-2 text-sm text-muted">No trip charges this month.</p> : (
            <ul className="mt-3 space-y-2">
              {byTrip.map(([id, amount]) => (
                <li key={id} className="flex justify-between text-sm">
                  <span>{trips.find((trip) => trip.id === id)?.code ?? "Trip"}</span>
                  <Money value={amount} digits={2} />
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-card border border-line bg-card">
        {charges.length === 0 ? <li className="px-4 py-6 text-sm text-muted">No charges yet.</li> : [...charges].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 80).map((charge) => (
          <li key={charge.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-semibold">
                {charge.merchant}
                {charge.pending ? <span className="ml-2 text-xs font-normal text-muted">Pending</span> : null}
              </p>
              <p className="text-xs text-muted">
                {prettyDate(charge.date)} · {cards.find((card) => card.id === charge.cardId)?.name} · {charge.category}
                {charge.tripId ? ` · ${trips.find((trip) => trip.id === charge.tripId)?.code ?? "Trip"}` : ""}
                {charge.savedAt ? ` · saved ${prettyStamp(charge.savedAt)}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Money value={charge.amount} digits={2} />
              <button className={ghostClass} type="button" onClick={() => {
                setEditing(charge.id);
                setDraft({ date: charge.date, cardId: charge.cardId, merchant: charge.merchant, amount: String(charge.amount), category: charge.category, tripId: charge.tripId ?? "" });
              }}>Edit</button>
              <button className={ghostClass} type="button" aria-label={`Delete ${charge.merchant}`} onClick={() => remove(charge.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="text-sm text-muted">
      {label}
      <input className={`${fieldClass} mt-1`} type={type} inputMode={type === "text" ? "decimal" : undefined} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
