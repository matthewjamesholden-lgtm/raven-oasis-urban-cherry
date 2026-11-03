import {
  SEED_BALANCES,
  SEED_CARDS,
  SEED_INPUTS,
  SEED_RENEWALS,
  SEED_TRIPS,
  seedHolidays,
  seedPayments,
} from "./seed";
import type { SavedPlan } from "./remote";

export function planFingerprint(plan: Omit<SavedPlan, "savedAt">) {
  return JSON.stringify({
    inputs: plan.inputs,
    payments: plan.payments,
    balances: plan.balances,
    cards: plan.cards,
    charges: plan.charges,
    merchantRules: plan.merchantRules ?? [],
    dismissedBankIds: plan.dismissedBankIds ?? [],
    chargesPulledAt: plan.chargesPulledAt ?? null,
    trips: plan.trips,
    holidays: plan.holidays,
    renewals: plan.renewals,
  });
}

export const SEED_FINGERPRINT = planFingerprint({
  inputs: SEED_INPUTS,
  payments: seedPayments(),
  balances: SEED_BALANCES,
  cards: SEED_CARDS,
  charges: [],
  merchantRules: [],
  dismissedBankIds: [],
  chargesPulledAt: null,
  trips: SEED_TRIPS,
  holidays: seedHolidays(),
  renewals: SEED_RENEWALS,
});
