import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle } from "@/components/bits";

export const Route = createFileRoute("/uat")({ component: UatPage });

const STEPS = [
  {
    title: "Use the saved plan",
    detail: "Do not reset. Open Plan. The balances, cashflow and trips should be the ones saved on this account, not a blank example.",
    to: "/",
    label: "Open Plan",
  },
  {
    title: "Retirement at 48 does not hold",
    detail: "On Plan, the note under the ages must not say that 48 still holds. It should say the current age does not hold because the income stops, and give a later age that does.",
    to: "/",
    label: "Check the retirement note",
  },
  {
    title: "Save a balance by hand",
    detail: "On Plan, change Trading 212 and leave the field. The line should say it was saved, with today’s date and a time. That change is saved on the account, so the next visit sees it too.",
    to: "/",
    label: "Edit Trading 212",
  },
  {
    title: "Cashflow starts from the bank",
    detail: "Open Cashflow. The opening line should name the Reward and Ultimate balances from the saved plan. Add a row called UAT test, then delete that row.",
    to: "/cashflow",
    label: "Open Cashflow",
  },
  {
    title: "Add a trip, then delete it",
    detail: "Open Trips. The old holiday grid must not be on the page. Add a trip, then use its Delete button. It should leave the list.",
    to: "/trips",
    label: "Open Trips",
  },
  {
    title: "Cards show when the balance was stored",
    detail: "Open Cards. Tesco, Amex and Lloyds should each show an amount and a date. Lloyds is the Halifax credit card, not a second blank balance.",
    to: "/cards",
    label: "Open Cards",
  },
] as const;

function UatPage() {
  return (
    <div>
      <PageTitle
        kicker="For a person or a Grok bot"
        title="Test the plan"
        lede="Work through the real screens. A bot signed in on this account sees the same figures you do. Nothing here replaces them with an example."
      />
      <ol className="mt-6 space-y-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="rounded-card border border-line bg-card p-4">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Step {index + 1}</p>
            <h2 className="font-display mt-1 text-2xl">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p>
            <Link to={step.to} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-pine">
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
