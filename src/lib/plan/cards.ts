import type { CardAccount, CardCharge, Payment, Trip } from "./types";
import { CATEGORIES } from "./types";
import { addMonths } from "./format";

export type PayStatus = "Due" | "Paid" | "Late";

const RULES: [RegExp, (typeof CATEGORIES)[number]][] = [
  [/\btesco petrol\b|\bshell\b|\besso\b|\bbp\b|\bfuel\b|\bpetrol\b|villafranq|gem rochdale/i, "Fuel"],
  [/tesco|sainsbury|asda|aldi|lidl|morrisons|waitrose|co-op|ocado|mercadona|hiperber/i, "Groceries"],
  [/uber|just eat|nandos|mcdonald|greggs|costa|starbucks|pizza|kfc|restaurant|sushi|cafe|grill|wetherspoon/i, "Eating out"],
  [/school|smyths|disney|toy|netball|spond|butlin/i, "Kids"],
  [/ikea|b&q|screwfix|dunelm|home bargain|currys|pepco/i, "Home"],
  [/ryanair|easyjet|airbnb|booking\.com|hotel|holiday|ok mobility|airport|inflight/i, "Travel"],
  [/netflix|spotify|apple|google play|prime|disney\+|sky|ring |starlink|lebara/i, "Subscriptions"],
];

export function merchantKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

export function guessCategory(merchant: string, detail = "") {
  const text = `${merchant} ${detail}`;
  for (const [pattern, category] of RULES) {
    if (pattern.test(text)) return category;
  }
  return "Other";
}

export function isAbroad(detail: string) {
  return /\bESP\b|XATIVA|PALMA|MALLORCA/.test(detail.toUpperCase());
}

export function localToday(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function monthOf(day: string) {
  return day.slice(0, 7);
}

export function weekRange(day: string) {
  const date = new Date(`${day}T00:00:00Z`);
  const weekday = date.getUTCDay() || 7;
  const start = new Date(date);
  start.setUTCDate(date.getUTCDate() - (weekday - 1));
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const iso = (value: Date) => value.toISOString().slice(0, 10);
  return { from: iso(start), to: iso(end) };
}

export function daysBetween(from: string, to: string) {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

export function tripForDate(trips: Trip[], day: string, category: string) {
  if (category === "Fuel") return undefined;
  return trips.find((trip) => trip.from && trip.to && day >= trip.from && day <= trip.to)?.id;
}

export function everyday(charge: CardCharge) {
  return !charge.tripId;
}

export function statementWindow(card: CardAccount, today: string) {
  if (card.statementOn) {
    const end = card.statementOn > today ? card.statementOn : addMonths(card.statementOn, 1);
    const from = addMonths(end, -1);
    return { from, to: end, known: true };
  }
  const month = monthOf(today);
  return { from: `${month}-01`, to: addMonths(`${month}-01`, 1), known: false };
}

export function projectStatement(card: CardAccount, charges: CardCharge[], today: string) {
  const window = statementWindow(card, today);
  const mine = charges.filter((charge) => charge.cardId === card.id && charge.date >= window.from && charge.date < window.to && charge.date <= today);
  const spent = mine.reduce((sum, charge) => sum + charge.amount, 0);
  const elapsed = Math.max(1, daysBetween(window.from, today) + 1);
  const left = Math.max(0, daysBetween(today, window.to) - 1);
  const projected = spent + (spent / elapsed) * left;
  return { ...window, spent, elapsed, left, projected };
}

export function paymentStatus(card: CardAccount, today: string): PayStatus | null {
  if (!card.dueOn) return null;
  const owed = card.statementBalance ?? 0;
  const settled = owed > 0 && (card.amountPaid ?? 0) >= owed && Boolean(card.datePaid);
  if (settled) return "Paid";
  if (today > card.dueOn) return "Late";
  return "Due";
}

export function payoff(balance: number, apr: number, payment: number, from: string) {
  if (!(balance > 0) || !(payment > 0)) return null;
  const monthly = apr / 12;
  if (monthly > 0 && payment <= balance * monthly) return { months: Infinity, date: null as string | null };
  const months = monthly <= 0 ? Math.ceil(balance / payment) : Math.ceil(-Math.log(1 - (balance * monthly) / payment) / Math.log(1 + monthly));
  return { months, date: addMonths(from, months).slice(0, 7) + "-01" };
}

export function balanceIsStale(changedOn: string | null, today: string) {
  if (!changedOn) return false;
  return daysBetween(changedOn, today) > 35;
}

const CARD_BILL = (item: string) => item === "Credit card" || item.startsWith("Credit cards");

export function shapeCashflow(payments: Payment[], cards: CardAccount[], charges: CardCharge[], today: string) {
  const lloyds = cards.find((card) => card.id === "lloyds");
  const clear = lloyds ? payoff(lloyds.balance, lloyds.apr, lloyds.monthlyPayment, today) : null;
  const tesco = cards.find((card) => card.id === "tesco");
  const amex = cards.find((card) => card.id === "amex");
  const projections = [tesco, amex].filter((card): card is CardAccount => Boolean(card)).map((card) => ({ card, ...projectStatement(card, charges, today) }));
  const projectedTotal = projections.reduce((sum, row) => sum + row.projected, 0);
  const statementTotal = projections.reduce((sum, row) => sum + (row.card.statementBalance ?? 0), 0);
  const hasStatement = projections.some((row) => (row.card.statementBalance ?? 0) > 0);
  const hasSpend = projections.some((row) => row.spent > 0);
  let replaced = 0;
  const next = payments.map((payment) => {
    let row = payment;
    if (lloyds && clear?.date && payment.date >= clear.date && /lloyds/i.test(payment.item)) {
      row = { ...row, item: lloyds.redirectTo === "loan" ? "Loan extra (from Lloyds)" : "Investment extra (from Lloyds)" };
    }
    if (!CARD_BILL(row.item) || row.date < today) return row;
    replaced += 1;
    if (replaced === 1 && hasStatement) return { ...row, amount: -statementTotal, item: "Credit cards (statement)" };
    if (replaced > 1 && hasSpend) return { ...row, amount: -Math.round(projectedTotal * 100) / 100, item: "Credit cards (projected)" };
    return row;
  });
  const note = !hasSpend
    ? "Cashflow is still using the planned card bills. There is no spend on this statement yet."
    : hasStatement
      ? `Cashflow uses the statement balance of £${statementTotal.toFixed(2)} for the next card bill, then a projected £${projectedTotal.toFixed(2)} after that.`
      : `Cashflow keeps the next planned card bill, then uses a projected £${projectedTotal.toFixed(2)} from spending so far. Enter a statement balance to replace the next bill.`;
  return { payments: next, note, projectedTotal, projections };
}
