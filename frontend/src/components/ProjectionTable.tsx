import type { YearProjection } from '@/api/calculator';

const SEK = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
});

interface ProjectionTableProps {
  projections: YearProjection[];
  currentAge: number;
  annualInflationRate: number;
}

export function ProjectionTable({
  projections,
  currentAge,
  annualInflationRate,
}: ProjectionTableProps) {
  const inflationRate = annualInflationRate / 100;

  function getCapitalTodayValue(capital: number, age: number): number {
    const yearsSinceStart = age - currentAge;
    if (yearsSinceStart <= 0 || inflationRate === 0) {
      return capital;
    }

    return capital / (1 + inflationRate) ** yearsSinceStart;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 text-right">Ålder</th>
            <th className="px-4 py-3 text-right">Kapital</th>
            <th className="px-4 py-3 text-right">Kapital DV</th>
            <th className="px-4 py-3 text-right">Lön</th>
            <th className="px-4 py-3 text-right">Pension</th>
            <th className="px-4 py-3 text-right">Passiv inkomst</th>
            <th className="px-4 py-3 text-right">Utgifter</th>
            <th className="px-4 py-3 text-right">Total/gross</th>
            <th className="px-4 py-3 text-right font-bold text-gray-700">Netto/mån</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {projections.map(row => (
            <tr key={row.age} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-2 text-right font-medium text-gray-700">{row.age} år</td>
              <td className="px-4 py-2 text-right text-gray-600">{SEK.format(row.capital)}</td>
              <td className="px-4 py-2 text-right text-gray-600">
                {SEK.format(getCapitalTodayValue(row.capital, row.age))}
              </td>
              <td className="px-4 py-2 text-right text-gray-600">
                {SEK.format(row.monthlySalary)}
              </td>
              <td className="px-4 py-2 text-right text-gray-600">
                {SEK.format(row.monthlyPension)}
              </td>
              <td className="px-4 py-2 text-right text-gray-600">
                {SEK.format(row.monthlyPassiveIncome)}
              </td>
              <td className="px-4 py-2 text-right text-gray-600">
                {SEK.format(row.monthlyExpenses)}
              </td>
              <td className="px-4 py-2 text-right text-gray-600">
                {SEK.format(row.totalMonthlyIncome)}
              </td>
              <td className="px-4 py-2 text-right font-semibold text-blue-700">
                {SEK.format(row.netMonthlyIncome)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
