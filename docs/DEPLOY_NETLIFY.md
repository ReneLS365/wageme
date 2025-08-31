# Deploy til Netlify (monorepo: apps/web)

## Forudsætninger
- Netlify‑konto (gratis).
- Repo på GitHub/GitLab/Bitbucket.
- Miljøvariabler klar (se `.env.production.example`).

## Hurtig UI‑deploy (anbefalet)
1. Gå til **Netlify > Add new site > Import from Git**.
2. Vælg repo’et.
3. **Base directory**: `apps/web`  
   **Build command**: `npm run build`  
   **Publish directory**: `apps/web/.next`
4. Under **Site settings > Build & deploy > Environment**: tilføj alle env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SCAFIX_URL`
   - `EKOMPLET_API_TOKEN`
   - `JWT_SECRET`
5. Deploy. Netlify auto‑detekterer Next.js og aktiverer `@netlify/plugin-nextjs`.  
6. Tilpas domæne under **Domain management**.

## CI via GitHub Actions
1. Opret GitHub‑secrets på repoet:
   - `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
   - Samt alle de nævnte runtime‑secrets.
2. Enable workflow `.github/workflows/netlify.yml`.
3. Push til `main` → automatisk build + prod deploy.

## Fejlretning
- **Blank side/404**: Tjek at plugin er aktivt og redirect i `netlify.toml` findes.
- **SSR fejl**: Tjek env vars og at `SUPABASE_SERVICE_ROLE_KEY` er sat.
- **Assets mangler**: Sørg for at `apps/web/public/` inkluderer PWA‑filerne.

---

# Alternativ: Google Play (Android) via TWA/Bubblewrap (PWA → APK)
> Overblik: Kræver Google Play Developer‑konto, Android SDK/Java, og `@bubblewrap/cli`. Se detaljer i din Play Console og Bubblewrap‑guides.

**Trin i korte træk**
1. Installer: `npm i -g @bubblewrap/cli`.
2. Init: `bubblewrap init --manifest=https://<DIT_DOMÆNE>/manifest.json` (Bubblewrap spørger om navn, package, keystore).
3. Build: `bubblewrap build` → genererer signeret `app-release-signed.apk` og `assetlinks.json`.
4. Læg `assetlinks.json` i `https://<DIT_DOMÆNE>/.well-known/assetlinks.json`.
5. Upload APK i Google Play Console (kræver dev‑konto).  
   Husk: højopløseligt ikon og featured graphic.

---

# Post‑deploy tjek
- PWA installerbar, ikoner/manifest loader.
- API endpoints svarer (200) og RLS/roller virker.
- Offline kø commit <100ms; sync ved online.
- Eksporter (CSV/XLSX/PDF) fungerer.

---

## Kort forklaring (hvorfor ovenstående valg)
- **@netlify/plugin-nextjs** håndterer SSR/ISR, functions og routing automatisk på Netlify for Next 13+.
- **Monorepo base** i `netlify.toml` sikrer, at Netlify bygger fra `apps/web` i stedet for repo‑rod.
- **GitHub Action** giver én‑klik CI deploy med hemligheder i GitHub Secrets.

## Alternativer A/B/C
- **A) Vercel**: Mindre konfig, bedst til Next.js – men vi valgte Netlify iht. dit ønske.
- **B) Static export** (`next export`): Simpelt CDN‑deploy, men mister SSR/Edge/API‑routes.
- **C) Docker på egen VPS**: Fuldkontrol; mere drift og sikkerhedsvedligehold.

## Verifikationstjekliste (deploy)
- [ ] Netlify build log uden fejl.
- [ ] Site URL svarer med forsiden og “Tidsregistrering”.
- [ ] API‑routes `/api/time-entries`, `/api/export` svarer.
- [ ] PWA installeres på Android/iOS/desktop.
- [ ] Scafix postMessage → `/api/scafix/event` opretter CountSheet + ExportJob.