import { createServerFn } from "@tanstack/react-start";
import type { AccountBalance, CardAccount, CardCharge, Holiday, Payment, PlanInputs, Renewal, Trip } from "./types";

export type SavedPlan = {
  savedAt: string;
  inputs: PlanInputs;
  payments: Payment[];
  balances: AccountBalance[];
  cards: CardAccount[];
  charges: CardCharge[];
  merchantRules: { merchant: string; category: string }[];
  dismissedBankIds: string[];
  chargesPulledAt: string | null;
  trips: Trip[];
  holidays: Holiday[];
  renewals: Renewal[];
};

const HOUSEHOLD = "household";

async function sqlClient() {
  const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
  assertSameSiteRequest();
  const { getSql } = await import("@/lib/db");
  return getSql();
}

export const loadPlan = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await sqlClient();
  const rows = await sql<{ payload: string }>`
    select payload from plan_state where user_id = ${HOUSEHOLD}
  `;
  const row = rows[0];
  if (!row) return null;
  return JSON.parse(typeof row.payload === "string" ? row.payload : JSON.stringify(row.payload)) as SavedPlan;
});

export const savePlan = createServerFn({ method: "POST" })
  .validator((data: SavedPlan) => {
    if (!data?.inputs || !Array.isArray(data.payments) || typeof data.savedAt !== "string") {
      throw new Error("Invalid plan");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const sql = await sqlClient();
    const payload = JSON.stringify(data);
    await sql`
      insert into plan_state (user_id, payload, updated_at)
      values (${HOUSEHOLD}, ${payload}, ${data.savedAt})
      on conflict (user_id) do update
      set payload = excluded.payload, updated_at = excluded.updated_at
    `;
    return { ok: true };
  });
