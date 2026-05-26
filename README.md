# FIRE

Ett TypeScript-projekt med Fastify-backend, Zod-validering och en separat React + Vite frontend under `frontend/`.

## Om projektet

Detta repository innehåller:

- En Node.js backend byggd med Fastify, Zod och Pino.
- En tydlig konfiguration för ESM, TypeScript och validatorer.
- Test och kvalitetssäkring med Vitest, ESLint och Prettier.
- En fristående frontend i `frontend/` som använder React och Vite.

## Snabbstart

1. Installera beroenden i root.

```bash
npm install
```

2. Kör både backend och frontend i utvecklingsläge.

```bash
npm run start:dev
```

3. Backend körs på port `3000` om inget annat anges i `.env`.

## Vanliga skript

- `npm run build` — kompilerar TypeScript till `dist/`
- `npm run build-watch` — kompilerar i watch-läge
- `npm run start` — kör kompilerad backend från `dist/`
- `npm run start:dev` — kör både backend och frontend i utvecklingsläge
- `npm test` — kör Vitest en gång
- `npm run test:watch` — kör Vitest i watch-läge
- `npm run test:coverage` — kör tester med täckningsrapport
- `npm run lint` — kör ESLint på hela projektet
- `npm run format` — formaterar koden med Prettier
- `npm run format:check` — kontrollerar formatering med Prettier
- `npm run dependency:update` — uppdaterar devDependencies med `npm-check-updates`
- `npm run linux:install` — installerar beroenden i en Linux Docker-container
- `npm run linux:ci` — kör CI-flöde i Linux Docker-container

## Struktur

- `src/` — backendkoden
- `src/routes/` — Fastify-routes
- `src/lib/` — gemensamma hjälpfunktioner och konfiguration
- `frontend/` — React + Vite frontendprojekt

## Frontend

Frontend finns i `frontend/` och har sin egen konfiguration och README. För att köra frontend:

```bash
cd frontend
npm install
npm run dev
```

Kalkylatorn visar nu även kapitalets dagensvärde i tabellen, justerat med
utgiftsinflationen.

## Konfiguration

Backendkonfiguration läses från miljövariabler via Zod-schema. Standardinställningar:

- `NODE_ENV` — `development`, `production` eller `test`
- `PORT` — standard `3000`

## Licens

Detta projekt är privat och saknar specifik licens.
