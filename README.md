# Én app til felt + kontor

Dette monorepo indeholder den komplette kildekode til "Én app til felt + kontor", en progressiv web‑applikation (PWA) der kombinerer Intempus‑ og E‑Komplet‑funktionalitet med Scafix‑integration. Appen er designet til at fungere offline og online, understøtter to‑tryk stempling og pause samt vedhæftede dokumenter og eksport i flere formater. Alle brugerfladetekster er på dansk, mens de tekniske kommentarer er på engelsk.

## Arkitektur

Applikationen følger **Arkitektur A**: Next.js (med App Router) som frontend og API‑laget, Postgres/Supabase som database med RLS (Row‑Level Security) og triggers for auditering. Opsætningen er et monorepo med NPM‑workspaces, så både web‑appen, delt kode og Supabase‑funktioner kan versioneres samlet.

### Vigtigste komponenter

| Komponent                | Beskrivelse |
|--------------------------|-------------|
| **Next.js‑app**          | Finder du i `apps/web`. Indeholder alle brugergrænseflader, API‑route handlers og integration med Supabase, Dexie og Scafix. |
| **Supabase SQL**         | Ligger i `supabase/`. Indeholder database‑skema, seed‑data, RLS‑politikker og triggers for ændringslog. |
| **Export‑moduler**       | Under `packages/exports` ligger moduler til at generere CSV, XLSX og PDF baseret på vores tidsregistreringer og countsheets. |
| **Scafix‑wrapper**       | I `packages/scafix` ligger en React‑komponent der embedder Scafix i et iframe med JWT‑SSO samt en event‑bro til vores API. |
| **Test**                 | Både unit, integration og E2E tests findes under `apps/web/tests` og `tests/`. Vitest bruges til enhedstests, Supertest til API og Playwright til end‑to‑end flows. |
| **CI/CD**                | GitHub Actions workflows i `.github/workflows` håndterer lint, test, build og deployment. Conventional Commits bruges til versionsstyring og changelog. |

## Kørsel og udvikling

Følgende kommandoer udføres fra roden af monorepoet:

```
make dev        # starter Next.js appen på http://localhost:3000
make db:migrate # migrerer Postgres databasen med schema, triggers og RLS
make db:seed    # indlæser eksempeldata
make test       # kører Vitest‑ og Playwright‑test
make build      # bygger frontend til produktion
```

### Miljøvariabler

Se `.env.example` for en liste over påkrævede miljøvariabler til Supabase, JWT, Scafix og E‑Komplet. Alle hemmeligheder skal defineres i en `.env` fil i roden (kom ikke med i Git).

## Licence

Dette projekt udgives under MIT‑licensen. Se `LICENCE` hvis du ønsker flere oplysninger.
