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
  pensionIntervals: PensionInterval[];
}

export interface YearProjection {
  age: number;
  capital: number;
  monthlySalary: number;
  monthlyPension: number;
  monthlyPassiveIncome: number;
  totalMonthlyIncome: number;
}

const SIMULATION_END_AGE = 90;

function getPensionForAge(age: number, intervals: PensionInterval[]): number {
  const interval = intervals.find(i => age >= i.fromAge && (i.toAge === null || age < i.toAge));
  return interval?.monthlyAmount ?? 0;
}

export function calculateProjection(input: CalculatorInput): YearProjection[] {
  const { currentAge, monthlyIncome, startingCapital, annualReturnRate, pensionIntervals } = input;
  const monthlySavings = input.monthlySavings ?? 0;
  const rate = annualReturnRate / 100;

  const projections: YearProjection[] = [];
  let capital = startingCapital;

  for (let age = currentAge; age <= SIMULATION_END_AGE; age++) {
    const monthlyPassiveIncome = (capital * rate) / 12;
    const monthlyPension = getPensionForAge(age, pensionIntervals);

    projections.push({
      age,
      capital: Math.round(capital),
      monthlySalary: monthlyIncome,
      monthlyPension,
      monthlyPassiveIncome: Math.round(monthlyPassiveIncome),
      totalMonthlyIncome: Math.round(monthlyIncome + monthlyPension + monthlyPassiveIncome),
    });

    // Grow capital for next year: compound return + annual savings
    capital = capital * (1 + rate) + monthlySavings * 12;
  }

  return projections;
}
