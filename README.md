# LP Hub — Portfólio

Portfólio interno de sites e landing pages da equipe. Aplicação **Astro 5 SSR** hospedada na Vercel com dados gerenciados remotamente através do Minio (compatível com S3) e automação via n8n.

---

## Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.local.example .env.local
# → Editar .env.local com suas credenciais

# 3. Iniciar servidor de desenvolvimento
npm run dev
# → http://localhost:4321
```

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `PROJECTS_URL` | ✅ | URL pública do JSON de projetos no Minio | `https://minio.cndr.me/lp-content/projects.json` |
| `ADMIN_USER` | ✅ | Usuário para acesso ao painel | `admin` |
| `ADMIN_PASS` | ✅ | Senha de acesso | —  |
| `AUTH_SECRET` | ✅ | Chave HMAC para sessão HTTP | Gerar: `openssl rand -hex 32` |
| `SYNC_SECRET` | ✅ | Token enviado em `x-sync-token` pelo n8n | — |

> **Nota:** Sem `PROJECTS_URL` configurada, o servidor lançará um erro crítico ao iniciar. Não há fallback em produção.

## Fluxo de Dados

```
Google Sheets → n8n Webhook → MinIO (S3) → Vercel SSR → Usuário
```

1. **Google Sheets** funciona como CMS. Um script do Apps Script chama o Webhook do n8n ao editar.
2. **n8n** executa o upsert do projeto no JSON e faz upload para o bucket `lp-content/projects.json` no Minio.
3. **Vercel (SSR)** baixa o JSON a cada requisição sem cache em memória, sempre exibindo dados atualizados.

## Comandos

```bash
npm run dev       # Servidor de desenvolvimento com HMR
npm run build     # Build de produção (executado automaticamente pela Vercel)
npx astro check   # Verificação de tipos TypeScript
```

## Estrutura do Projeto

```
src/
├── types/index.ts        # 📐 Contratos de dados (interfaces TS)
├── lib/
│   ├── storage.ts        # 🗄️  Fetch remoto do JSON (Minio) — sem cache
│   ├── projects.ts       # 🔧 Lógica de filtros, paleta de cores
│   ├── view-models.ts    # 🎨 Transformação de dados → UI (WebP, temas)
│   └── ui-helpers.ts     # 💅 Classes CSS, delays de animação
├── components/
│   ├── ui/               # Componentes primitivos (Badge, Modal, Drawer, Icon)
│   ├── ProjectCard.astro # Card representacional pura
│   ├── ProjectModal.astro# Modal com dados do projeto
│   └── FilterBar.astro   # Barra de filtros (desktop + drawer mobile)
├── scripts/
│   ├── modal.ts          # Controlador do modal (DOM)
│   └── filter.ts         # Controlador do drawer de filtros (DOM)
├── pages/
│   ├── index.astro       # Página principal
│   └── api/projects.ts   # Endpoint SSR para sincronização
└── data/projects.json    # ⚠️  Apenas para desenvolvimento local offline
```

## Arquitetura

O projeto segue o padrão **Pure UI**. Os componentes `.astro` são templates HTML puros sem lógica de negócio. Ver [ADR-001](./docs/ADR-001-pure-ui.md) para o detalhe da decisão.

## Documentação

- [📋 Resumo do Produto (PO)](./docs/product-overview.md) — O que é, como funciona, para stakeholders
- [Esquema de Dados](./docs/data-schema.md) — Interfaces e valores permitidos
- [ADR-001: Pure UI](./docs/ADR-001-pure-ui.md) — Decisão de arquitetura
- [CHANGELOG](./CHANGELOG.md) — Histórico de versões

## Contribuindo

1. Todos os tipos vão em `src/types/index.ts`.
2. A lógica de transformação vai em `src/lib/view-models.ts`.
3. Os componentes `.astro` só recebem `UIProject` — nunca `Project` bruto (exceto `index.astro` e `FilterBar`).
4. Execute `npx astro check` antes de qualquer PR.

## Licença

MIT © LP Hub Team
