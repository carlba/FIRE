import { useState } from 'react';
import { calculateProjection } from '@/api/calculator';
import type { YearProjection, CalculateRequest } from '@/api/calculator';
import { CalculatorForm } from '@/components/CalculatorForm';
import { ProjectionTable } from '@/components/ProjectionTable';

export function App() {
  const [projections, setProjections] = useState<YearProjection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(request: CalculateRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await calculateProjection(request);
      setProjections(response.projections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nagot gick fel. Forsok igen.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">FIRE-kalkylator</h1>
          <p className="mt-1 text-sm text-gray-500">
            Berakna din manadsinkomst over tid baserat pa kapital, lon och pension.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <CalculatorForm onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {projections.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Prognos ar for ar</h2>
            <p className="mb-4 text-sm text-gray-500">
              Alla belopp i kronor per manad, fore skatt.
            </p>
            <ProjectionTable projections={projections} />
          </section>
        )}
      </main>
    </div>
  );
}
