# Changelog

Todas as mudanças notáveis deste projeto. Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [0.2.0] — 2026-04-21

### Adicionado
- **Carrossel mobile:** Em telas < 640px os projetos são exibidos em carrossel horizontal com Scroll Snap e Scroll-Driven Animations (escala + blur ao deslizar).
- **`src/components/ui/`:** Biblioteca de primitivos reutilizáveis: `Badge`, `BaseModal`, `BaseDrawer`, `Icon`.
- **`src/types/index.ts`:** Centralização de todos os tipos e interfaces TypeScript.
- **`src/lib/view-models.ts`:** Camada de transformação `Project → UIProject` com otimização WebP e cálculo de temas.
- **`src/lib/storage.ts`:** Módulo dedicado de fetch remoto sem cache em memória (dados atualizados a cada requisição SSR).
- **`src/scripts/modal.ts` e `filter.ts`:** Controladores DOM extraídos dos componentes Astro.
- **`src/data/projects.json`:** Snapshot local para desenvolvimento offline.
- **`llms.txt`:** Mapa de arquitetura para agentes de IA.
- **`docs/ADR-001-pure-ui.md`:** Registro de decisão de arquitetura Pure UI.
- **`docs/product-overview.md`:** Resumo do produto para PO e stakeholders não técnicos.
- **`CHANGELOG.md`:** Este arquivo.

### Alterado
- **Arquitetura Pure UI:** Desacoplamento total de lógica em `FilterBar.astro`, `ProjectCard.astro` e `ProjectModal.astro`. Os componentes são agora templates HTML puros.
- **`storage.ts`:** Eliminado o cache singleton (`mem`) que impedia ver mudanças em produção em Lambdas quentes da Vercel.
- **`globals.css`:** Migração de cores para OKLCH (Tailwind v4), novos tokens de raio e sombra.
- **`BaseModal.astro`:** Adicionado `overflow-hidden` para que a imagem respeite as bordas arredondadas.
- **`ProjectCard.astro`:** Footer com `line-clamp-2` para altura consistente entre cards, padding reduzido.
- **`FilterBar.astro`:** Drawer mobile com `BaseDrawer` em vez de modal inline.
- **n8n Webhook:** Migração de URL de Teste para URL de Produção para ativação autônoma.

### Corrigido
- **Modal:** Imagem com cantos retos que ultrapassavam o border-radius do container.
- **Carrossel:** Conflito entre `flex` e `grid` no breakpoint `sm:` (640px) que quebrava o layout em tablets.
- **API `/api/projects`:** Faltava `Externo` no conjunto de valores permitidos para `production`.
- **API `/api/projects`:** Sem validação para `status` e `type`, permitindo dados inválidos.
- **Responsividade:** Sem `body { overflow-x: hidden }`, o carrossel causava scroll horizontal na página.
- **n8n → Vercel:** Dados não eram atualizados em produção por causa do cache em memória do `storage.ts`.

---

## [0.1.0] — 2026-04-15

### Adicionado
- Release inicial do portfólio com grade de projetos.
- Sincronização remota via Minio (compatível com S3).
- Modal de detalhe de projeto com design split-screen.
- Filtro por empresa (desktop chips + drawer mobile).
- Deploy na Vercel com adaptador SSR `@astrojs/vercel`.
- Autenticação básica HTTP para painel de gestão.
