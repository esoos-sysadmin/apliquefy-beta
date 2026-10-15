from pathlib import Path
import json, math, re, argparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2] / 'Apliquefy_Identidade_Visual'
if not ROOT.exists():
    ROOT = Path(__file__).resolve().parents[1]
PALETTE = {'purple':'#7A3BFF','orange':'#FF7A00','green':'#22D36A','ink':'#14121C','white':'#FFFFFF','paper':'#F6F4FA'}

def gradient(id='brand-gradient'):
    return f'<linearGradient id="{id}" x1="0.26" y1="0" x2="0.65" y2="1"><stop offset="0" stop-color="#7A3BFF"/><stop offset="0.34" stop-color="#7A3BFF"/><stop offset="0.72" stop-color="#FF7A00"/><stop offset="1" stop-color="#FF7A00"/></linearGradient>'

RING='M 228 128 A 100 100 0 1 1 28 128 A 100 100 0 1 1 228 128 Z M 170 128 A 42 42 0 1 0 86 128 A 42 42 0 1 0 170 128 Z'
STEM='M 202 126 C 216.359 126 228 137.641 228 152 L 228 202 C 228 216.359 216.359 228 202 228 C 187.641 228 176 216.359 176 202 L 176 152 C 176 137.641 187.641 126 202 126 Z'

def symbol(kind='gradient'):
    color=PALETTE['ink'] if kind=='ink' else '#FFFFFF' if kind=='white' else 'url(#brand-gradient)'
    stem='#22D36A' if kind=='gradient' else color
    return f'<path d="{RING}" fill="{color}" fill-rule="evenodd"/><path d="{STEM}" fill="{stem}"/>'

def svg(body,w,h,title,desc='',defs=''):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w:g}" height="{h:g}" viewBox="0 0 {w:g} {h:g}" role="img" aria-labelledby="title desc"><title id="title">{title}</title><desc id="desc">{desc}</desc><defs>{defs}</defs>{body}</svg>'''

def write(folder,name,data):
    p=ROOT/folder/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(data,encoding='utf-8');return p

def symbols():
    for kind,name in [('gradient','gradiente'),('ink','grafite'),('white','branco')]:
        write('02_Simbolo_Produto/SVG',f'apliquefy-simbolo-{name}.svg',svg(symbol(kind),256,256,'Apliquefy - símbolo '+name,'Símbolo vetorial com área de respiro incorporada.',gradient()))
    # Optically simplified micro mark: one color, no small accent or gradient.
    micro='<path fill="#14121C" fill-rule="evenodd" d="M14 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM10.5 8a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/><path fill="#14121C" d="M10.5 8h3.5v4.25a1.75 1.75 0 0 1-3.5 0Z"/>'
    write('02_Simbolo_Produto/SVG','apliquefy-simbolo-micro.svg',svg(micro,16,16,'Apliquefy - micro símbolo','Uso em 16 e 20 px; desenho simplificado monocromático.'))
    for name,bg,kind in [('claro','#F6F4FA','gradient'),('escuro','#14121C','white'),('roxo','#7A3BFF','white')]:
        # Square artwork, no pre-rounded corners, with mask-safe 15% insets.
        body=f'<path d="M0 0H1024V1024H0Z" fill="{bg}"/><g transform="translate(153.6 153.6) scale(2.8)">{symbol(kind)}</g>'
        write('02_Simbolo_Produto/SVG',f'apliquefy-app-{name}.svg',svg(body,1024,1024,'Apliquefy - ícone '+name,'Arte quadrada sem cantos pré-recortados; símbolo dentro da área segura.',gradient()))
    write('02_Simbolo_Produto/SVG','apliquefy-safari-pinned-tab.svg',svg(symbol('ink'),256,256,'Apliquefy','Símbolo monocromático para abas fixadas.'))

def logos(wordmark_file):
    tree=ET.parse(wordmark_file);el=tree.getroot()
    vb=[float(x) for x in el.attrib['viewBox'].split()]
    # The font agent supplies only outlined glyphs; no text or embedded bitmap is accepted.
    if any(e.tag.rsplit('}',1)[-1] in ('image','text') for e in el.iter()):
        raise ValueError('Wordmark must contain paths only')
    # preserve transforms while removing exterior accessibility title/desc and defs.
    children=[e for e in el if e.tag.rsplit('}',1)[-1] not in ('title','desc','defs','metadata')]
    raw=''.join(ET.tostring(c,encoding='unicode').replace('ns0:','').replace(':ns0','') for c in children)
    # color rewrite retains fill-rule and transform.
    raw=re.sub(r'\sfill="[^"]*"','',raw)
    raw=re.sub(r'\sstroke="[^"]*"','',raw)
    x,y,ww,wh=vb
    scale=150/wh
    # Name visible total height is 150. Mark is 144 visible tall; lockup has 48 clearspace.
    mark_scale=0.72;mark_w=200*mark_scale;gap=40;margin=48
    name_w=ww*scale
    for variant,kind,color in [('principal','gradient','#14121C'),('negativa','gradient','#FFFFFF'),('mono-grafite','ink','#14121C'),('mono-branco','white','#FFFFFF')]:
        h=246;w=margin*2+mark_w+gap+name_w
        mark=f'<g transform="translate({margin-28*mark_scale:g} {h/2-128*mark_scale:g}) scale({mark_scale:g})">{symbol(kind)}</g>'
        name=f'<g fill="{color}" transform="translate({margin+mark_w+gap-x*scale:g} {48-y*scale:g}) scale({scale:g})">{raw}</g>'
        write('01_Logos/SVG',f'apliquefy-horizontal-{variant}.svg',svg(mark+name,w,h,'Apliquefy - assinatura horizontal '+variant,'Letreiramento original em curvas. Proporção e espaçamento fixos.',gradient()))
        vmark=0.9;vname_scale=scale;vw=max(name_w,200*vmark)+96;vh=180+48+150+96
        m=f'<g transform="translate({vw/2-128*vmark:g} {48-28*vmark:g}) scale({vmark:g})">{symbol(kind)}</g>'
        n=f'<g fill="{color}" transform="translate({(vw-name_w)/2-x*scale:g} {48+180+48-y*scale:g}) scale({scale:g})">{raw}</g>'
        write('01_Logos/SVG',f'apliquefy-vertical-{variant}.svg',svg(m+n,vw,vh,'Apliquefy - assinatura vertical '+variant,'Letreiramento original em curvas; uso em composições verticais.',gradient()))
    for col,nm in [('#14121C','grafite'),('#FFFFFF','branco')]:
        body=f'<g fill="{col}" transform="translate({48-x*scale:g} {48-y*scale:g}) scale({scale:g})">{raw}</g>'
        write('01_Logos/SVG',f'apliquefy-wordmark-{nm}.svg',svg(body,name_w+96,246,'Apliquefy - wordmark '+nm,'Assinatura tipográfica em curvas; extraída da fonte Apliquefy Display Bold.'))
    metadata={'version':'1.0','wordmark_source':str(Path(wordmark_file).name),'wordmark_viewbox':vb,'name_height_in_master':150,'horizontal_mark_visible_height':144,'horizontal_gap':40,'clearspace':'mínimo 0,5 × altura-x do wordmark; artboards incluem margem de exportação','min_width_px':{'horizontal':160,'wordmark':110,'symbol':24,'micro':16},'palette':PALETTE}
    write('08_Fontes_Editaveis','brand-construction.json',json.dumps(metadata,ensure_ascii=False,indent=2))

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--wordmark');args=ap.parse_args()
    symbols()
    if args.wordmark:logos(args.wordmark)
