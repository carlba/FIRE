import type { YearProjection } from '@/api/calculator';

const SEK = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
});

interface ProjectionTableProps {
  projections: YearProjection[];
}

export function ProjectionTable({ projections }: ProjectionTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 text-right">Ålder</th>
            <th className="px-4 py-3 text-right">Kapital</th>
            <th className="px-4 py-3 text-right">Lön</th>
            <th className="px-4 py-3 text-right">Pension</th>
            <th className="px-4 py-3 text-right">Passiv inkomst</th>
            <th className="px-4 py-3 text-right font-bold text-gray-700">Total/mån</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {projections.map(row => (
            <tr key={row.age} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-2 text-right font-medium text-gray-700">{row.age} år</td>
              <td className="px-4 py-2 text-right text-gray-600">{SEK.format(row.capital)}</td>
              <td className="px-4 py-2 text-right text-gray-600">
                {SEK.format(row.monthlySalary)}
              </td>
              <td className="px-4 py-2 text-right text-gray-600">
                {SEK.format(row.monthlyPension)}
              </td>
              <td className="px-4 py-2 text-right text-gray-600">
                {SEK.format(row.monthlyPassiveIncome)}
              </td>
              <td className="px-4 py-2 text-right font-semibold text-blue-700">
                {SEK.format(row.totalMonthlyIncome)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
