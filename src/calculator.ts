export interface PensionInterval {
  fromAge: number;
  toAge: number | null;
  monthlyAmount: number;
}

export interface CalculatorInput {
  currentAge: number;
  monthlyIncome: number;
  startingCapital: number;
  annualReturnRate: number;
  monthlySavings?: number;
  monthlyExpenses?: number;
  monthlyExpenseInflationRate?: number;
  monthlyPensionInflationRate?: number;
  monthlyPensionTaxRate?: number;
  pensionIntervals: PensionInterval[];
}

export interface YearProjection {
  age: number;
  capital: number;
  monthlySalary: number;
  monthlyPension: number;
  monthlyPassiveIncome: number;
  monthlyExpenses: number;
  totalMonthlyIncome: number;
  netMonthlyIncome: number;
}

const SIMULATION_END_AGE = 90;

function getInflationAdjustedPensionForAge(
  currentAge: number,
  age: number,
  intervals: PensionInterval[],
  inflationRate: number
): number {
  const interval = intervals.find(i => age >= i.fromAge && (i.toAge === null || age < i.toAge));
  if (!interval) {
    return 0;
  }

  const yearsSinceStart = age - currentAge;
  if (yearsSinceStart < 0) {
    return 0;
  }

  return interval.monthlyAmount * (1 + inflationRate) ** yearsSinceStart;
}

export function calculateProjection(input: CalculatorInput): YearProjection[] {
  const {
    currentAge,
    monthlyIncome,
    startingCapital,
    annualReturnRate,
    monthlyExpenses,
    monthlyExpenseInflationRate,
    monthlyPensionInflationRate,
    monthlyPensionTaxRate,
    monthlySavings,
    pensionIntervals,
  } = input;
  const expenseValue = monthlyExpenses ?? 0;
  const expenseInflation = (monthlyExpenseInflationRate ?? 0) / 100;
  const pensionInflation = (monthlyPensionInflationRate ?? 0) / 100;
  const pensionTaxRate = (monthlyPensionTaxRate ?? 0) / 100;
  const rate = annualReturnRate / 100;

  const projections: YearProjection[] = [];
  let capital = startingCapital;
  let currentMonthlyExpenses = expenseValue;

  for (let age = currentAge; age <= SIMULATION_END_AGE; age++) {
    const monthlyPassiveIncome = (capital * rate) / 12;
    const monthlyPensionGross = getInflationAdjustedPensionForAge(
      currentAge,
      age,
      pensionIntervals,
      pensionInflation
    );
    const monthlyPension = monthlyPensionGross * (1 - pensionTaxRate);
    const totalMonthlyIncome = monthlyIncome + monthlyPension + monthlyPassiveIncome;
    const netMonthlyIncome = totalMonthlyIncome - currentMonthlyExpenses;
    const monthlyContribution =
      (monthlyIncome + monthlyPension - currentMonthlyExpenses) + (monthlySavings ?? 0);

    projections.push({
      age,
      capital: Math.round(capital),
      monthlySalary: monthlyIncome,
      monthlyPension,
      monthlyPassiveIncome: Math.round(monthlyPassiveIncome),
      monthlyExpenses: Math.round(currentMonthlyExpenses),
      totalMonthlyIncome: Math.round(totalMonthlyIncome),
      netMonthlyIncome: Math.round(netMonthlyIncome),
    });

    capital = capital * (1 + rate) + monthlyContribution * 12;
    currentMonthlyExpenses *= 1 + expenseInflation;
  }

  return projections;
}
