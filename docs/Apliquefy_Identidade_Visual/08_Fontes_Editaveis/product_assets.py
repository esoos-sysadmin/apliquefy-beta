from pathlib import Path
from PIL import Image
import json
R=Path(__file__).resolve().parents[2]/'Apliquefy_Identidade_Visual'
if not R.exists(): R=Path(__file__).resolve().parents[1]
D=R/'02_Simbolo_Produto'
ico=Image.open(D/'PNG/apliquefy-simbolo-grafite-width256.png').convert('RGBA')
ico.save(D/'favicon.ico',format='ICO',sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
# Use the separate optical master at smallest sizes.
micro=Image.open(D/'PNG/apliquefy-simbolo-micro-width32.png').convert('RGBA')
micro.save(D/'favicon-micro.ico',format='ICO',sizes=[(16,16),(32,32)])
manifest={'name':'Apliquefy','short_name':'Apliquefy','id':'/','start_url':'/','display':'standalone','background_color':'#F6F4FA','theme_color':'#7A3BFF','icons':[
 {'src':'./PNG/apliquefy-app-claro-width192.png','sizes':'192x192','type':'image/png','purpose':'any maskable'},
 {'src':'./PNG/apliquefy-app-claro-width512.png','sizes':'512x512','type':'image/png','purpose':'any maskable'}]}
(D/'site.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
adaptive=(D/'SVG/apliquefy-simbolo-micro.svg').read_text().replace('</defs>','</defs><style>path{fill:#14121C}@media(prefers-color-scheme:dark){path{fill:#FFFFFF}}</style>')
(D/'favicon.svg').write_text(adaptive,encoding='utf-8')
(D/'integracao-web.txt').write_text('''APL IQUEFY / ATIVOS DE PRODUTO

O ícone principal é app-claro. App-escuro e app-roxo são opções de superfície.
Todos os arquivos quadrados são opacos e têm margem para máscaras de produto.
Não aplique cantos arredondados no arquivo de origem: a plataforma faz o recorte.

Exemplo de integração (ajuste o prefixo /marca/ ao caminho real do projeto):
<link rel="icon" href="/marca/favicon-micro.ico" sizes="16x16 32x32">
<link rel="icon" href="/marca/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/marca/PNG/apliquefy-app-claro-width180.png">
<link rel="mask-icon" href="/marca/SVG/apliquefy-safari-pinned-tab.svg" color="#7A3BFF">
<link rel="manifest" href="/marca/site.webmanifest">
<meta name="theme-color" content="#7A3BFF">

O manifest é uma base: ajuste id, start_url e caminhos ao projeto real antes de publicar.
O ícone não implica que o aplicativo móvel já esteja lançado.
'''.replace('APL IQUEFY','APLIQUEFY'),encoding='utf-8')
print('product assets ready')
