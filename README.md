# Codelearn Portugal

Site estático multipágina (PT-PT) para a Codelearn online em Portugal, pensado para GitHub Pages.

## Estrutura

- `index.html`, `metodo.html`, `plano.html`, `precos.html`, `faq.html`, `sobre.html`, `contacto.html`, `404.html`
- `assets/css/style.css` — folha de estilos única
- `assets/js/main.js` — menu móvel, editor animado, alternância mensal/anual, citações, formulário (mailto)
- `assets/img/` — imagens retiradas de codelearn.com / codelearn.cat, convertidas para webp
- `partials/` — `head`, `header`, `footer` e `areas` (aventuras complementares) partilhados

## Editar cabeçalho / rodapé

Edita `partials/*.html` e corre:

    python3 sync.py

O script copia cada partial para todas as páginas entre `<!-- @nome -->` e `<!-- /@nome -->`
e marca o link ativo do menu a partir de `<body data-page="...">`. Não há build no GitHub Pages:
os `.html` publicados são os finais.

## Ver em local

    python3 -m http.server 8000

## Publicar

Settings → Pages → Deploy from branch → `master` / root. Todos os links são relativos,
por isso funciona tanto em `usuario.github.io/codelearn-pt/` como num domínio próprio (ficheiro `CNAME`).
