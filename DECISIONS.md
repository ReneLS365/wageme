# Beslutninger og Konflikter

Dette dokument beskriver større beslutninger taget under udarbejdelsen af dette monorepo samt hvordan eventuelle konflikter mellem input blev løst.

## Arkitekturvalg

* **Valg af Next.js App Router**: Appen bygges med Next.js 13 (App Router) for at udnytte serverklientens fleksibilitet. API‑routes implementeres som route handlers i `app/api` og deler kode med frontend. Traditionel `pages`‑mappe er ikke anvendt.
* **Supabase med Postgres og RLS**: Postgres er databasen og Supabase leverer autentifikation, RLS og Edge Functions. RLS‑politikker pr. projekt sikrer, at brugere kun ser og ændrer data de har adgang til. 
* **Dexie + AES‑GCM til offline kø**: For at støtte offline‑first blev Dexie (IndexedDB wrapper) kombineret med AES‑GCM kryptering. Køen lagres lokalt og synkroniseres, når netværket gendannes. Hemmeligheden til kryptering er gemt i `localStorage`.
* **2‑tap stempling**: UI‑komponenten `Stamping` tilbyder start/stop/pause med to tryk. En pause genererer en separat tidslinjepost med type `pause`.
* **ChangeLog som append‑only JSONB**: Ændringer logges i tabellen `change_logs` via triggers. I stedet for at forsøge at beregne diffs i SQL gemmes både gamle og nye værdier i feltet `changes`.
* **Integration med Scafix**: Scafix embeddes via et iframe, og en simpel event‑bro lytter efter meddelelser. Når Scafix genererer et CountSheet, persisteres hændelsen og der oprettes et `ExportJob`.
* **E‑Komplet eksport**: Eksportfunktionerne understøtter CSV, XLSX og PDF. For at undgå decimalfejl tilbydes en `exports.decimal` feature flag, der konverterer decimaler til punktum eller komma efter behov.
* **Digest e‑mails via Edge Function**: En Supabase Edge Function (`supabase/functions/digest.ts`) sender et samlet digestrapport per projekt dagligt/ugentligt. Funktionen grupperer ændringer og sender én mail pr. modtager.

## Konfliktløsning

* **Kryptering kontra ydeevne**: AES‑GCM kryptering i browseren kan have performance overhead. Vi valgte at nøjes med at kryptere payloaden i køen, mens metadata (method, url) ligger i klartekst for hurtigere synkronisering.
* **Audit‑trail vs. diff**: Den oprindelige specifikation krævede append‑only JSONB diffs. Da Postgres ikke har en indbygget diff‑funktion, gemmes i stedet både `old` og `new` værdier i ændringsloggen. En senere eksport kan beregne diffen ved behov.
* **RLS for CountSheet**: CountSheets er immutable, hvilket konflikterede med et krav om at kunne revidere. Vi valgte at tillade `update` for `manager` og `admin` i en kort periode, men `delete` er aldrig tilladt. Eventuelle revisioner tilføjes som nye rækker.
* **Ikoner i manifest**: For at undgå eksterne filer er ikoner indlejret som base64‑data i `public/manifest.json`. Det gør det nemmere at levere en fuldkommen PWA uden afhængigheder.

Yderligere beslutninger og afvigelser noteres løbende i dette dokument efterhånden som projektet udvikles.
