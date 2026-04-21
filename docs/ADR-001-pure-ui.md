# ADR-001: Arquitetura Pure UI e Desacoplamento de Lógica

## Status
`Aceito` — Implementado na v0.2.0

---

## Contexto

Os componentes `.astro` cresceram em complexidade misturando responsabilidades: lógica de transformação de dados (view models), cálculos visuais (classes CSS, delays), definições de tipos e scripts de cliente no mesmo arquivo. Isso dificultava a manutenção, os testes e a reutilização de lógica entre componentes.

---

## Decisão

Migramos para um padrão **Pure UI** com separação estrita de camadas:

### Camadas do Sistema

```
[Minio / S3]
     ↓  JSON bruto
[src/lib/storage.ts]       → Fetch remoto, sem cache
     ↓  Project[]
[src/lib/projects.ts]      → Filtros, parsing, paleta de cores
     ↓  Project[]
[src/lib/view-models.ts]   → Transformação → UIProject (WebP, temas, parágrafos)
     ↓  UIProject[]
[src/components/*.astro]   → Renderização HTML pura (APENAS templates)
     ↓  HTML
[src/scripts/*.ts]         → Interatividade DOM no cliente (modal, drawer)
```

### Regras da Arquitetura

1. **`src/types/index.ts`** — Único lugar para interfaces e tipos TypeScript. Nenhum outro arquivo os define.
2. **`src/lib/view-models.ts`** — Prepara `Project → UIProject`: otimização WebP, cálculo de classes de tema, formatação de texto.
3. **`src/lib/ui-helpers.ts`** — Cálculos CSS puros: delays de animação, geração de hrefs de filtro.
4. **`src/components/*.astro`** — Recebem apenas `UIProject` (já processado). Zero lógica de negócio.
5. **`src/scripts/*.ts`** — Controladores DOM puros. Gerenciam interatividade do modal e do drawer de filtros.
6. **`src/data/projects.json`** — Apenas para desenvolvimento local offline. Não utilizado em produção.

---

## Consequências

### ✅ Benefícios

- **Componentes previsíveis:** Um `.astro` com as mesmas props sempre gera o mesmo HTML. Fácil de raciocinar.
- **Lógica testável:** As funções em `view-models.ts` e `ui-helpers.ts` são funções puras importáveis com Jest/Vitest.
- **Separação de estilos e dados:** Mudar o sistema de temas (cores, badges) não requer tocar componentes.
- **Performance SSR:** Os dados chegam pré-processados ao template; sem trabalho adicional no render path.

### ⚠️ Trade-offs

- Mais arquivos em `src/lib/` para um projeto que poderia ser mais simples.
- O fluxo de dados é indireto: `Page → view-model → component` em vez de `Page → component`. Requer entender a cadeia.

---

## Referências

- `src/types/index.ts` — Contratos de dados
- `src/lib/view-models.ts` — Transformação de dados
- `src/lib/ui-helpers.ts` — Helpers visuais
- `src/scripts/modal.ts` — Controlador de interatividade
