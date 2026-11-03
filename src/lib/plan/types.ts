export type BalanceSource = "aureli" | "manual";

export type ManualInputKey = "matLoan" | "hanLoan" | "mortgage" | "isa" | "trading" | "copperpot" | "pension";

export type AccountBalance = {
  id: string;
  name: string;
  provider: string;
  amount: number | null;
  owed: boolean;
  source: BalanceSource;
  checkedOn: string | null;
  changedOn: string | null;
  notedAt: string | null;
  inputKey?: ManualInputKey;
};

export type AccountId = "reward" | "ultimate";

export type Payment = {
  id: string;
  date: string;
  item: string;
  amount: number;
  account: AccountId;
  status: "actual" | "estimate";
  tripId?: string;
};

export type CardAccount = {
  id: string;
  name: string;
  paidHow: string;
  balance: number;
  apr: number;
  monthlyPayment: number;
  statementDay: number | null;
  dueDay: number | null;
  statementOn: string | null;
  dueOn: string | null;
  statementBalance: number | null;
  minimum: number | null;
  amountPaid: number | null;
  datePaid: string | null;
  payMethod: "direct-debit" | "hand" | "ultimate";
  redirectTo: "loan" | "investment";
};

export type CardCharge = {
  id: string;
  date: string;
  cardId: string;
  merchant: string;
  amount: number;
  category: string;
  tripId?: string;
  savedAt?: string;
  pending?: boolean;
  bankId?: string;
  detail?: string;
  abroad?: boolean;
  categoryLocked?: boolean;
  tripLocked?: boolean;
};

export type Trip = {
  id: string;
  code: string;
  place: string;
  when: string;
  flights: number;
  stay: number;
  car: number;
  spend: number;
  from?: string;
  to?: string;
};

export type Holiday = {
  year: number;
  term: string;
  place: string;
};

export type Renewal = {
  id: string;
  item: string;
  provider: string;
  cost: string;
  renews: string;
  startComparing: string;
  action: string;
  status: "open" | "done" | "ask" | "na";
};

export type PlanInputs = {
  asOf: string;
  dob: string;
  retirementAge: number;
  legalAge: number;
  safety: number;
  maxYearIncome: number;
  roi: number;
  cautiousRoi: number;
  poorRoi: number;
  loanRate: number;
  mortgageRate: number;
  copperpotRate: number;
  loanPayment: number;
  mortgagePayment: number;
  savingContribution: number;
  investmentContribution: number;
  pensionContribution: number;
  statePensionWeekly: number;
  lumpSum: number;
  hanAv: number;
  hanFinal: number;
  matUss: number;
  matLgps: number;
  matLoan: number;
  hanLoan: number;
  mortgage: number;
  isa: number;
  copperpot: number;
  pension: number;
  trading: number;
  rewardOpen: number;
  ultimateOpen: number;
  cardBudget: number;
  weekSpend: number;
};

export const CATEGORIES = [
  "Groceries",
  "Fuel",
  "Eating out",
  "Kids",
  "Home",
  "Travel",
  "Subscriptions",
  "Other",
] as const;
