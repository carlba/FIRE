import { describe, expect, it } from 'vitest';
import { calculateProjection } from './calculator.js';
import type { CalculatorInput } from './calculator.js';

const BASE_INPUT: CalculatorInput = {
  currentAge: 40,
  monthlyIncome: 50_000,
  startingCapital: 1_000_000,
  annualReturnRate: 7,
  pensionIntervals: [],
};

describe('calculateProjection', () => {
  it('simulerar från currentAge till 90 (inklusive)', () => {
    const result = calculateProjection(BASE_INPUT);
    expect(result[0].age).toBe(40);
    expect(result[result.length - 1].age).toBe(90);
    expect(result).toHaveLength(51);
  });

  it('lön är konstant genom hela simuleringen', () => {
    const result = calculateProjection(BASE_INPUT);
    for (const row of result) {
      expect(row.monthlySalary).toBe(50_000);
    }
  });

  it('kapital växer med lön och avkastning utan månadssparande', () => {
    const result = calculateProjection({ ...BASE_INPUT, monthlySavings: 0 });
    // Efter ett år: 1 000 000 * 1.07 + 50 000 * 12 = 1 670 000
    expect(result[1].capital).toBe(1_670_000);
  });

  it('kapital inkluderar månadssparande', () => {
    const result = calculateProjection({ ...BASE_INPUT, monthlySavings: 5_000 });
    // År 1: 1 000 000 * 1.07 + 50 000 * 12 + 5 000 * 12 = 1 730 000
    expect(result[1].capital).toBe(1_730_000);
  });

  it('passiv inkomst baseras på kapital × årsränta / 12', () => {
    const result = calculateProjection(BASE_INPUT);
    // År 0: 1 000 000 * 0.07 / 12 ≈ 5833
    expect(result[0].monthlyPassiveIncome).toBe(5_833);
  });

  it('returnerar 0 i pension när inga intervall är definierade', () => {
    const result = calculateProjection(BASE_INPUT);
    for (const row of result) {
      expect(row.monthlyPension).toBe(0);
    }
  });

  it('väljer rätt pensionsintervall för åldern', () => {
    const input: CalculatorInput = {
      ...BASE_INPUT,
      pensionIntervals: [
        { fromAge: 55, toAge: 65, monthlyAmount: 10_600 },
        { fromAge: 65, toAge: null, monthlyAmount: 16_900 },
      ],
    };
    const result = calculateProjection(input);

    const at54 = result.find(row => row.age === 54);
    const at55 = result.find(row => row.age === 55);
    const at65 = result.find(row => row.age === 65);

    expect(at54?.monthlyPension).toBe(0);
    expect(at55?.monthlyPension).toBe(10_600);
    expect(at65?.monthlyPension).toBe(16_900);
  });

  it('pensionsintervall med toAge null gäller till slutet av simuleringen', () => {
    const input: CalculatorInput = {
      ...BASE_INPUT,
      pensionIntervals: [{ fromAge: 70, toAge: null, monthlyAmount: 14_200 }],
    };
    const result = calculateProjection(input);
    const at90 = result.find(row => row.age === 90);
    expect(at90?.monthlyPension).toBe(14_200);
  });

  it('pensionen ökar med inflation från nuvarande ålder', () => {
    const input: CalculatorInput = {
      ...BASE_INPUT,
      pensionIntervals: [{ fromAge: 55, toAge: null, monthlyAmount: 10_000 }],
      monthlyPensionInflationRate: 5,
    };
    const result = calculateProjection(input);

    const at55 = result.find(row => row.age === 55);
    const at56 = result.find(row => row.age === 56);
    const at57 = result.find(row => row.age === 57);

    expect(at55?.monthlyPension).toBeCloseTo(20_789.28, 2);
    expect(at56?.monthlyPension).toBeCloseTo(21_828.75, 2);
    expect(at57?.monthlyPension).toBeCloseTo(22_920.18, 2);
  });

  it('pension minskas med skatt innan netto beräknas', () => {
    const input: CalculatorInput = {
      ...BASE_INPUT,
      pensionIntervals: [{ fromAge: 40, toAge: null, monthlyAmount: 10_000 }],
      monthlyPensionTaxRate: 20,
    };
    const result = calculateProjection(input);
    const first = result[0];

    expect(first.monthlyPension).toBe(8_000);
    expect(first.totalMonthlyIncome).toBe(first.monthlySalary + first.monthlyPension + first.monthlyPassiveIncome);
  });

  it('totalMonthlyIncome är summan av lön, pension och passiv inkomst', () => {
    const input: CalculatorInput = {
      ...BASE_INPUT,
      pensionIntervals: [{ fromAge: 40, toAge: null, monthlyAmount: 5_000 }],
    };
    const result = calculateProjection(input);
    const first = result[0];
    expect(first.totalMonthlyIncome).toBe(
      first.monthlySalary + first.monthlyPension + first.monthlyPassiveIncome
    );
  });

  it('beräknar nettoinkomst efter utgifter', () => {
    const input: CalculatorInput = {
      ...BASE_INPUT,
      pensionIntervals: [{ fromAge: 40, toAge: null, monthlyAmount: 5_000 }],
      monthlyExpenses: 10_000,
    };
    const result = calculateProjection(input);
    const first = result[0];

    expect(first.monthlyExpenses).toBe(10_000);
    expect(first.netMonthlyIncome).toBe(first.totalMonthlyIncome - first.monthlyExpenses);
  });

  it('månadsutgifter dras från kapitalet över tid', () => {
    const input: CalculatorInput = {
      currentAge: 43,
      monthlyIncome: 0,
      startingCapital: 3_500_000,
      annualReturnRate: 7,
      monthlyExpenses: 15_000,
      pensionIntervals: [],
    };
    const result = calculateProjection(input);

    expect(result[0].monthlyExpenses).toBe(15_000);
    expect(result[1].capital).toBe(3_565_000);
    expect(result[result.length - 1].capital).toBe(24_899_585);
  });

  it('utgifter påverkar kapitalets årliga bidrag när nettoinkomsten inte räcker', () => {
    const inputWithExpenses: CalculatorInput = {
      currentAge: 40,
      monthlyIncome: 0,
      startingCapital: 1_000_000,
      annualReturnRate: 7,
      monthlySavings: 5_000,
      monthlyExpenses: 10_000,
      pensionIntervals: [],
    };
    const inputWithoutExpenses: CalculatorInput = {
      ...inputWithExpenses,
      monthlyExpenses: 0,
    };

    const resultWithExpenses = calculateProjection(inputWithExpenses);
    const resultWithoutExpenses = calculateProjection(inputWithoutExpenses);

    expect(resultWithExpenses[1].capital).toBeLessThan(resultWithoutExpenses[1].capital);
    expect(resultWithExpenses[1].capital).toBe(1_010_000);
  });

  it('pension över utgifter minskar inte kapitalet orimligt', () => {
    const input: CalculatorInput = {
      currentAge: 43,
      monthlyIncome: 0,
      startingCapital: 3_500_000,
      annualReturnRate: 7,
      monthlyExpenses: 27_170,
      monthlyPensionInflationRate: 0,
      pensionIntervals: [{ fromAge: 55, toAge: null, monthlyAmount: 30_612 }],
    };
    const result = calculateProjection(input);

    expect(result.find(row => row.age === 56)?.capital).toBeGreaterThan(
      result.find(row => row.age === 55)?.capital ?? 0
    );
    expect(result.find(row => row.age === 55)?.netMonthlyIncome).toBeGreaterThan(0);
  });

  it('utan monthlySavings ger samma resultat som månadssparande 0', () => {
    const withoutSavings = calculateProjection({ ...BASE_INPUT, monthlySavings: undefined });
    const withZero = calculateProjection({ ...BASE_INPUT, monthlySavings: 0 });
    expect(withoutSavings.map(row => row.capital)).toEqual(withZero.map(row => row.capital));
  });
});
