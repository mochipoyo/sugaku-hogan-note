#!/usr/bin/env python3
"""src/ のファイルを1つの index.html にまとめる。index.html は直接編集せず、src/ を編集してから実行する。"""
from pathlib import Path
root = Path(__file__).parent
src = root / "src"
shell = (src / "shell.html").read_text(encoding="utf-8")
body = (src / "body.html").read_text(encoding="utf-8")
js = "\n".join((src / f).read_text(encoding="utf-8") for f in ["gen.js", "extra.js", "labs.js", "app.js"])
# body.html は <title>・<link>・<style> と本文マークアップを含む。head 部分と本文を分ける
head_part, _, markup = body.partition("</style>")
html = shell.replace("<!--BODY-->", head_part + "</style>").replace("</head>", "</head>\n<body>\n" + markup.strip() + "\n<script>\n" + js + "\n</script>\n</body>\n</html>\n", 1)
(root / "index.html").write_text(html, encoding="utf-8")
print(f"index.html を生成しました({len(html.encode('utf-8'))//1024} KB)")
