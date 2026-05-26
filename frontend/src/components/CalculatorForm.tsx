import { useState } from 'react';
import type { CalculateRequest, PensionInterval } from '@/api/calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PensionIntervalEditor } from '@/components/PensionIntervalEditor';

const DEFAULT_PENSION_INTERVALS: PensionInterval[] = [
  { fromAge: 55, toAge: 60, monthlyAmount: 10_600 },
  { fromAge: 60, toAge: 65, monthlyAmount: 2_700 },
  { fromAge: 65, toAge: 70, monthlyAmount: 13_800 },
  { fromAge: 70, toAge: 75, monthlyAmount: 16_900 },
  { fromAge: 75, toAge: null, monthlyAmount: 14_200 },
];

interface FormValues {
  currentAge: string;
  monthlyIncome: string;
  startingCapital: string;
  annualReturnRate: string;
  monthlySavings: string;
  monthlyExpenses: string;
  monthlyExpenseInflationRate: string;
  monthlyPensionInflationRate: string;
  monthlyPensionTaxRate: string;
}

interface CalculatorFormProps {
  onSubmit: (request: CalculateRequest) => void;
  isLoading: boolean;
}

export function CalculatorForm({ onSubmit, isLoading }: CalculatorFormProps) {
  const [values, setValues] = useState<FormValues>({
    currentAge: '43',
    monthlyIncome: '50000',
    startingCapital: '500000',
    annualReturnRate: '7',
    monthlySavings: '',
    monthlyExpenses: '0',
    monthlyExpenseInflationRate: '0',
    monthlyPensionInflationRate: '0',
    monthlyPensionTaxRate: '0',
  });
  const [pensionIntervals, setPensionIntervals] =
    useState<PensionInterval[]>(DEFAULT_PENSION_INTERVALS);
  const [errors, setErrors] = useState<Partial<FormValues>>({});

  function set(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues(prev => ({ ...prev, [field]: e.target.value }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    };
  }

  function validate(): boolean {
    const newErrors: Partial<FormValues> = {};
    const age = Number(values.currentAge);
    if (values.currentAge === '' || isNaN(age) || age < 0 || age > 89)
      newErrors.currentAge = 'Ange en ålder mellan 0 och 89';
    if (values.monthlyIncome === '' || Number(values.monthlyIncome) < 0)
      newErrors.monthlyIncome = 'Ange en positiv månadsinkomst';
    if (values.startingCapital === '' || Number(values.startingCapital) < 0)
      newErrors.startingCapital = 'Ange ett positivt startkapital';
    if (
      values.annualReturnRate === '' ||
      Number(values.annualReturnRate) < 0 ||
      Number(values.annualReturnRate) > 100
    )
      newErrors.annualReturnRate = 'Ange avkastning mellan 0 och 100 %';
    if (values.monthlyExpenses === '' || Number(values.monthlyExpenses) < 0)
      newErrors.monthlyExpenses = 'Ange ett positivt månadsbelopp för utgifter';
    if (
      values.monthlyExpenseInflationRate === '' ||
      Number(values.monthlyExpenseInflationRate) < 0 ||
      Number(values.monthlyExpenseInflationRate) > 100
    )
      newErrors.monthlyExpenseInflationRate = 'Ange en inflation mellan 0 och 100 %';
    if (
      values.monthlyPensionInflationRate === '' ||
      Number(values.monthlyPensionInflationRate) < 0 ||
      Number(values.monthlyPensionInflationRate) > 100
    )
      newErrors.monthlyPensionInflationRate = 'Ange en inflation mellan 0 och 100 %';
    if (
      values.monthlyPensionTaxRate === '' ||
      Number(values.monthlyPensionTaxRate) < 0 ||
      Number(values.monthlyPensionTaxRate) > 100
    )
      newErrors.monthlyPensionTaxRate = 'Ange en skatt mellan 0 och 100 %';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      currentAge: Number(values.currentAge),
      monthlyIncome: Number(values.monthlyIncome),
      startingCapital: Number(values.startingCapital),
      annualReturnRate: Number(values.annualReturnRate),
      monthlySavings: values.monthlySavings ? Number(values.monthlySavings) : undefined,
      monthlyExpenses: values.monthlyExpenses ? Number(values.monthlyExpenses) : undefined,
      monthlyExpenseInflationRate: values.monthlyExpenseInflationRate
        ? Number(values.monthlyExpenseInflationRate)
        : undefined,
      monthlyPensionInflationRate: values.monthlyPensionInflationRate
        ? Number(values.monthlyPensionInflationRate)
        : undefined,
      monthlyPensionTaxRate: values.monthlyPensionTaxRate
        ? Number(values.monthlyPensionTaxRate)
        : undefined,
      pensionIntervals,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Grunduppgifter</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="currentAge">Nuvarande ålder</Label>
            <Input
              id="currentAge"
              type="number"
              min={0}
              max={89}
              value={values.currentAge}
              onChange={set('currentAge')}
              error={errors.currentAge}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="monthlyIncome">Månadsinkomst (kr, före skatt)</Label>
            <Input
              id="monthlyIncome"
              type="number"
              min={0}
              value={values.monthlyIncome}
              onChange={set('monthlyIncome')}
              error={errors.monthlyIncome}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="startingCapital">Startkapital (kr)</Label>
            <Input
              id="startingCapital"
              type="number"
              min={0}
              value={values.startingCapital}
              onChange={set('startingCapital')}
              error={errors.startingCapital}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="annualReturnRate">Beräknad årlig avkastning (%)</Label>
            <Input
              id="annualReturnRate"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={values.annualReturnRate}
              onChange={set('annualReturnRate')}
              error={errors.annualReturnRate}
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="monthlySavings">Månadssparande (kr, valfritt)</Label>
            <Input
              id="monthlySavings"
              type="number"
              min={0}
              value={values.monthlySavings}
              onChange={set('monthlySavings')}
              placeholder="0"
              className="sm:max-w-xs"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="monthlyExpenses">Månadsutgifter (kr, valfritt)</Label>
            <Input
              id="monthlyExpenses"
              type="number"
              min={0}
              value={values.monthlyExpenses}
              onChange={set('monthlyExpenses')}
              placeholder="0"
              error={errors.monthlyExpenses}
              className="sm:max-w-xs"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="monthlyExpenseInflationRate">Inflation för utgifter (%)</Label>
            <Input
              id="monthlyExpenseInflationRate"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={values.monthlyExpenseInflationRate}
              onChange={set('monthlyExpenseInflationRate')}
              error={errors.monthlyExpenseInflationRate}
              placeholder="0"
              className="sm:max-w-xs"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="monthlyPensionInflationRate">Inflation för pension (%)</Label>
            <Input
              id="monthlyPensionInflationRate"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={values.monthlyPensionInflationRate}
              onChange={set('monthlyPensionInflationRate')}
              error={errors.monthlyPensionInflationRate}
              placeholder="0"
              className="sm:max-w-xs"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="monthlyPensionTaxRate">Pensionsskatt (%)</Label>
            <Input
              id="monthlyPensionTaxRate"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={values.monthlyPensionTaxRate}
              onChange={set('monthlyPensionTaxRate')}
              error={errors.monthlyPensionTaxRate}
              placeholder="0"
              className="sm:max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pensionsintervall</CardTitle>
        </CardHeader>
        <CardContent>
          <PensionIntervalEditor intervals={pensionIntervals} onChange={setPensionIntervals} />
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading} className="self-start">
        {isLoading ? 'Beräknar…' : 'Beräkna prognos'}
      </Button>
    </form>
  );
}
