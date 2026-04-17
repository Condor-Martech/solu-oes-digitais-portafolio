# Projeto: LP Hub — Portfólio

Aplicação Astro (SSR, adapter Node) com Tailwind v4 que apresenta os projetos do time. O conteúdo é sincronizado a partir de uma Google Sheet via n8n — o Sheet + n8n são o backoffice, não há admin UI própria.

O plano completo da migração está em [task-astro-migration.md](task-astro-migration.md). O snapshot da versão anterior (HTML/CSS/JS puros) vive na branch `archive/pre-astro`.

## Auto-routing do framework `.agent/`

Este repo usa o **Antigravity Kit** em `.agent/`. Antes de responder a qualquer pedido neste projeto:

1. **Leia as regras globais:** `.agent/rules/GEMINI.md` — protocolo de tiers, classificador de request, intelligent routing.
2. **Classifique o pedido** (QUESTION / SURVEY / SIMPLE CODE / COMPLEX CODE / DESIGN-UI / SLASH CMD) conforme a tabela em GEMINI.md.
3. **Selecione o(s) agente(s)** em `.agent/agents/` que combinam com o domínio detectado. Informe ao usuário (em 1 linha) qual agente está sendo aplicado.
4. **Carregue as skills** listadas no `frontmatter` do agente, usando leitura seletiva:
   - Leia sempre primeiro o `SKILL.md` (índice) de cada skill.
   - Só leia as seções/arquivos da skill que sejam relevantes ao pedido. **Não** leia a skill inteira.
5. **Aplique** as regras na resposta/implementação. Prioridade: **P0 GEMINI.md > P1 agente > P2 SKILL.md**.

### Atalhos que o usuário pode escrever

| Input do usuário                          | Interpretação                                                 |
|------------------------------------------|----------------------------------------------------------------|
| `/agent <nome>`                          | Carregar `.agent/agents/<nome>.md` + skills do frontmatter     |
| `/workflow <nome>`                       | Carregar e executar `.agent/workflows/<nome>.md`               |
| `/skill <nome>`                          | Carregar `.agent/skills/<nome>/SKILL.md` como referência       |

Se o pedido não casar com nenhum agente específico, siga o auto-routing descrito em GEMINI.md.

### Quando criar `{task-slug}.md`

Para tarefas classificadas como **COMPLEX CODE** ou **DESIGN/UI** (conforme GEMINI.md), crie um arquivo de plano `task-<slug>.md` antes de implementar, como exige o framework.

## Stack e convenções deste projeto

- **Astro 5 (SSR) + TypeScript + Tailwind v4** via `@tailwindcss/vite`.
- Adapter `@astrojs/node` em mode `standalone`. Deploy: VPS próprio com PM2 + Nginx.
- Skills aplicáveis: `tailwind-patterns`, `frontend-ui-engineering`, `api-and-interface-design`. Skills `react-best-practices` e `nextjs-react-expert` **não** se aplicam (Astro ≠ React/Next).
- Dev: `npm run dev` (porta 4321). Build: `npm run build`. Start: `npm run start`.
- Dados canônicos: `src/data/projects.json`. Reescrito pelo endpoint `/api/projects` quando n8n dispara (atomic write-then-rename).
- Assets públicos: `public/screenshots/` e `public/logos/`.

## Arquivos principais

- `src/pages/index.astro` — grid de projetos com filtros por company/production.
- `src/pages/login.astro` + `src/pages/api/login.ts` — autenticação por cookie HMAC.
- `src/pages/api/projects.ts` — endpoint que recebe payloads de n8n (`upsert`, `delete`, `replace_all`). Header `x-sync-token`.
- `src/middleware.ts` — gate de sessão.
- `src/layouts/Base.astro` — layout base (fontes, meta).
- `src/components/ProjectCard.astro`, `ProjectModal.astro`, `FilterBar.astro`, `Header.astro`.
- `src/lib/storage.ts` — read/write atômico do JSON.
- `src/lib/projects.ts` — upsert/delete/replaceAll no array em memória.
- `src/lib/auth.ts` — sign/verify cookie HMAC.
- `src/styles/globals.css` — `@import "tailwindcss"` + `@theme` com tokens.

## Regras fixas do produto

- Fundo `#F7F6F3`, superfícies brancas.
- Tipografia: DM Sans (textos) + DM Mono (labels, links, contador).
- Bordas 0.5px, **sem sombras, sem gradientes**.
- Hover nos cards: escurecer a imagem + label "Ver detalhes" centralizada.
- Cores das tags: atribuição automática via hash (paleta definida em `src/lib/projects.ts`).
- Filtros derivados automaticamente do JSON (chips de `company` e `production`).

## Contrato Sheet ↔ n8n ↔ Astro

Colunas da Google Sheet: `id | title | company | link | production | image | desc | _marked_delete`.

n8n envia para `POST /api/projects` com header `x-sync-token`:

- `{ op: "upsert", project }` em onEdit de fila.
- `{ op: "delete", id }` somente após aprovação manual (n8n usa nó _Send and Wait for Response_).
- `{ op: "replace_all", projects: [...] }` para bootstrap/resync.

Fonte de verdade é a Sheet. Não há backup de `projects.json` — se perder, basta rodar `replace_all` de novo.
