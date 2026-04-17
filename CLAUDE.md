# Projeto: LP Hub — Portfólio

Página estática (HTML + CSS + JS puros, sem bundler) que apresenta os projetos do time.

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

- **Sem React, sem Next.js, sem TypeScript, sem Tailwind.** HTML semântico + CSS custom + ES modules nativos.
- Skills como `react-best-practices`, `tailwind-patterns` e `nextjs-react-expert` **não se aplicam** aqui — ignore-as mesmo quando o frontmatter do agente as liste.
- Servir com `python3 -m http.server 8765` durante desenvolvimento. Módulos ES exigem HTTP (não `file://`).
- Imagens em `screenshots/` e `logos/`. Dados em `js/data.js` (array `projects`).
- Embed via iframe: caminhos relativos — o iframe deve carregar do mesmo host que os assets.

## Arquivos principais

- `portfolio.html` — estrutura
- `styles.css` — tokens, componentes, estados, responsive
- `js/app.js` — entrypoint (render + state + URL sync)
- `js/data.js` — `projects[]` e `tagPalette[]`
- `js/utils.js` — helpers puros (escape, hash, tags, focus trap)
- `js/modal.js` — modal com focus trap e scroll lock

## Regras fixas do produto

- Fundo `#F7F6F3`, superfícies brancas.
- Tipografia: DM Sans (textos) + DM Mono (labels, links, contador).
- Bordas 0.5px, **sem sombras, sem gradientes**.
- Hover nos cards: escurecer a imagem + label "Ver detalhes" centralizada.
- Cores das tags: atribuição automática via hash da tag (paleta em `data.js`).
- Funcionar embedado via iframe — sem dependências externas além do Google Fonts.
