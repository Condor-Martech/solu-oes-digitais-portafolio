# Projeto: Soluções Digitais — Portfólio

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
- Adapter `@astrojs/vercel`. Deploy: Vercel.
- Skills aplicáveis: `tailwind-patterns`, `frontend-ui-engineering`, `api-and-interface-design`. Skills `react-best-practices` e `nextjs-react-expert` **não** se aplicam (Astro ≠ React/Next).
- Dev: `npm run dev` (porta 4321). Build: `npm run build`. Preview: `npm run preview`.
- **Source-of-truth**: `projects.json` armazenado em **MinIO S3** (`s3.cndr.me/lp-content/projects.json`). Astro só lê; quem escreve é n8n.
- `src/data/projects.json` é apenas um **snapshot local** para desenvolvimento offline, não é usado em produção.
- Assets públicos: `public/screenshots/` e `public/logos/`. Imagens de projetos vivem no bucket MinIO.

## Arquivos principais

- `src/pages/index.astro` — grid de projetos com filtros.
- `src/middleware.ts` — Basic Auth gate para toda a aplicação (exceto estáticos).
- `src/layouts/Base.astro` — layout base (fontes, meta, skip-link).
- `src/components/ProjectCard.astro`, `ProjectModal.astro`, `FilterBar.astro`, `Header.astro`.
- `src/components/ui/` — primitivos: `Badge`, `BaseModal`, `BaseDrawer`, `Icon`.
- `src/lib/storage.ts` — fetch read-only do `projects.json` em MinIO (sem cache em memória).
- `src/lib/projects.ts` — filtros, paleta de cores por empresa, helpers de texto.
- `src/lib/view-models.ts` — transforma `Project → UIProject` (galería, temas, parágrafos).
- `src/lib/ui-helpers.ts` — cálculos CSS puros e normalização de URLs de imagem.
- `src/lib/auth.ts` — `verifyBasicAuth` com comparação timing-safe (`ADMIN_USER` + `ADMIN_PASS`).
- `src/scripts/modal.ts`, `filter.ts` — controladores DOM (web components nativos).
- `src/styles/globals.css` — `@import "tailwindcss"` + `@theme` com tokens OKLCH.

## Regras fixas do produto

- Fundo `#F7F6F3`, superfícies brancas.
- Tipografia: DM Sans (textos) + DM Mono (labels, links, contador).
- Bordas 0.5px, **sem sombras, sem gradientes**.
- Hover nos cards: escurecer a imagem + label "Ver detalhes" centralizada.
- Cores das tags: atribuição automática via hash (paleta definida em `src/lib/projects.ts`).
- Filtros derivados automaticamente do JSON (chips de `company` / `type`).

## Fluxo de dados real

```text
Google Sheet ──(Apps Script)──▶ n8n webhook (sync-portfolio)
                                     │
                                     ▼
                              Download projects.json ← MinIO S3
                                     │
                              Upsert Logic (code node, shallow merge)
                                     │
                                     ▼
                              Upload projects.json ──▶ MinIO S3
                                                          │
                                                          │ fetch read-only
                                                          ▼
                                                    Astro SSR (Vercel)
```

- **n8n escreve direto no bucket** via nodo S3 — não há endpoint HTTP em Astro para isso.
- Imagens: webhook `sync-portfolio-image` recebe base64, sobe PNG ao bucket; o Apps Script do Sheet atualiza a célula com a URL resultante.
- Fonte de verdade é a Sheet. Se `projects.json` for corrompido, rodar a sync do Sheet de novo.

## Env vars

- `ADMIN_USER`, `ADMIN_PASS` — credenciais Basic Auth (obrigatórias).
- `PROJECTS_URL` — URL pública do `projects.json` no MinIO (obrigatória).
