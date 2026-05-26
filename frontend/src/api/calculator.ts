export interface YearProjection {
  age: number;
  capital: number;
  monthlySalary: number;
  monthlyPension: number;
  monthlyPassiveIncome: number;
  totalMonthlyIncome: number;
}

export interface PensionInterval {
  fromAge: number;
  toAge: number | null;
  monthlyAmount: number;
}

export interface CalculateRequest {
  currentAge: number;
  monthlyIncome: number;
  startingCapital: number;
  annualReturnRate: number;
  monthlySavings?: number;
  pensionIntervals: PensionInterval[];
}

export interface CalculateResponse {
  projections: YearProjection[];
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function calculateProjection(request: CalculateRequest): Promise<CalculateResponse> {
  const response = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API-fel ${response.status}: ${text}`);
  }

  return response.json() as Promise<CalculateResponse>;
}
