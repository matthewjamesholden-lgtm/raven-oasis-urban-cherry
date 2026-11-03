import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Money, PageTitle } from "@/components/bits";
import { project } from "@/lib/plan/engine";
import { gbp, years } from "@/lib/plan/format";
import { usePlanStore } from "@/lib/plan/store";

export const Route = createFileRoute("/projection")({ component: ProjectionPage });

function ProjectionPage() {
  const inputs = usePlanStore((s) => s.inputs);
  const result = useMemo(() => project(inputs), [inputs]);

  const yearly = result.rows.filter((row, index, all) => {
    if (row.period === 0) return true;
    const prev = all[index - 1];
    return Math.floor(row.age) !== Math.floor(prev.age) && row.age <= 70;
  });

  return (
    <div>
      <PageTitle
        kicker="Held in the app"
        title="Projection"
        lede={`Loans start at ${gbp(Math.abs(inputs.matLoan + inputs.hanLoan))} (Mat ${gbp(Math.abs(inputs.matLoan))}, Han ${gbp(Math.abs(inputs.hanLoan))}). The mortgage starts at ${gbp(Math.abs(inputs.mortgage))}. Income glides from ${gbp(result.fullYearIncome)} a year at 68 toward ${gbp(inputs.maxYearIncome)}. Loans clear around ${result.loanClearAge ? years(result.loanClearAge) : "—"}, the mortgage around ${result.mortgageClearAge ? years(result.mortgageClearAge) : "—"}.`}
      />

      <div className="overflow-x-auto rounded-card border border-line bg-card">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs tracking-wide text-muted uppercase">
              {["Age", "Date", "Loans", "Mortgage", "Copperpot", "Investments", "Pension", "Accessible"].map((h) => (
                <th key={h} className="px-3 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yearly.map((row) => (
              <tr key={row.period} className="border-b border-line last:border-0">
                <td className="px-3 py-2 font-semibold">{years(row.age)}</td>
                <td className="px-3 py-2 text-muted">{row.date}</td>
                <td className="px-3 py-2"><Money value={row.loan} /></td>
                <td className="px-3 py-2"><Money value={row.mortgage} /></td>
                <td className="px-3 py-2"><Money value={row.copperpot} /></td>
                <td className="px-3 py-2"><Money value={row.investment} /></td>
                <td className="px-3 py-2"><Money value={row.pension} /></td>
                <td className="px-3 py-2 font-semibold"><Money value={row.accessible} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
