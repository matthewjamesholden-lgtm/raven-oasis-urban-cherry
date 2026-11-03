import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  SEED_BALANCES,
  SEED_CARDS,
  SEED_INPUTS,
  SEED_RENEWALS,
  SEED_TRIPS,
  isLegacyCashflow,
  seedHolidays,
  seedPayments,
} from "./seed";
import { localDay } from "./format";
import type { AccountBalance, CardAccount, CardCharge, Holiday, Payment, PlanInputs, Renewal, Trip } from "./types";

type MerchantRule = { merchant: string; category: string };

type PlanState = {
  inputs: PlanInputs;
  payments: Payment[];
  balances: AccountBalance[];
  cards: CardAccount[];
  charges: CardCharge[];
  merchantRules: MerchantRule[];
  dismissedBankIds: string[];
  chargesPulledAt: string | null;
  trips: Trip[];
  holidays: Holiday[];
  renewals: Renewal[];
  planSavedAt: string | null;
  setInputs: (patch: Partial<PlanInputs>) => void;
  upsertPayment: (payment: Payment) => void;
  removePayment: (id: string) => void;
  setAccountBalance: (id: string, amount: number | null) => void;
  upsertCharge: (charge: CardCharge) => void;
  removeCharge: (id: string) => void;
  rememberMerchant: (merchant: string, category: string) => void;
  importCharges: (charges: CardCharge[], pulledAt: string) => void;
  updateCard: (id: string, patch: Partial<CardAccount>) => void;
  updateTrip: (id: string, patch: Partial<Trip>) => void;
  addTrip: (trip: Trip) => void;
  removeTrip: (id: string) => void;
  setRenewalStatus: (id: string, status: Renewal["status"]) => void;
  restoreSpreadsheet: () => void;
};

function normaliseBalances(saved: AccountBalance[] | undefined, fallback: AccountBalance[], inputs?: PlanInputs) {
  const rows = saved?.length ? saved : fallback;
  const halifax = rows.find((row) => row.id === "halifax-card");
  const rewritten = rows
    .filter((row) => row.id !== "halifax-card")
    .map((row) => {
      if (row.id !== "lloyds") return row;
      return {
        ...row,
        name: "Lloyds",
        provider: "Halifax",
        amount: halifax?.amount ?? row.amount ?? 8800,
        owed: true,
        source: "aureli" as const,
        checkedOn: halifax?.checkedOn ?? row.checkedOn ?? "2026-11-02",
        changedOn: halifax?.changedOn ?? row.changedOn ?? "2026-10-24",
        notedAt: null,
      };
    });
  const byId = new Map(rewritten.map((row) => [row.id, row]));
  const ordered = fallback.map((seed) => {
    const existing = byId.get(seed.id);
    if (existing) return existing;
    if (seed.inputKey && inputs) {
      const raw = inputs[seed.inputKey];
      if (typeof raw === "number") return { ...seed, amount: Math.abs(raw), owed: raw < 0 };
    }
    return seed;
  });
  const extra = rewritten.filter((row) => !fallback.some((seed) => seed.id === row.id));
  return [...ordered, ...extra];
}

function normaliseCards(saved: CardAccount[] | undefined) {
  const byId = new Map((saved ?? []).map((card) => [card.id, card]));
  const known = SEED_CARDS.map((seed) => ({ ...seed, ...byId.get(seed.id), id: seed.id }));
  const extra = (saved ?? []).filter((card) => !SEED_CARDS.some((seed) => seed.id === card.id));
  return [...known, ...extra];
}

function normaliseTrips(saved: Trip[] | undefined) {
  const list = (saved?.length ? saved : SEED_TRIPS).map((trip) => ({ ...trip }));
  for (const trip of list) {
    const seed = SEED_TRIPS.find((row) => row.id === trip.id);
    if (!seed) continue;
    trip.from = trip.from ?? seed.from;
    trip.to = trip.to ?? seed.to;
    if (trip.id === "car-2026-xmas" && trip.code === "CAR-2026-12") trip.code = seed.code;
  }
  if (!list.some((trip) => trip.code === "XAT-2027-01")) {
    const january = SEED_TRIPS.find((trip) => trip.code === "XAT-2027-01");
    if (january) list.push({ ...january });
  }
  return list;
}

function migrateCashflow(saved: Partial<PlanState>, current: PlanState) {
  const inputs = { ...current.inputs, ...(saved.inputs ?? {}) };
  let payments = saved.payments ?? current.payments;
  if (inputs.rewardOpen === 561.81 && inputs.ultimateOpen === 3959.6) {
    inputs.rewardOpen = 587.6;
    inputs.ultimateOpen = 567.83;
  }
  if (isLegacyCashflow(payments) || payments.some((payment) => payment.date.startsWith("2026-10"))) {
    payments = seedPayments();
  }
  return { inputs, payments };
}

