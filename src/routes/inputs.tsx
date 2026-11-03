import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { PageTitle, buttonClass, fieldClass, ghostClass } from "@/components/bits";
import { prettyDate } from "@/lib/plan/format";
import { usePlanStore } from "@/lib/plan/store";

export const Route = createFileRoute("/inputs")({ component: InputsPage });

function InputsPage() {
  const inputs = usePlanStore((s) => s.inputs);
  const setInputs = usePlanStore((s) => s.setInputs);
  const setAccountBalance = usePlanStore((s) => s.setAccountBalance);
  const renewals = usePlanStore((s) => s.renewals);
  const setStatus = usePlanStore((s) => s.setRenewalStatus);
  const saveBalance = (id: string, amount: number) => setAccountBalance(id, Math.abs(amount));

  return (
    <div>
      <PageTitle
        kicker="One place to type"
        title="Inputs"
        lede="Rates, payments and pension income. Balances, the cashflow, trips and renewals are part of this plan too."
      />

      <Section title="Dates and targets">
        <DateField label="Plan date" value={inputs.asOf} onChange={(asOf) => setInputs({ asOf })} />
        <DateField label="Date of birth" value={inputs.dob} onChange={(dob) => setInputs({ dob })} />
        <Num label="Retirement age" value={inputs.retirementAge} onChange={(retirementAge) => setInputs({ retirementAge })} />
        <Num label="Legal pension age" value={inputs.legalAge} onChange={(legalAge) => setInputs({ legalAge })} />
        <Num label="Safety buffer" value={inputs.safety} onChange={(safety) => setInputs({ safety })} />
        <Num label="Income cap / year" value={inputs.maxYearIncome} onChange={(maxYearIncome) => setInputs({ maxYearIncome })} />
      </Section>

      <Section title="Growth">
        <Pct label="Base growth" value={inputs.roi} onChange={(roi) => setInputs({ roi })} />
        <Pct label="Cautious" value={inputs.cautiousRoi} onChange={(cautiousRoi) => setInputs({ cautiousRoi })} />
        <Pct label="Poor" value={inputs.poorRoi} onChange={(poorRoi) => setInputs({ poorRoi })} />
        <Pct label="Loan rate" value={inputs.loanRate} onChange={(loanRate) => setInputs({ loanRate })} />
        <Pct label="Mortgage rate" value={inputs.mortgageRate} onChange={(mortgageRate) => setInputs({ mortgageRate })} />
        <Pct label="Copperpot rate" value={inputs.copperpotRate} onChange={(copperpotRate) => setInputs({ copperpotRate })} />
      </Section>

      <Section title="Balances you type">
        <Num label="Mat loan" value={Math.abs(inputs.matLoan)} onChange={(n) => saveBalance("mat-loan", n)} />
        <Num label="Han loan" value={Math.abs(inputs.hanLoan)} onChange={(n) => saveBalance("han-loan", n)} />
        <Num label="Mortgage" value={Math.abs(inputs.mortgage)} onChange={(n) => saveBalance("mortgage", n)} />
        <Num label="Stocks ISA" value={inputs.isa} onChange={(n) => saveBalance("isa", n)} />
        <Num label="Trading 212" value={inputs.trading} onChange={(n) => saveBalance("trading", n)} />
        <Num label="Copperpot" value={inputs.copperpot} onChange={(n) => saveBalance("copperpot", n)} />
        <Num label="Pension pot" value={inputs.pension} onChange={(n) => saveBalance("pension", n)} />
      </Section>

      <Section title="Monthly amounts">
        <Num label="Loan payment" value={inputs.loanPayment} onChange={(loanPayment) => setInputs({ loanPayment })} />
        <Num label="Mortgage payment" value={inputs.mortgagePayment} onChange={(mortgagePayment) => setInputs({ mortgagePayment })} />
        <Num label="Copperpot / month" value={inputs.savingContribution} onChange={(savingContribution) => setInputs({ savingContribution })} />
        <Num label="Investment" value={inputs.investmentContribution} onChange={(investmentContribution) => setInputs({ investmentContribution })} />
        <Num label="Pension" value={inputs.pensionContribution} onChange={(pensionContribution) => setInputs({ pensionContribution })} />
        <Num label="State pension £ / week" value={inputs.statePensionWeekly} onChange={(statePensionWeekly) => setInputs({ statePensionWeekly })} />
        <Num label="Card budget" value={inputs.cardBudget} onChange={(cardBudget) => setInputs({ cardBudget })} />
        <Num label="Everyday / week" value={inputs.weekSpend} onChange={(weekSpend) => setInputs({ weekSpend })} />
      </Section>

      <Section title="Pension income, yearly, at those ages">
        <Num label="Han Aviva" value={inputs.hanAv} onChange={(hanAv) => setInputs({ hanAv })} />
        <Num label="Han final salary" value={inputs.hanFinal} onChange={(hanFinal) => setInputs({ hanFinal })} />
        <Num label="Mat USS" value={inputs.matUss} onChange={(matUss) => setInputs({ matUss })} />
        <Num label="Mat LGPS" value={inputs.matLgps} onChange={(matLgps) => setInputs({ matLgps })} />
        <Num label="Lump sum at 66" value={inputs.lumpSum} onChange={(lumpSum) => setInputs({ lumpSum })} />
      </Section>

      <h2 className="font-display mt-10 text-2xl">Renewals</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Mentioned once the start date has arrived. As of {prettyDate(inputs.asOf)}. New ones belong in this list, not as separate reminders.
      </p>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-card">
        {renewals.map((renewal) => (
          <li key={renewal.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{renewal.item}</p>
              <p className="text-sm text-muted">
                {renewal.renews ? `Renews ${renewal.renews}` : "Date unknown"}
                {renewal.startComparing ? ` · look from ${prettyDate(renewal.startComparing)}` : ""}
                {renewal.action ? ` · ${renewal.action}` : ""}
              </p>
            </div>
            <button
              type="button"
              className={renewal.status === "done" ? buttonClass : ghostClass}
              onClick={() => setStatus(renewal.id, renewal.status === "done" ? "open" : "done")}
            >
              {renewal.status === "done" ? "Done" : renewal.status === "ask" ? "Still need a date" : "Mark done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return <TextField label={label} value={value} display={(n) => String(n)} parse={(raw) => Number(raw)} onChange={onChange} />;
}

function Pct({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <TextField
      label={label}
      value={value}
      display={(n) => String(Math.round(n * 10000) / 100)}
      parse={(raw) => Number(raw) / 100}
      onChange={onChange}
    />
  );
}

function TextField({
  label,
  value,
  display,
  parse,
  onChange,
}: {
  label: string;
  value: number;
  display: (n: number) => string;
  parse: (raw: string) => number;
  onChange: (n: number) => void;
}) {
  const [text, setText] = useState(() => display(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(Number.isFinite(value) ? display(value) : "");
  }, [value, focused, display]);
  return (
    <label className="text-sm text-muted">
      {label}
      <input
        className={`${fieldClass} mt-1`}
        inputMode="decimal"
        value={text}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          const next = parse(text.replace(/[£,\s]/g, ""));
          if (text.trim() === "" || text === "-" || Number.isNaN(next)) setText(Number.isFinite(value) ? display(value) : "");
          else onChange(next);
        }}
        onChange={(e) => {
          const raw = e.target.value;
          setText(raw);
          if (raw === "" || raw === "-" || raw === "." || raw === "-." || raw.endsWith(".")) return;
          const next = parse(raw.replace(/[£,\s]/g, ""));
          if (Number.isFinite(next)) onChange(next);
        }}
      />
    </label>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-sm text-muted">
      {label}
      <input className={`${fieldClass} mt-1`} type="date" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
