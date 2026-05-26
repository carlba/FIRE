import type { PensionInterval } from '@/api/calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PensionIntervalEditorProps {
  intervals: PensionInterval[];
  onChange: (intervals: PensionInterval[]) => void;
}

const EMPTY_INTERVAL: PensionInterval = { fromAge: 0, toAge: null, monthlyAmount: 0 };

export function PensionIntervalEditor({ intervals, onChange }: PensionIntervalEditorProps) {
  function updateInterval(index: number, field: keyof PensionInterval, value: string) {
    const updated = intervals.map((interval, i) => {
      if (i !== index) return interval;
      if (field === 'toAge') {
        const parsed = value === '' ? null : Number(value);
        return { ...interval, toAge: parsed };
      }
      return { ...interval, [field]: Number(value) };
    });
    onChange(updated);
  }

  function addInterval() {
    onChange([...intervals, { ...EMPTY_INTERVAL }]);
  }

  function removeInterval(index: number) {
    onChange(intervals.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      {intervals.length > 0 && (
        <div className="hidden grid-cols-[1fr_1fr_1fr_auto] gap-2 sm:grid">
          <Label>Från ålder</Label>
          <Label>Till ålder</Label>
          <Label>Belopp (kr/mån)</Label>
          <span />
        </div>
      )}

      {intervals.map((interval, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center sm:border-0 sm:bg-transparent sm:p-0">
          <div className="sm:hidden">
            <Label className="mb-1">Från ålder</Label>
          </div>
          <Input
            type="number"
            min={0}
            max={89}
            value={interval.fromAge}
            onChange={e => updateInterval(index, 'fromAge', e.target.value)}
            placeholder="Från ålder"
          />
          <div className="sm:hidden">
            <Label className="mb-1">Till ålder (tom = livet ut)</Label>
          </div>
          <Input
            type="number"
            min={1}
            max={120}
            value={interval.toAge ?? ''}
            onChange={e => updateInterval(index, 'toAge', e.target.value)}
            placeholder="Livet ut"
          />
          <div className="sm:hidden">
            <Label className="mb-1">Belopp (kr/mån)</Label>
          </div>
          <Input
            type="number"
            min={0}
            value={interval.monthlyAmount}
            onChange={e => updateInterval(index, 'monthlyAmount', e.target.value)}
            placeholder="0"
          />
          <Button
            variant="destructive"
            onClick={() => removeInterval(index)}
            aria-label="Ta bort rad">
            Ta bort
          </Button>
        </div>
      ))}

      <Button variant="secondary" onClick={addInterval} type="button">
        + Lägg till pensionsintervall
      </Button>
    </div>
  );
}
