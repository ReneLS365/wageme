# Verifikationscheckliste

Denne checkliste dækker de vigtigste krav til applikationen. Brug den som reference under test og validering.

## Installation og migrering

* [ ] Supabase kører lokalt, og `make db:migrate` udfører alle migrations uden fejl.
* [ ] Seed‑data indlæses uden konflikter med `make db:seed`.

## Funktionalitet

* [ ] PWA installerbar på mobil og desktop via browserens "Føj til startskærm".
* [ ] Bruger kan stemple ind, sætte pause og afslutte på to tryk. 
* [ ] Når der er offline‑forbindelse, gemmes stemplingen i en krypteret kø og synkroniseres under 100 ms efter genforbindelse.
* [ ] Ændringer foretaget af en manager genererer en ChangeLog‑post, og brugeren modtager en push‑notifikation med “Kvitter for ændring”.
* [ ] Scafix‑integration fungerer end‑to‑end: der kan startes en registrering, CountSheet bliver gemt, og der oprettes et ExportJob.
* [ ] Eksport i CSV, XLSX og PDF fungerer, og decimalformat tilpasses ved `exports.decimal` flaget.
* [ ] Daglige/ugentlige digest‑emails sendes af Edge Function’en og indeholder en liste over nye ChangeLogs. Kun én mail pr. dag/uge pr. modtager.

## Sikkerhed og politikker

* [ ] RLS‑politikker håndhæver, at brugere kun kan se projekter, de er medlem af.
* [ ] Audit‑triggere logger alle INSERT, UPDATE og DELETE handlinger i tabellerne og er immutable.
* [ ] GDPR‑funktioner såsom sletning, eksport af persondata og samtykke er implementeret i backend.

## Test og SLO

* [ ] Alle Vitest, Supertest og Playwright tests passerer lokalt og i CI.
* [ ] SLO‑prober opfyldes: opstart < 2s, lokal commit < 100ms, push P95 < 5s, eksport af 5k rækker < 10s.
* [ ] GitHub Actions workflows (PR, main) kører succesfuldt og offentliggør et changelog baseret på Conventional Commits.
