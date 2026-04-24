# Relatório de Code Review: Soluções Digitais

Revisão do estado do repositório após a limpeza de 2026-04-24.

## Sumário

| Categoria | Status | Observação |
| :--- | :--- | :--- |
| Arquitetura | ✅ Coerente | Pure UI bem separada. Astro read-only sobre MinIO, n8n escreve via nodo S3. |
| Tipos | 🟡 Mismatch conhecido | Campo `status` em `types/index.ts` ainda está como enum de string mas em runtime é boolean vindo do checkbox da Sheet. Não corrigido nesta rodada por envolver também o lado n8n/Sheet. |
| Segurança (app) | ✅ OK | Basic Auth com comparação timing-safe em `auth.ts`. |
| Segurança (n8n) | 🔴 Gap | Os dois webhooks (`sync-portfolio`, `sync-portfolio-image`) estão sem autenticação. Configurar Header Auth em n8n é prioridade. |
| Performance | ✅ OK | Sem cache-buster forçado em imagens após limpeza. CDN/navegador voltam a cachear. |
| Docs | ✅ Sincronizada | `CLAUDE.md`, `README.md`, `ARCHITECTURE.md` descrevem o fluxo real. |

## Decisões tomadas na limpeza

- **Endpoint `/api/projects` removido.** Era código vestigial da arquitetura anterior (pré-MinIO). As funções no-op `upsertProject`/`removeProject`/`replaceAllProjects` em `storage.ts` foram eliminadas junto com o whitelist `PUBLIC_APIS` do middleware.
- **Env vars mortas removidas** do `env.d.ts`: `SYNC_SECRET`, `AUTH_SECRET`, `DATA_FILE`. As vars vivas são `ADMIN_USER`, `ADMIN_PASS` e `PROJECTS_URL`.
- **`httpsAgent` removido** de `storage.ts`. O fetch nativo do Node (undici) ignora a opção `agent`, então a linha não tinha efeito. Se algum dia o MinIO passar a cert self-signed, usar `dispatcher` do undici em vez disso.
- **Cache-buster `?v=${Date.now()}`** removido de `getImageUrl`. Era gerado em cada render SSR, quebrando cache de CDN e navegador.

## Débitos conhecidos (não resolvidos nesta rodada)

- **Schema `status`** desalinhado entre `types/index.ts` (string enum), validação histórica e runtime (boolean). A correção requer definir em conjunto com o lado n8n/Sheet se o campo é boolean "published" ou enum de texto. 6 erros `ts(2367)` relacionados aparecem em `astro check`.
- **`getImageUrl` retorna `string | undefined`** mas `UIProject.image` / `UIProject.gallery` são tipados como `string` / `string[]`. 2 erros `ts(2322)` em `view-models.ts`. Solução mínima: relaxar o tipo do view-model ou filtrar undefined antes.
- **Webhooks n8n sem autenticação** (ver Sumário).
- **Payload do modal O(n):** todos os `UIProject` são serializados no HTML inicial para hidratar o modal. Escalável até poucas centenas de projetos.
- **`<img>` sem `width`/`height`** em `ProjectCard.astro` — leve risco de CLS.

## Veredicto

Arquitetura clara e enxuta após a limpeza. Os débitos restantes são conhecidos e documentados; nenhum é bloqueante para produção, mas o gap de autenticação nos webhooks n8n deve ser tratado antes do próximo ciclo de mudanças.
