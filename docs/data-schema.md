# Esquema de Dados — LP Hub

Referência completa dos contratos de dados utilizados no sistema.

---

## Fonte de Dados

O sistema utiliza uma estratégia de **Fetch Remoto em Tempo Real** sem cache em memória:

1. **Primária:** O SSR baixa `projects.json` do Minio a cada requisição.
2. **Offline/Dev:** Se `PROJECTS_URL` não estiver definida, o servidor lança um erro crítico. Para desenvolvimento sem rede, pode-se usar `src/data/projects.json` (apenas local, não deployável).

O arquivo JSON no Minio é a **única fonte de verdade**. É atualizado automaticamente pelo fluxo **Google Sheets → n8n → Minio**.

---

## Interface `Project` (Dados brutos)

Definida em `src/types/index.ts`. É a estrutura que vive no Minio e que a API valida.

```typescript
interface Project {
  id: string;          // Identificador único, kebab-case. Ex: "dia-das-maes"
  title: string;       // Nome visível do projeto
  company: string;     // Marca/empresa cliente. Ex: "Condor"
  link: string;        // URL completa de produção
  production: Production; // Tipo de gestão (ver tabela abaixo)
  status: ProjectStatus;  // Estado atual (ver tabela abaixo)
  image: string;       // Caminho público para a captura: "/screenshots/nome.png"
  desc: string;        // Descrição. Suporta quebras de linha com \n
  type: ProjectType[]; // Array de categorias. Ex: ["Lp", "Site"]
}
```

---

## Tipos Permitidos

### `Production`

| Valor | Cor do Badge | Significado |
|:---|:---|:---|
| `Interno` | Verde | Desenvolvido totalmente in-house |
| `Externo` | Slate | Gestão externa geral |
| `Terceiro` | Laranja | Desenvolvido por um fornecedor terceiro |
| `Agência` | Rosa | Projeto de agência colaboradora |

### `ProjectStatus`

| Valor | Indicador | Significado |
|:---|:---|:---|
| `No ar` | 🟢 Verde pulsante | Site ativo e acessível |
| `Fora do ar` | 🔴 Vermelho | Site inativo ou deprecado |

### `ProjectType`

| Valor | Descrição |
|:---|:---|
| `Lp` | Landing page ou página promocional única |
| `Software` | Aplicação interativa ou ferramenta complexa |
| `Site` | Site institucional, blog ou portal |

---

## Interface `UIProject` (Dados para a UI)

Estendida em `src/types/index.ts`. Gerada por `view-models.ts` antes de passar dados para os componentes.

```typescript
interface UIProject extends Project {
  descParagraphs: string[];   // desc dividido por \n em array de parágrafos
  theme: {
    company: string;          // Classes CSS Tailwind para o badge de empresa
    production: string;       // Classes CSS para o badge de produção
    status: string;           // Classes CSS para o indicador de estado
    types: {
      label: string;          // Texto do badge de tipo
      classes: string;        // Classes CSS para esse badge
    }[];
  };
}
```

---

## Mapa de Temas Visuais por Empresa

O sistema atribui automaticamente uma cor temática baseada em `company`. Centralizado em `src/lib/projects.ts`.

| Empresa | Cor | Token |
|:---|:---|:---|
| Condor | Azul | `blue` |
| Gigante | Âmbar | `amber` |
| Hipermais | Vermelho | `red` |
| Grupo Zonta | Cinza | `slate` |
| Shopping | Fúcsia | `fuchsia` |
| Receitas da Nonna | Laranja | `orange` |
| Ourofino | Verde | `green` |
| Kellanova | Rosa | `rose` |
| (padrão) | Azul neutro | `default` |

---

## Exemplo de Objeto JSON

```json
{
  "id": "mes-da-mulher",
  "title": "Mês da Mulher",
  "company": "Condor",
  "link": "https://campanha.condor.com.br/mes-da-mulher-2025/",
  "production": "Interno",
  "status": "No ar",
  "image": "/screenshots/mesdamulher.png",
  "desc": "Campanha especial do Mês da Mulher.\nIncluiu seção de sorteio e galeria de produtos.",
  "type": ["Lp"]
}
```

---

## Validação na API

O endpoint `src/pages/api/projects.ts` valida estritamente que `production`, `status` e cada elemento de `type` sejam valores do enum correspondente antes de aceitar um upsert. Qualquer valor fora do conjunto retorna `400 Bad Request`.
