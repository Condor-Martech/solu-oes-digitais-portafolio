# LP Hub — Portfólio

Portfólio interno (sites e landing pages) do time. Aplicação **Astro 5 SSR** com **Tailwind v4**, servida atrás de login. O conteúdo é sincronizado a partir de uma **Google Sheet via n8n** — o Sheet + n8n são o backoffice, não existe admin UI.

Versão anterior (HTML/CSS/JS puros) preservada na branch `archive/pre-astro`.

## Stack

- Astro 5 + TypeScript (strict)
- Tailwind v4 via `@tailwindcss/vite` com tokens em `@theme`
- Adapter: `@astrojs/node` (standalone)
- Runtime: Node 20+
- Deploy: VPS próprio com PM2 + Nginx (TLS)

## Dev local

```bash
# 1. instalar
npm install

# 2. criar .env a partir do .env.example e preencher secrets
cp .env.example .env
# gerar segredos: openssl rand -hex 32

# 3. rodar
npm run dev
# http://localhost:4321
```

Variáveis obrigatórias no `.env`:

| Var | Uso |
|---|---|
| `ADMIN_USER` | usuário único do login |
| `ADMIN_PASS` | senha em plano (arquivo .env já é segredo) |
| `AUTH_SECRET` | chave HMAC da cookie de sessão (min 16 chars) |
| `SYNC_SECRET` | token que n8n envia no header `x-sync-token` |
| `SESSION_MAX_AGE` | opcional, segundos (default 604800 = 7 dias) |
| `DATA_FILE` | opcional, caminho do JSON canônico (default `./data/projects.json`) |

## Comandos

```bash
npm run dev       # dev server em :4321
npm run build     # build SSR para ./dist
npm run start     # produção: node ./dist/server/entry.mjs
```

## Estrutura

```
src/
├── data/projects.json        # seed imutável (em git)
├── layouts/Base.astro
├── components/               # ProjectCard, ProjectModal, FilterBar, Header, Tag
├── pages/
│   ├── index.astro           # grid + filtros SSR
│   ├── login.astro
│   └── api/
│       ├── projects.ts       # POST (x-sync-token) para n8n
│       ├── login.ts
│       └── logout.ts
├── lib/
│   ├── projects.ts           # tipos + paleta de tags + filtros
│   ├── storage.ts            # read/write atômico + queue de writes
│   └── auth.ts               # HMAC cookie + validate credentials
├── middleware.ts             # gate de sessão
├── styles/globals.css        # @import tailwindcss + @theme + componentes
└── env.d.ts

public/
├── screenshots/              # capturas referenciadas por projects.json
└── logos/                    # reserva

data/projects.json            # runtime state (gitignored, seeded no 1º boot)
```

## Sincronização com Google Sheet (via n8n)

O endpoint `POST /api/projects` recebe três ops de n8n, sempre com header `x-sync-token: <SYNC_SECRET>`:

**upsert** (disparo onEdit por linha):

```json
{
  "op": "upsert",
  "project": {
    "id": "condor-em-casa",
    "title": "Condor em Casa",
    "company": "Condor",
    "link": "https://www.condoremcasa.com.br/",
    "production": "Terceiro",
    "image": "/screenshots/condor_em_casa_full.png",
    "desc": "..."
  }
}
```

**delete** (somente após aprovação manual — n8n usa nó _Send and Wait for Response_):

```json
{ "op": "delete", "id": "condor-em-casa" }
```

**replace_all** (bootstrap/resync):

```json
{ "op": "replace_all", "projects": [ /* array completo */ ] }
```

`production ∈ { "Interno", "Terceiro", "Agência" }`. Qualquer outro valor → 400.

## Fonte de verdade

A Google Sheet é a fonte de verdade. O arquivo `data/projects.json` no servidor é estado derivado — se apagar, basta rodar um `replace_all` para reconstruir. Sem backup automático.

## Auth

Login único via cookie HMAC (`lphub_session`) assinada com `AUTH_SECRET`. Todas as rotas exigem sessão, exceto `/login`, `/api/login` e `/api/projects` (este último autentica por `x-sync-token`). Assets estáticos em `/screenshots` e `/logos` passam sem gate.

Senha fica em plano no `.env` — contexto é VPS privado com um único admin; bcrypt não agregaria proteção real aqui.

## Plano de migração

Detalhes e decisões em [task-astro-migration.md](task-astro-migration.md).
