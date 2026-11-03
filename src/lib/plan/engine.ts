/** Retirement engine ported from loan plan.xlsx → RepaymentsSavings.
 *  Checked against the workbook's cached values to a fraction of a penny.
 */

export type EngineInputs = {
  asOf: string;
  dob: string;
  retirementAge: number;
  legalAge: number;
  safety: number;
  maxYearIncome: number;
  roi: number;
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
};

export type MonthRow = {
  period: number;
  age: number;
  date: string;
  loan: number;
  mortgage: number;
  copperpot: number;
  investment: number;
  pension: number;
  accessible: number;
  contribution: number;
};

export type PlanResult = {
  rows: MonthRow[];
  ageNow: number;
  targetYearIncome: number;
  targetMonthIncome: number;
  fullYearIncome: number;
  potAtRetirement: number;
  pensionAtRetirement: number;
  ageAtRetirement: number;
  lowestAccessible58to59: number;
  lowestAge58to59: number;
  /** True when every month from 58 to 59 is still paying the income out of the accessible pot. */
  incomePaid58to59: boolean;
  /** Floor holds only while that income is still being paid. A leftover pot after the draw stops does not count. */
  holds: boolean;
  loanClearAge: number | null;
  mortgageClearAge: number | null;
};

const EPOCH = Date.UTC(1899, 11, 30);

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

export function toSerial(iso: string) {
  const { y, m, d } = parts(iso);
  return Math.round((Date.UTC(y, m - 1, d) - EPOCH) / 86400000);
}

function fromSerial(serial: number) {
  const dt = new Date(EPOCH + Math.floor(serial) * 86400000);
  const y = dt.getUTCFullYear();
  const m = dt.getUTCMonth() + 1;
  const d = dt.getUTCDate();
  return { y, m, d };
}

