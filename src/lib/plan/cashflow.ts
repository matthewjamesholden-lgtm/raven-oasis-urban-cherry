import { addMonths } from "./format";
import type { Payment } from "./types";

export type CashLine = Payment & {
  reward: number;
  ultimate: number;
  total: number;
};

export type TransferHint = {
  date: string;
  amount: number;
  item: string;
};

export function sortPayments(payments: Payment[]) {
  return [...payments].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

export function runCash(payments: Payment[], rewardOpen: number, ultimateOpen: number) {
  let reward = rewardOpen;
  let ultimate = ultimateOpen;
  const lines: CashLine[] = [];
  for (const payment of sortPayments(payments)) {
    if (payment.account === "reward") reward += payment.amount;
    else ultimate += payment.amount;
    lines.push({ ...payment, reward, ultimate, total: reward + ultimate });
  }
  return lines;
}

/** Transfers that would stop Ultimate going overdrawn, taken from Reward the same day. */
export function coverUltimate(payments: Payment[], rewardOpen: number, ultimateOpen: number) {
  let reward = rewardOpen;
  let ultimate = ultimateOpen;
  const hints: TransferHint[] = [];
  const lines: CashLine[] = [];
  for (const payment of sortPayments(payments)) {
    if (payment.account === "ultimate" && ultimate + payment.amount < -0.005) {
      const need = -(ultimate + payment.amount);
      const move = Math.min(need, Math.max(reward, 0));
      if (move > 0.5) {
        hints.push({ date: payment.date, amount: move, item: payment.item });
        reward -= move;
        ultimate += move;
      }
    }
    if (payment.account === "reward") reward += payment.amount;
    else ultimate += payment.amount;
    lines.push({ ...payment, reward, ultimate, total: reward + ultimate });
  }
  return { hints, lines };
}

export function lowsBetween(lines: CashLine[], from: string, to: string, start: { reward: number; ultimate: number }) {
  let reward = start.reward;
  let ultimate = start.ultimate;
  let total = reward + ultimate;
  let seen = false;
  for (const line of lines) {
    if (line.date < from || line.date >= to) continue;
    seen = true;
    reward = Math.min(reward, line.reward);
    ultimate = Math.min(ultimate, line.ultimate);
    total = Math.min(total, line.total);
  }
  if (!seen) return { reward: start.reward, ultimate: start.ultimate, total: start.reward + start.ultimate };
  return { reward, ultimate, total };
}

export function balanceAt(lines: CashLine[], beforeDate: string, rewardOpen: number, ultimateOpen: number) {
  let reward = rewardOpen;
  let ultimate = ultimateOpen;
  for (const line of lines) {
    if (line.date >= beforeDate) break;
    reward = line.reward;
    ultimate = line.ultimate;
  }
  return { reward, ultimate };
}

export function nextQuarter(asOf: string) {
  return { from: asOf, to: addMonths(asOf, 3) };
}

export type CashForecast = {
  hints: TransferHint[];
  lines: CashLine[];
  rewardOverdrawn: { date: string; amount: number } | null;
  uncovered: { date: string; amount: number } | null;
};

/**
 * One transfer on the 30th before a month that would take Ultimate overdrawn.
 * The move is trimmed so Reward can still pay its own bills until the next credit.
 */
export function forecastCash(payments: Payment[], rewardOpen: number, ultimateOpen: number): CashForecast {
  const sorted = sortPayments(payments);
  const months = [...new Set(sorted.map((payment) => payment.date.slice(0, 7)))];
  let reward = rewardOpen;
  let ultimate = ultimateOpen;
  const hints: TransferHint[] = [];
  const transfers: Payment[] = [];
  let uncovered: CashForecast["uncovered"] = null;

  for (const month of months) {
    const rows = sorted.filter((payment) => payment.date.startsWith(month));
    let trial = ultimate;
    let worst = trial;
    for (const row of rows) {
      if (row.account === "ultimate") trial += row.amount;
      worst = Math.min(worst, trial);
    }
    if (worst < -0.5) {
      const date = monthEndBefore(month);
      const spare = rewardSpare(sorted, transfers, rewardOpen, date);
      const move = Math.min(-worst, Math.max(spare, 0));
      if (move > 0.5) {
        hints.push({ date, amount: move, item: "Transfer to Ultimate" });
        transfers.push(transferOut(month, date, move), transferIn(month, date, move));
        reward -= move;
        ultimate += move;
      }
      const short = -worst - move;
      if (short > 0.5 && !uncovered) uncovered = { date, amount: short };
    }
    for (const row of rows) {
      if (row.account === "reward") reward += row.amount;
      else ultimate += row.amount;
    }
  }

  const lines = runCash([...sorted, ...transfers], rewardOpen, ultimateOpen);
  const rewardOverdrawn = lines.reduce<{ date: string; amount: number } | null>((worst, line) => {
    if (line.reward >= -0.5) return worst;
    if (!worst || line.reward < worst.amount) return { date: line.date, amount: line.reward };
    return worst;
  }, null);

  return { hints, lines, rewardOverdrawn, uncovered };
}

function rewardSpare(payments: Payment[], transfers: Payment[], rewardOpen: number, onDate: string) {
  const lines = runCash([...payments, ...transfers], rewardOpen, 0);
  let reward = rewardOpen;
  for (const line of lines) {
    if (line.date > onDate) break;
    if (line.account === "reward") reward = line.reward;
  }
  let spare = reward;
  for (const line of lines) {
    if (line.date <= onDate || line.account !== "reward") continue;
    if (line.amount > 0) break;
    spare += line.amount;
  }
  return spare;
}

function transferOut(month: string, date: string, move: number): Payment {
  return { id: `xfer-${month}-out`, date, item: "Transfer to Ultimate", amount: -move, account: "reward", status: "estimate" };
}

function transferIn(month: string, date: string, move: number): Payment {
  return { id: `xfer-${month}-in`, date, item: "Transfer from Reward", amount: move, account: "ultimate", status: "estimate" };
}

function monthEndBefore(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const last = new Date(Date.UTC(year, monthNumber - 1, 0));
  const day = Math.min(30, last.getUTCDate());
  return `${last.getUTCFullYear()}-${String(last.getUTCMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function groupHints(hints: TransferHint[]) {
  const map = new Map<string, number>();
  for (const hint of hints) {
    const key = hint.date.slice(0, 7);
    map.set(key, (map.get(key) ?? 0) + hint.amount);
  }
  return [...map.entries()].map(([month, amount]) => ({ month, amount }));
}
