#!/usr/bin/env python3
"""Copia os blocos partilhados de partials/ para todas as páginas .html.

Cada página marca onde vai cada bloco com <!-- @nome --> ... <!-- /@nome -->.
O link do menu cuja data-nav coincide com <body data-page="..."> fica com
aria-current="page". Executa `python3 sync.py` depois de editar partials/.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
partials = {p.stem: p.read_text(encoding="utf-8").strip() for p in (ROOT / "partials").glob("*.html")}

for page in sorted(ROOT.glob("*.html")):
    html = page.read_text(encoding="utf-8")
    m = re.search(r'<body[^>]*data-page="([^"]+)"', html)
    current = m.group(1) if m else ""
    for name, content in partials.items():
        if current:
            content = content.replace(f'data-nav="{current}"', f'data-nav="{current}" aria-current="page"')
        html = re.sub(
            rf"(<!-- @{name} -->)(.*?)(<!-- /@{name} -->)",
            lambda m: f"{m.group(1)}\n{content}\n{m.group(3)}",
            html,
            flags=re.S,
        )
    page.write_text(html, encoding="utf-8")
    print("ok", page.name)
