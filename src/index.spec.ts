import { describe, it } from 'vitest';

describe('index', () => {
  it('är inte main när det importeras som modul', async () => {
    // index.ts startar servern när det körs direkt (isMain),
    // men inte när det importeras som modul i testmiljön.
    await import('./index.js');
  });
});
