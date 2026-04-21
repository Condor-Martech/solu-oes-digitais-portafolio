# LP Hub — Resumo do Produto

> **Para:** Product Owner, Stakeholders, Equipe Não Técnica  
> **Versão:** 2.0 — Abril 2026

---

## O que é o LP Hub?

O LP Hub é o **portfólio digital interno da equipe**. É uma página web privada que centraliza e exibe todos os sites e landing pages que a equipe produziu.

Serve como:
- **Vitrine interna** para ver de uma vez todos os projetos da equipe.
- **Ferramenta de consulta** para saber o que está "no ar" e o que está fora.
- **Referência visual** com capturas de tela e links diretos para cada projeto.

---

## Como ele aparece?

A tela principal exibe os cards dos projetos em uma grade. Cada card tem:

- 📸 **Captura do projeto**
- 🏷️ **Nome e empresa cliente**
- 🟢 / 🔴 **Indicador de estado** (No ar / Fora do ar)
- 🔖 **Badges de tipo** (LP, Software, Site) e produção (Interno, Externo...)

Ao clicar em um card abre-se um **painel de detalhe** com descrição completa e link direto para o projeto.

Em **celulares**, os projetos são apresentados em um **carrossel horizontal** deslizável.

Os projetos podem ser **filtrados por empresa** (Condor, Gigante, Hipermais, etc.) usando a barra de filtros.

---

## Como é atualizado?

> **A equipe técnica NÃO precisa publicar uma nova versão do site para adicionar ou editar um projeto.**

O fluxo é completamente automático:

```
1. Alguém edita ou adiciona um projeto no Google Sheets
           ↓
2. Clica no botão "Sincronizar" da planilha
           ↓
3. n8n (o automatizador) recebe a mudança
           ↓
4. n8n salva o projeto atualizado no servidor de arquivos (Minio)
           ↓
5. O site exibe a mudança de forma imediata (sem redeploy)
```

**Não é preciso mexer em código. A planilha do Google Sheets funciona como CMS.**

---

## Quais informações tem cada projeto?

| Campo | O que é | Exemplo |
|---|---|---|
| **Nome** | Título visível do projeto | "Mês da Mulher" |
| **Empresa** | Cliente ou marca | "Condor" |
| **Link** | URL do site em produção | https://campanha.condor... |
| **Tipo** | Categoria do projeto | LP, Site, Software |
| **Produção** | Quem desenvolveu | Interno, Externo, Terceiro |
| **Estado** | Se o site ainda está ativo | No ar / Fora do ar |
| **Descrição** | Texto livre sobre o projeto | "Campanha do Dia da Mulher..." |
| **Imagem** | Captura de tela do site | (caminho do arquivo) |

---

## Onde está hospedado?

| Componente | Plataforma | Função |
|---|---|---|
| **Site** | Vercel | Hospedagem do portfólio. Disponível 24/7. |
| **Dados** | Minio (servidor interno) | Armazena a lista de projetos em formato JSON. |
| **Automação** | n8n (servidor interno) | Recebe mudanças e atualiza o Minio. |
| **Fonte de edição** | Google Sheets | CMS da equipe (onde os projetos são editados). |

---

## Quem pode fazer o quê?

| Papel | Pode |
|---|---|
| **Qualquer pessoa da equipe** | Ver o portfólio no navegador |
| **Editor da planilha** | Adicionar, editar ou marcar projetos como "Fora do ar" |
| **Desenvolvedor** | Modificar o design, adicionar funcionalidades, gerenciar o deploy |

---

## Estado atual (v2.0)

✅ **Funcionando em produção**

| Funcionalidade | Estado |
|---|---|
| Visualização de projetos | ✅ Ativo |
| Filtro por empresa | ✅ Ativo |
| Modal de detalhe | ✅ Ativo |
| Carrossel em celular | ✅ Ativo |
| Sincronização automática do Google Sheets | ✅ Ativo |
| Imagens otimizadas (WebP) | ✅ Ativo |
| Design responsivo (celular, tablet, desktop) | ✅ Ativo |

---

## Perguntas frequentes

**Quando um projeto novo aparece depois de cadastrá-lo no Sheets?**  
De forma imediata (em segundos) após clicar em "Sincronizar".

**O que acontece se o site de um projeto for desativado?**  
Basta mudar o estado para `Fora do ar` na planilha e sincronizar. O badge vermelho aparecerá automaticamente.

**O site funciona no celular?**  
Sim. No celular os projetos são exibidos em um carrossel horizontal. O design está otimizado para todos os tamanhos de tela.

**É preciso pedir à TI para adicionar projetos?**  
Não. Qualquer pessoa com acesso à planilha do Google Sheets pode fazer isso de forma autônoma.

**Onde ficam as imagens dos projetos?**  
As capturas de tela são armazenadas no servidor de arquivos interno (Minio). A equipe de desenvolvimento é responsável por subir as imagens novas.

---

## Contato e suporte

Para mudanças no design, novas funcionalidades ou problemas técnicos, entrar em contato com a equipe de desenvolvimento.

Para adicionar ou editar projetos, usar a [planilha do Google Sheets](#) diretamente.
