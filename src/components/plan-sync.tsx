import { useEffect, useRef } from "react";
import { create } from "zustand";
import { planFingerprint } from "@/lib/plan/fingerprint";
import { loadPlan, savePlan, type SavedPlan } from "@/lib/plan/remote";
import { usePlanStore } from "@/lib/plan/store";
import { isLegacyCashflow, seedPayments } from "@/lib/plan/seed";
import type { AccountBalance } from "@/lib/plan/types";

export const useSaveStatus = create<{ state: "checking" | "account" | "browser" | "error" }>(() => ({
  state: "checking",
}));

function toSaved(savedAt: string): SavedPlan {
  const state = usePlanStore.getState();
  return {
    savedAt,
    inputs: state.inputs,
    payments: state.payments,
    balances: state.balances,
    cards: state.cards,
    charges: state.charges,
    merchantRules: state.merchantRules,
    dismissedBankIds: state.dismissedBankIds,
    chargesPulledAt: state.chargesPulledAt,
    trips: state.trips,
    holidays: state.holidays,
    renewals: state.renewals,
  };
}

function applySaved(plan: SavedPlan) {
  usePlanStore.setState({
    inputs: plan.inputs,
    payments: isLegacyCashflow(plan.payments) ? seedPayments() : plan.payments,
    balances: plan.balances,
    cards: plan.cards,
    charges: plan.charges,
    merchantRules: plan.merchantRules ?? [],
    dismissedBankIds: plan.dismissedBankIds ?? [],
    chargesPulledAt: plan.chargesPulledAt ?? null,
    trips: plan.trips,
    holidays: plan.holidays,
    renewals: plan.renewals,
    planSavedAt: plan.savedAt,
  });
}

function localShouldWin(localBalances: AccountBalance[], localSavedAt: string | null, remote: SavedPlan | null) {
  if (localSavedAt && (!remote || localSavedAt > remote.savedAt)) return true;
  for (const row of localBalances) {
    if (row.source !== "manual" || !row.notedAt) continue;
    const other = remote?.balances.find((item) => item.id === row.id);
    if (!other?.notedAt || row.notedAt > other.notedAt) return true;
  }
  return false;
}

async function push(savedAt: string) {
  useSaveStatus.setState({ state: "checking" });
  try {
    await savePlan({ data: toSaved(savedAt) });
    useSaveStatus.setState({ state: "account" });
  } catch {
    useSaveStatus.setState({ state: "error" });
  }
}

export function PlanSync() {
  const applying = useRef(false);

  useEffect(() => {
    let cancel = false;
    void (async () => {
      if (!usePlanStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          const unsub = usePlanStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
          });
          if (usePlanStore.persist.hasHydrated()) resolve();
        });
      }
      if (cancel) return;
      const seen = planFingerprint(usePlanStore.getState());
      let remote: SavedPlan | null = null;
      try {
        remote = await loadPlan();
      } catch {
        if (!cancel) useSaveStatus.setState({ state: "error" });
        return;
      }
      if (cancel || planFingerprint(usePlanStore.getState()) !== seen) return;
      const local = usePlanStore.getState();
      if (localShouldWin(local.balances, local.planSavedAt, remote)) {
        const savedAt = local.planSavedAt ?? new Date().toISOString();
        applying.current = true;
        usePlanStore.setState({ planSavedAt: savedAt });
        applying.current = false;
        await push(savedAt);
        return;
      }
      if (remote) {
        const legacy = isLegacyCashflow(remote.payments);
        applying.current = true;
        applySaved(remote);
        applying.current = false;
        if (legacy) await push(new Date().toISOString());
        else useSaveStatus.setState({ state: "account" });
        return;
      }
      useSaveStatus.setState({ state: "browser" });
    })();
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsub = usePlanStore.subscribe((state, prev) => {
      if (applying.current) return;
      if (planFingerprint(state) === planFingerprint(prev)) return;
      const savedAt = new Date().toISOString();
      clearTimeout(timer);
      timer = setTimeout(() => {
        applying.current = true;
        usePlanStore.setState({ planSavedAt: savedAt });
        applying.current = false;
        void push(savedAt);
      }, 400);
    });
    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  return null;
}
