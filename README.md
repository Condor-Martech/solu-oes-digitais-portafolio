# LP Hub — Portfólio

Página de portfólio dos projetos (sites e landing pages) entregues pelo time.
HTML, CSS e JavaScript puros em um único arquivo — sem bundler, sem build.

## Uso

Abrir o `portfolio.html` diretamente no navegador, ou servir localmente:

```
python3 -m http.server 8000
# http://localhost:8000/portfolio.html
```

Para embedar via iframe em outra página:

```html
<iframe src="/caminho/para/portfolio.html" style="width:100%;height:100vh;border:0"></iframe>
```

## Estrutura

```
portfolio.html      # página única (HTML + CSS + JS)
screenshots/        # capas dos projetos (referenciadas pelos cards)
logos/              # logos (reserva — não usados no layout atual)
```

## Editar projetos

A lista está no array `projects` dentro de `portfolio.html`. Cada item:

```js
{
  title:     "Nome do projeto",
  desc:      "Descrição. Aceita múltiplos parágrafos separados por \\n",
  tags:      ["E-commerce", "Condor", "Online"],
  link:      "https://...",
  linkLabel: "Visitar site",
  image:     "screenshots/arquivo.png"   // ou URL externa
}
```

As cores das tags são atribuídas automaticamente a partir de uma paleta fixa
usando hash do nome da tag — tags iguais recebem sempre a mesma cor.

## Dependências externas

Apenas Google Fonts (DM Sans + DM Mono). Nenhum pacote npm.
