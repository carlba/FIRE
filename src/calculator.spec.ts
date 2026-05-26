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

  it('kapital växer med ränta-på-ränta utan månadssparande', () => {
    const result = calculateProjection({ ...BASE_INPUT, monthlySavings: 0 });
    // Efter ett år: 1 000 000 * 1.07 = 1 070 000
    expect(result[1].capital).toBe(1_070_000);
  });

  it('kapital inkluderar månadssparande', () => {
    const result = calculateProjection({ ...BASE_INPUT, monthlySavings: 5_000 });
    // År 1: 1 000 000 * 1.07 + 5 000 * 12 = 1 070 000 + 60 000 = 1 130 000
    expect(result[1].capital).toBe(1_130_000);
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

  it('utan monthlySavings växer kapital enbart via ränta', () => {
    const withSavings = calculateProjection({ ...BASE_INPUT, monthlySavings: undefined });
    const withZero = calculateProjection({ ...BASE_INPUT, monthlySavings: 0 });
    expect(withSavings.map(row => row.capital)).toEqual(withZero.map(row => row.capital));
  });
});
