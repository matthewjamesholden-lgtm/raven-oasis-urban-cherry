import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Money, PageTitle, Stat, fieldClass } from "@/components/bits";
import { balanceAt, forecastCash, groupHints, lowsBetween, nextQuarter } from "@/lib/plan/cashflow";
import { balanceIsStale, daysBetween, localToday, paymentStatus, shapeCashflow } from "@/lib/plan/cards";
import { earliestSafeAge, project } from "@/lib/plan/engine";
import { balanceNote, gbp, pct, prettyDate, years } from "@/lib/plan/format";
import { usePlanStore } from "@/lib/plan/store";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const inputs = usePlanStore((s) => s.inputs);
  const balances = usePlanStore((s) => s.balances ?? []);
  const setAccountBalance = usePlanStore((s) => s.setAccountBalance);
  const payments = usePlanStore((s) => s.payments);
  const cards = usePlanStore((s) => s.cards);
  const charges = usePlanStore((s) => s.charges);
  const renewals = usePlanStore((s) => s.renewals);
  const today = localToday();
  const amex = cards.find((card) => card.id === "amex");
  const amexStatus = amex ? paymentStatus(amex, today) : null;
  const amexDueIn = amex?.dueOn ? daysBetween(today, amex.dueOn) : null;
  const showAmex = Boolean(amex?.dueOn && amexStatus !== "Paid" && amexDueIn !== null && amexDueIn <= 7);
  const shaped = useMemo(() => shapeCashflow(payments, cards, charges, today), [payments, cards, charges, today]);

  const base = useMemo(() => project(inputs), [inputs]);
  const cautious = useMemo(() => project({ ...inputs, roi: inputs.cautiousRoi }), [inputs]);
  const poor = useMemo(() => project({ ...inputs, roi: inputs.poorRoi }), [inputs]);
  const safeAge = useMemo(() => earliestSafeAge(inputs), [inputs]);

  const forecast = useMemo(
    () => forecastCash(shaped.payments, inputs.rewardOpen, inputs.ultimateOpen),
    [shaped.payments, inputs.rewardOpen, inputs.ultimateOpen],
  );
  const lines = forecast.lines;
  const quarter = nextQuarter(inputs.asOf);
  const start = balanceAt(lines, quarter.from, inputs.rewardOpen, inputs.ultimateOpen);
  const lows = lowsBetween(lines, quarter.from, quarter.to, start);
  const hints = forecast.hints.filter((hint) => hint.date >= quarter.from && hint.date < quarter.to);
  const byMonth = groupHints(hints);

  const chart = base.rows
    .filter((r) => r.period % 6 === 0 && r.age <= 70)
    .map((r) => ({
      age: Math.round(r.age * 10) / 10,
      Accessible: Math.round(r.accessible),
      Pension: Math.round(r.pension),
    }));

  const dueRenewals = renewals.filter(
    (r) => r.status === "open" && r.startComparing && r.startComparing <= inputs.asOf,
  );
  const short = !base.holds;
  const [chartReady, setChartReady] = useState(false);
  useEffect(() => setChartReady(true), []);

  return (
    <div>
      <PageTitle
        kicker="Saved in the app"
        title="The plan, on one screen"
        lede={
          safeAge
            ? `${years(safeAge)} is the earliest age that keeps the income going and stays above ${gbp(inputs.safety)}. ${years(inputs.retirementAge)} does not.`
            : `${years(inputs.retirementAge)} does not keep the income going through 59.`
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="Age that holds"
          value={safeAge ? years(safeAge) : "After 62"}
          hint={short ? `${years(inputs.retirementAge)} runs out before 59` : `Chosen age ${years(inputs.retirementAge)}`}
          tone="pine"
        />
        <Stat
          label="ISA, Trading 212 and Copperpot"
          value={gbp(base.potAtRetirement)}
          hint={`At ${years(inputs.retirementAge)}. Not the pension, and not the ${gbp(base.targetYearIncome)} income target.`}
          tone="pine"
        />
        <Stat
          label="Lowest pot, 58–59"
          value={gbp(base.lowestAccessible58to59)}
          hint={short ? "Income stops, or the pot is under the floor" : `Above the ${gbp(inputs.safety)} floor, income still paid`}
          tone={short ? "clay" : "pine"}
        />
      </section>

      {short ? (
        <p className="mt-3 rounded-card border border-line bg-clay-soft px-4 py-3 text-sm text-clay">
          {years(inputs.retirementAge)} does not hold.
          {base.incomePaid58to59
            ? ` The accessible pot dips to ${gbp(base.lowestAccessible58to59)} around age ${years(base.lowestAge58to59)}.`
            : ` The draw stops during the year you turn 58. The ${gbp(base.lowestAccessible58to59)} left is what remains after the income has already stopped, so it is not spare.`}{" "}
          {safeAge
            ? `The income keeps being paid, and the pot stays above ${gbp(inputs.safety)}, from ${years(safeAge)}.`
            : `It does not do both before age 62 on these rates.`}
        </p>
      ) : (
        <p className="mt-3 rounded-card border border-line bg-moss px-4 py-3 text-sm text-pine">
          The {gbp(inputs.safety)} floor holds at {years(inputs.retirementAge)}, and the income is still being paid through 59.
          {safeAge && safeAge < inputs.retirementAge ? ` The earliest age that does both is ${years(safeAge)}.` : ""}
        </p>
      )}

      {showAmex && amex?.dueOn ? (
        <p className="mt-3 rounded-card border border-line bg-clay-soft px-4 py-3 text-sm text-clay">
          Amex is {amexStatus === "Late" ? "late" : "due"} on {prettyDate(amex.dueOn)}. It is paid by hand
          {amex.statementBalance ? `, statement ${gbp(amex.statementBalance, 2)}` : ""}.
        </p>
      ) : null}

      <p className="mt-3 max-w-2xl text-sm text-muted">
        The {gbp(base.potAtRetirement)} is ISA, Trading 212 and Copperpot at {years(inputs.retirementAge)}. Today those three are{" "}
        {gbp(inputs.isa + inputs.trading + inputs.copperpot)}. Loans in this plan are Mat {gbp(Math.abs(inputs.matLoan))} and Han {gbp(Math.abs(inputs.hanLoan))}, mortgage {gbp(Math.abs(inputs.mortgage))}. Once those are cleared, the payments are added in. The pension at that age is {gbp(base.pensionAtRetirement)}, and it is not inside that figure. {gbp(base.targetYearIncome)} a year is the income target, not the pot.
      </p>

      <section className="mt-8">
        <h2 className="font-display text-2xl tracking-tight">Balances</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          The bank rows are dated by Aureli. Lloyds is the Halifax credit card. The ones underneath are yours to type, and saving one updates the plan and keeps the time.
        </p>
        <h3 className="mt-4 text-sm font-semibold tracking-wide text-muted uppercase">From the bank</h3>
        <ul className="mt-2 space-y-2">
          {balances
            .filter((row) => row.source === "aureli")
            .map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-2 rounded-2xl border border-line bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-ink">
                    {row.name}
                    <span className="font-normal text-muted"> · {row.provider}</span>
                  </p>
                  <p className="text-sm text-muted">{balanceNote(row.source, row.checkedOn, row.changedOn, row.notedAt, row.amount)}</p>
                </div>
                <p className="font-display text-2xl tracking-tight sm:text-right">
                  <Money value={row.owed ? -(row.amount ?? 0) : (row.amount ?? 0)} digits={2} />
                  <span className="mt-0.5 block text-xs font-sans font-normal tracking-normal text-muted">
                    {row.owed ? "owed" : "in the account"}
                  </span>
                </p>
              </li>
            ))}
        </ul>
        <h3 className="mt-6 text-sm font-semibold tracking-wide text-muted uppercase">By hand</h3>
        <ul className="mt-2 space-y-2">
          {balances
            .filter((row) => row.source === "manual")
            .map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-2 rounded-2xl border border-line bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-ink">
                    {row.name}
                    <span className="font-normal text-muted"> · {row.provider}</span>
                  </p>
                  <p className="text-sm text-muted">{balanceNote(row.source, row.checkedOn, row.changedOn, row.notedAt, row.amount)}</p>
                </div>
                <div className="sm:text-right">
                  <p className="font-display text-2xl tracking-tight">
                    <Money value={row.owed ? -(row.amount ?? 0) : (row.amount ?? 0)} digits={2} />
                  </p>
                  <ManualAmount name={row.name} amount={row.amount} owed={row.owed} onSave={(next) => setAccountBalance(row.id, next)} />
                </div>
              </li>
            ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl tracking-tight">Next three months</h2>
        <p className="mt-1 text-sm text-muted">
          These are the unpaid planned spends from 2 November to March, on their real dates. A transfer is suggested on the 30th before a month that would take Ultimate overdrawn, and only for what Reward can spare. Card bills stay on the date they leave. They are not moved to the 2nd, and a £2,200 bill is not added.
        </p>
        {lows.ultimate < -100 ? (
          <p className="mt-3 rounded-card border border-line bg-clay-soft px-4 py-3 text-sm text-clay">
            Ultimate still reaches {gbp(lows.ultimate)} and the two accounts together reach {gbp(lows.total)}. There is no transfer on 30 December, because Mat is paid on 31 December and Reward has nothing to spare the day before.
          </p>
        ) : null}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Lowest Reward" value={gbp(lows.reward, 0)} />
          <Stat label="Lowest Ultimate" value={gbp(lows.ultimate, 0)} tone={lows.ultimate < 0 ? "clay" : "ink"} />
          <Stat label="Lowest together" value={gbp(lows.total, 0)} tone={lows.total < 0 ? "clay" : "pine"} />
        </div>
        <ul className="mt-4 space-y-2">
          {byMonth.length === 0 ? (
            <li className="text-sm text-muted">No transfer needed to keep Ultimate in credit over this window.</li>
          ) : (
            byMonth.map((row) => (
              <li key={row.month} className="flex items-baseline justify-between gap-4 rounded-2xl border border-line bg-card px-4 py-3">
                <span className="text-sm text-muted">
                  Move from Reward to Ultimate on {prettyDate(hints.find((hint) => hint.date.startsWith(row.month))?.date ?? `${row.month}-30`)}
                </span>
                <span className="font-display text-xl">{gbp(row.amount)}</span>
              </li>
            ))
          )}
        </ul>
        <Link to="/cashflow" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-pine">
          Open the cashflow
        </Link>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-card p-4">
          <h2 className="font-display text-2xl tracking-tight">Cards</h2>
          <p className="mt-1 text-sm text-muted">
            Tesco and Amex owed now. {shaped.note}
          </p>
          <p className="font-display mt-4 text-3xl">{gbp((balances.find((row) => row.id === "tesco")?.amount ?? 0) + (balances.find((row) => row.id === "amex")?.amount ?? 0))}</p>
          <p className="text-sm text-muted">owed on Tesco and Amex</p>
          <p className="text-sm text-muted">
            Tesco {gbp(balances.find((row) => row.id === "tesco")?.amount ?? 0)} · Amex{" "}
            {gbp(balances.find((row) => row.id === "amex")?.amount ?? 0)} · Lloyds{" "}
            {gbp(balances.find((row) => row.id === "lloyds")?.amount ?? 0)}
            {balanceIsStale(balances.find((row) => row.id === "lloyds")?.changedOn ?? null, today) ? ". Balance may be stale." : ", last changed 24 Oct"}
          </p>
        </div>
        <div className="rounded-card border border-line bg-card p-4">
          <h2 className="font-display text-2xl tracking-tight">Worth a look</h2>
          {dueRenewals.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No renewal has reached its “start comparing” date yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {dueRenewals.map((r) => (
                <li key={r.id} className="text-sm">
                  <span className="font-semibold">{r.item}</span>
                  <span className="text-muted"> · {r.action}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/inputs" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-pine">
            Renewals and inputs
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl tracking-tight">Same plan, three rates</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Base growth is {pct(inputs.roi)}. The pot at {years(inputs.retirementAge)} is ISA, Trading 212 and Copperpot, and it falls when growth is worse. A rate that runs out before 59 is a fail. The leftover after the draw stops is not a bigger pot.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["Base", inputs.roi, base],
            ["Cautious", inputs.cautiousRoi, cautious],
            ["Poor", inputs.poorRoi, poor],
          ].map(([name, rate, result]) => {
            const row = result as typeof base;
            const under = !row.holds;
            return (
              <article key={String(name)} className="rounded-card border border-line bg-card p-4">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  {String(name)} · {pct(Number(rate))}
                </p>
                <p className="mt-3 text-sm text-muted">Pot at {years(inputs.retirementAge)}</p>
                <p className="font-display text-2xl">{gbp(row.potAtRetirement)}</p>
                <p className="mt-3 text-sm text-muted">{under ? "Through age 59" : "Lowest at 58–59"}</p>
                <p className={`font-display text-2xl ${under ? "text-clay" : "text-pine"}`}>
                  {under ? "Runs out" : gbp(row.lowestAccessible58to59)}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-card border border-line bg-card p-4">
        <h2 className="font-display text-2xl tracking-tight">Pot to age 70</h2>
        <div className="mt-4 h-64 w-full">
          {chartReady ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="age" tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                width={40}
              />
              <Tooltip
                formatter={(value) => gbp(Number(value ?? 0))}
                labelFormatter={(label) => `Age ${label}`}
              />
              <Line type="monotone" dataKey="Accessible" stroke="var(--color-pine)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Pension" stroke="var(--color-ink)" strokeWidth={2} dot={false} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function ManualAmount({
  name,
  amount,
  owed,
  onSave,
}: {
  name: string;
  amount: number | null;
  owed: boolean;
  onSave: (next: number) => void;
}) {
  const [text, setText] = useState(amount == null ? "" : String(amount));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(amount == null ? "" : String(amount));
  }, [amount, focused]);
  return (
    <label className="text-sm text-muted sm:w-44">
      {owed ? "Owed" : "Balance"}
      <input
        className={`${fieldClass} mt-1`}
        inputMode="decimal"
        aria-label={`${owed ? "Owed" : "Balance"} for ${name}`}
        value={text}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          const next = Number(text.replace(/[£,\s]/g, ""));
          if (text.trim() === "" || !Number.isFinite(next)) {
            setText(amount == null ? "" : String(amount));
            return;
          }
          onSave(Math.abs(next));
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        onChange={(event) => setText(event.target.value)}
      />
    </label>
  );
}
