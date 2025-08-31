Monorepo‑struktur
=================

```
aibuildscript/
├── README.md
├── DECISIONS.md
├── Verification_Checklist.md
├── TREE.md
├── .env.example
├── .gitignore
├── Makefile
├── package.json
├── tsconfig.base.json
├── docs/
│   ├── architecture.mmd
│   └── rbac.mmd
├── supabase/
│   ├── schema.sql
│   ├── seeds.sql
│   ├── triggers.sql
│   ├── rls.sql
│   └── functions/
│       └── digest.ts
├── apps/
│   └── web/
│       ├── package.json
│       ├── tsconfig.json
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── public/
│       │   ├── manifest.json
│       │   ├── robots.txt
│       │   ├── icon-192.png
│       │   └── icon-512.png
│       ├── app/
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── api/
│       │       ├── projects/route.ts
│       │       ├── time-entries/route.ts
│       │       ├── export/route.ts
│       │       ├── scafix/
│       │       │   └── event/route.ts
│       │       └── notifications/
│       │           └── subscribe/route.ts
│       ├── components/
│       │   └── Stamping.tsx
│       ├── lib/
│       │   ├── supabaseClient.ts
│       │   ├── encryption.ts
│       │   ├── useOfflineQueue.ts
│       │   └── rbac.ts
│       ├── tests/
│       │   └── e2e/
│       │       └── home.spec.ts
│       └── playwright.config.ts
├── packages/
│   ├── exports/
│   │   ├── package.json
│   │   ├── index.ts
│   │   ├── generateCsv.ts
│   │   ├── generateXlsx.ts
│   │   ├── generatePdf.ts
│   │   └── tests/
│   │       └── generate.test.ts
│   └── scafix/
│       ├── package.json
│       └── wrapper.tsx
└── .github/
    └── workflows/
        ├── pr.yml
        └── main.yml
```

Denne oversigt viser alle filer og mapper, der leveres i monorepoet. Ikonfilerne i `public/` er binære og kan ses i repository.