function isoFromSerial(serial: number) {
  const { y, m, d } = fromSerial(serial);
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Excel YEARFRAC basis 0 (US 30/360). Time of day is ignored, as in Excel. */
function yearFrac(startSerial: number, endSerial: number) {
  const a = fromSerial(startSerial);
  const b = fromSerial(endSerial);
  let d1 = a.d;
  let d2 = b.d;
  if (d1 === 31) d1 = 30;
  if (d2 === 31 && d1 === 30) d2 = 30;
  return ((b.y - a.y) * 360 + (b.m - a.m) * 30 + (d2 - d1)) / 360;
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function project(input: EngineInputs, months = 798): PlanResult {
  const dob = toSerial(input.dob);
  const today = toSerial(input.asOf);
  const work68 = input.hanAv + input.hanFinal + input.matUss + input.matLgps;
  const work66 = input.hanFinal + input.matUss + input.matLgps;
  const work65 = input.matLgps + input.hanFinal;
  const stateMonth = ((input.statePensionWeekly * 52) / 12) * 2;
  const fullYearIncome = work68 + stateMonth * 12;
  const ageNow = yearFrac(dob, today);
  const span = input.retirementAge - ageNow;
  const targetYearIncome =
    span > 0 && fullYearIncome < input.maxYearIncome
      ? fullYearIncome + (input.maxYearIncome - fullYearIncome) / span
      : input.maxYearIncome;
  const targetMonth = targetYearIncome / 12;

  const stateAdd = (age: number) => {
    if (age > 68) return work68 / 12 + stateMonth;
    if (age > 66) return work66 / 12;
    if (age > 65) return work65 / 12;
    return 0;
  };

  let loan = input.matLoan + input.hanLoan;
  let mortgage = input.mortgage;
  let copper = input.copperpot;
  let inv = input.isa + input.trading;
  let pen = input.pension;

  const rows: MonthRow[] = [
    {
      period: 0,
      age: ageNow,
      date: input.asOf,
      loan,
      mortgage,
      copperpot: copper,
      investment: inv,
      pension: pen,
      accessible: inv + copper,
      contribution: 0,
    },
  ];

  let loanClearAge: number | null = null;
  let mortgageClearAge: number | null = null;

  for (let n = 1; n <= months; n++) {
    const serial = today + (n / 12) * 365;
    const age = yearFrac(dob, serial);
    const interestL = (loan * input.loanRate) / 12;
    let newLoan = loan + input.loanPayment + interestL;
    if (newLoan > 0) newLoan = 0;
    if (loan < 0 && newLoan === 0 && loanClearAge === null) loanClearAge = age;
    const mortgagePayment =
      input.mortgagePayment + (newLoan > -0.1 ? input.loanPayment : 0);
    const interestM = (mortgage * input.mortgageRate) / 12;
    let newMort = mortgage + interestM + mortgagePayment;
    if (newMort > 0) newMort = 0;
    if (mortgage < 0 && newMort === 0 && mortgageClearAge === null) mortgageClearAge = age;

    const h = copper < input.safety ? input.savingContribution : 0;
    const newCopper = copper + h + (copper * input.copperpotRate) / 12;

    let k: number;
    if (age < input.retirementAge) {
      k = input.investmentContribution;
      if (newCopper > input.safety) k += input.savingContribution;
      if (newMort === 0) k += mortgagePayment;
    } else if (inv - targetMonth > 0) {
      k = -targetMonth - (newMort > 0 ? mortgagePayment : 0);
    } else {
      k = 0;
    }

    const lump = round1(age) === 66 ? input.lumpSum : 0;
    const newInv = inv + (input.roi * inv) / 12 + k + lump;

    let npen = 0;
    if (age < input.retirementAge) npen = input.pensionContribution;
    else if (age > input.legalAge && k === 0) npen = -targetMonth;
    npen += stateAdd(age);
    const newPen = pen + npen + (input.roi * pen) / 12;

    rows.push({
      period: n,
      age,
      date: isoFromSerial(serial),
      loan: newLoan,
      mortgage: newMort,
      copperpot: newCopper,
      investment: newInv,
      pension: newPen,
      accessible: newInv + newCopper,
      contribution: k,
    });

    loan = newLoan;
    mortgage = newMort;
    copper = newCopper;
    inv = newInv;
    pen = newPen;
  }

  const before = rows.filter((r) => r.age < input.retirementAge);
  const at = before[before.length - 1] ?? rows[0];
  let lowest = Number.POSITIVE_INFINITY;
  let lowestAge = input.legalAge;
  let monthsInBand = 0;
  let incomePaid = true;
  for (const r of rows) {
    if (r.age < 58 || r.age >= 59) continue;
    monthsInBand += 1;
    if (!(r.contribution < -0.5)) incomePaid = false;
    if (r.accessible < lowest) {
      lowest = r.accessible;
      lowestAge = r.age;
    }
  }
  const lowestAccessible = Number.isFinite(lowest) ? lowest : 0;
  const incomePaid58to59 = monthsInBand > 0 && incomePaid;
  const holds = incomePaid58to59 && lowestAccessible >= input.safety;

  return {
    rows,
    ageNow,
    targetYearIncome,
    targetMonthIncome: targetMonth,
    fullYearIncome,
    potAtRetirement: at.accessible,
    pensionAtRetirement: at.pension,
    ageAtRetirement: at.age,
    lowestAccessible58to59: lowestAccessible,
    lowestAge58to59: lowestAge,
    incomePaid58to59,
    holds,
    loanClearAge,
    mortgageClearAge,
  };
}

/** Earliest age, in 0.1 steps, where the 58–59 pot stays above the floor and the income is still being paid. */
export function earliestSafeAge(input: EngineInputs, from = 48, to = 62) {
  let found: number | null = null;
  for (let age = from; age <= to + 0.001; age = Math.round((age + 0.1) * 10) / 10) {
    const result = project({ ...input, retirementAge: age }, 420);
    if (result.holds) {
      found = Math.round(age * 10) / 10;
      break;
    }
  }
  return found;
}