function fresh() {
  return {
    inputs: SEED_INPUTS,
    payments: seedPayments(),
    balances: SEED_BALANCES,
    cards: SEED_CARDS,
    charges: [] as CardCharge[],
    merchantRules: [] as MerchantRule[],
    dismissedBankIds: [] as string[],
    chargesPulledAt: null as string | null,
    trips: SEED_TRIPS,
    holidays: seedHolidays(),
    renewals: SEED_RENEWALS,
    planSavedAt: null as string | null,
  };
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      ...fresh(),
      setInputs: (patch) => set((s) => ({ inputs: { ...s.inputs, ...patch }, planSavedAt: new Date().toISOString() })),
      upsertPayment: (payment) =>
        set((s) => ({
          payments: s.payments.some((p) => p.id === payment.id)
            ? s.payments.map((p) => (p.id === payment.id ? payment : p))
            : [...s.payments, payment],
          planSavedAt: new Date().toISOString(),
        })),
      removePayment: (id) => set((s) => ({ payments: s.payments.filter((p) => p.id !== id), planSavedAt: new Date().toISOString() })),
      setAccountBalance: (id, amount) =>
        set((s) => {
          const known = SEED_BALANCES.find((row) => row.id === id && row.source === "manual");
          let target = s.balances.find((row) => row.id === id) ?? known;
          if (!target || (target.source !== "manual" && !known)) return s;
          target = { ...target, source: "manual", inputKey: target.inputKey ?? known?.inputKey };
          if (amount === null && target.inputKey) return s;
          const now = new Date();
          const day = localDay(now);
          const stored = amount === null ? null : Math.abs(amount);
          const same = target.amount === stored;
          const next = {
            ...target,
            amount: stored,
            checkedOn: stored === null ? null : day,
            changedOn: stored === null ? null : same ? target.changedOn ?? day : day,
            notedAt: stored === null ? null : now.toISOString(),
          };
          const balances = s.balances.some((row) => row.id === id)
            ? s.balances.map((row) => (row.id === id ? next : row))
            : [...s.balances, next];
          if (!next.inputKey || stored === null) return { balances, planSavedAt: now.toISOString() };
          const signed = next.owed ? -stored : stored;
          return { balances, inputs: { ...s.inputs, [next.inputKey]: signed }, planSavedAt: now.toISOString() };
        }),
      upsertCharge: (charge) =>
        set((s) => ({
          charges: s.charges.some((c) => c.id === charge.id)
            ? s.charges.map((c) => (c.id === charge.id ? charge : c))
            : [...s.charges, charge],
          planSavedAt: new Date().toISOString(),
        })),
      removeCharge: (id) =>
        set((s) => {
          const charge = s.charges.find((row) => row.id === id);
          return {
            charges: s.charges.filter((row) => row.id !== id),
            dismissedBankIds: charge?.bankId ? [...s.dismissedBankIds, charge.bankId] : s.dismissedBankIds,
            planSavedAt: new Date().toISOString(),
          };
        }),
      rememberMerchant: (merchant, category) =>
        set((s) => {
          const key = merchant.toLowerCase();
          const rest = s.merchantRules.filter((rule) => rule.merchant !== key);
          return { merchantRules: [...rest, { merchant: key, category }], planSavedAt: new Date().toISOString() };
        }),
      importCharges: (charges, pulledAt) => set({ charges, chargesPulledAt: pulledAt, planSavedAt: new Date().toISOString() }),
      updateCard: (id, patch) =>
        set((s) => ({ cards: s.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)), planSavedAt: new Date().toISOString() })),
      updateTrip: (id, patch) => set((s) => ({ trips: s.trips.map((t) => (t.id === id ? { ...t, ...patch } : t)), planSavedAt: new Date().toISOString() })),
      addTrip: (trip) => set((s) => ({ trips: [...s.trips, trip], planSavedAt: new Date().toISOString() })),
      removeTrip: (id) =>
        set((s) => ({
          trips: s.trips.filter((t) => t.id !== id),
          charges: s.charges.map((c) => (c.tripId === id ? { ...c, tripId: undefined } : c)),
          payments: s.payments.map((p) => (p.tripId === id ? { ...p, tripId: undefined } : p)),
          planSavedAt: new Date().toISOString(),
        })),
      setRenewalStatus: (id, status) =>
        set((s) => ({ renewals: s.renewals.map((r) => (r.id === id ? { ...r, status } : r)), planSavedAt: new Date().toISOString() })),
      restoreSpreadsheet: () => set(fresh()),
    }),
    {
      name: "hearth-plan-v1",
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<PlanState>;
        const cash = migrateCashflow(saved, current);
        return {
          ...current,
          ...saved,
          inputs: cash.inputs,
          payments: cash.payments,
          balances: normaliseBalances(saved.balances, current.balances, cash.inputs),
          cards: normaliseCards(saved.cards),
          trips: normaliseTrips(saved.trips),
          merchantRules: saved.merchantRules ?? [],
          dismissedBankIds: saved.dismissedBankIds ?? [],
          chargesPulledAt: saved.chargesPulledAt ?? null,
        };
      },
    },
  ),
);
