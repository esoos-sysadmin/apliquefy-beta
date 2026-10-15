from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import json, re, xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[2]/'Apliquefy_Identidade_Visual'
if not ROOT.exists():ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'07_Aplicacoes';(OUT/'SVG').mkdir(parents=True,exist_ok=True)
INK='#14121C';PURPLE='#7A3BFF';PAPER='#F6F4FA'

def font_path(weight):
    filename={'Regular':'ApliquefyDisplayR2-Regular.ttf','Bold':'ApliquefyDisplay-Bold.ttf'}[weight]
    path=ROOT/'03_Tipografia'/'TTF'/filename
    if not path.is_file():raise FileNotFoundError(path)
    return path

FONTS={}
def text(s,x,y,size=24,color=INK,weight='Regular'):
    if weight not in FONTS:
        ft=TTFont(font_path(weight));gs=ft.getGlyphSet();cm=ft.getBestCmap();kern={}
        if 'kern' in ft:
            for k in ft['kern'].kernTables:kern.update(k.kernTable)
        FONTS[weight]=(ft,gs,cm,kern)
    ft,gs,cm,kern=FONTS[weight];sc=size/ft['head'].unitsPerEm;cursor=0;prev=None;pieces=[]
    for ch in s:
        name=cm.get(ord(ch),'.notdef')
        if prev:cursor+=kern.get((prev,name),0)
        pen=SVGPathPen(gs);tp=TransformPen(pen,(sc,0,0,-sc,x+cursor*sc,y));gs[name].draw(tp)
        d=pen.getCommands()
        if d:pieces.append(f'<path d="{d}"/>')
        cursor+=ft['hmtx'][name][0];prev=name
    return f'<g fill="{color}" aria-label="{s}">'+''.join(pieces)+'</g>'

def plain(s,x,y,size=18,color='#6E6879',weight=400):
    # Supporting copy intentionally remains editable; system-sans fallback is documented.
    return f'<text x="{x}" y="{y}" fill="{color}" font-family="Arial, Helvetica, sans-serif" font-size="{size}" font-weight="{weight}">{s}</text>'

def place(file,x,y,w,h=None):
    el=ET.parse(ROOT/file).getroot();v=el.get('viewBox');vb=[float(a) for a in v.split()]
    height=h or w*vb[3]/vb[2]
    inner=''.join(ET.tostring(c,encoding='unicode').replace('ns0:','').replace(':ns0','') for c in el if c.tag.rsplit('}',1)[-1] not in ('title','desc'))
    # IDs must be unique in a composed document.
    prefix=f'a{int(x)}b{int(y)}'
    for old in re.findall(r'id="([^"]+)"',inner):
        inner=inner.replace(f'id="{old}"',f'id="{prefix}-{old}"').replace(f'url(#{old})',f'url(#{prefix}-{old})')
    return f'<svg x="{x}" y="{y}" width="{w}" height="{height}" viewBox="{v}">{inner}</svg>'

def save(name,body,w,h,bg=PAPER):
    s=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><title>Apliquefy - {name}</title><rect width="{w}" height="{h}" fill="{bg}"/>{body}</svg>'
    (OUT/'SVG'/f'{name}.svg').write_text(s,encoding='utf-8')

def board():
    w,h=1800,1480;b=[]
    b.append(plain('APLIQUEFY  /  IDENTIDADE VISUAL',72,60,17,INK,600));b.append(plain('01  /  SISTEMA ORIGINAL',1480,60,14))
    b.append('<path d="M72 88H1728" stroke="#DCD7E5"/>')
    b.append(plain('UMA MARCA PARA DIFERENTES TRAJETÓRIAS',72,145,14))
    b.append(place('01_Logos/SVG/apliquefy-horizontal-principal.svg',35,155,1160))
    b.append(text('Sua busca por trabalho,',80,492,60,INK,'Regular'))
    b.append(text('em movimento.',80,573,60,INK,'Regular'))
    b.append(plain('Menos obstáculos para dar o próximo passo profissional.',84,624,25))
    b.append('<rect x="1350" y="130" width="378" height="506" rx="28" fill="#14121C"/>')
    b.append(place('02_Simbolo_Produto/SVG/apliquefy-simbolo-gradiente.svg',1390,196,298))
    b.append(plain('Uma assinatura. Diferentes caminhos.',1384,572,18,'#D3CDD9'))
    b.append('<path d="M72 690H1728" stroke="#DCD7E5"/>')
    b.append(plain('01  /  ASSINATURAS',72,733,14))
    b.append('<rect x="72" y="765" width="785" height="230" rx="20" fill="#FFFFFF"/>')
    b.append(place('01_Logos/SVG/apliquefy-wordmark-grafite.svg',185,780,560))
    b.append(plain('O nome também é a marca.',108,967,19))
    b.append('<rect x="881" y="765" width="847" height="230" rx="20" fill="#14121C"/>')
    b.append(place('01_Logos/SVG/apliquefy-horizontal-negativa.svg',955,780,700))
    b.append(plain('A mesma construção, em superfícies claras e escuras.',920,966,19,'#BEB7CD'))
    b.append(plain('02  /  APLIQUEFY DISPLAY',72,1053,14))
    b.append(text('Aa Bb Cc 123',73,1145,81,INK,'Bold'))
    b.append(text('Acentos, ação e conexão.',76,1213,34,INK,'Regular'))
    b.append(plain('Fonte original • Regular R2 e Bold • Latin',77,1260,18))
    b.append(plain('03  /  CORES COM FUNÇÃO',967,1053,14))
    colors=[('#14121C','Base'),('#7A3BFF','Ação'),('#FF7A00','Acento'),('#22D36A','Acento'),('#FFFFFF','Respiro')]
    for i,(color,label) in enumerate(colors):
        x=970+i*152;b.append(f'<rect x="{x}" y="1091" width="128" height="100" rx="16" fill="{color}" stroke="#E5DFED"/>')
        b.append(plain(label,x,1223,17,INK));b.append(plain(color,x,1254,15))
    b.append('<path d="M72 1328H1728" stroke="#DCD7E5"/>')
    b.append(plain('VETORES REAIS  /  FONTE INSTALÁVEL  /  COMPONENTES REUTILIZÁVEIS',72,1384,16,INK,600))
    b.append(plain('Versão 1.0 · 2026',1530,1384,16))
    save('apliquefy-visao-geral',''.join(b),w,h)

def social():
    b=place('01_Logos/SVG/apliquefy-horizontal-principal.svg',40,20,430)
    b+=text('Sua busca por trabalho,',64,277,64,INK,'Bold')+text('em movimento.',64,357,64,INK,'Bold')
    b+=plain('Candidaturas com inteligência artificial.',68,428,28)
    b+=place('02_Simbolo_Produto/SVG/apliquefy-simbolo-gradiente.svg',855,250,290)
    b+=plain('APLIQUEFY',68,562,16,INK,600)
    save('apliquefy-social-1200x630',b,1200,630)
    b=place('01_Logos/SVG/apliquefy-horizontal-negativa.svg',46,40,450)
    b+=text('O próximo passo',76,330,66,'#FFFFFF','Bold')+text('começa com você.',76,421,66,'#FFFFFF','Bold')
    b+=plain('Tecnologia para simplificar suas candidaturas.',81,499,27,'#C4BECF')
    b+=place('02_Simbolo_Produto/SVG/apliquefy-simbolo-gradiente.svg',540,565,470)
    b+=plain('CANDIDATURAS COM IA',83,983,16,'#C4BECF',600)
    save('apliquefy-social-1080x1080',b,1080,1080,INK)
    for kind in ['claro','escuro']:
        body=place(f'02_Simbolo_Produto/SVG/apliquefy-app-{kind}.svg',0,0,1024)
        save(f'apliquefy-avatar-{kind}',body,1024,1024)

def pattern():
    # Original open-circle rhythm from the symbol, not a second brand mark.
    body=''
    for row in range(5):
        for col in range(8):
            x=col*180+30+(row%2)*90;y=row*180+30
            color=['#7A3BFF','#D8CBFC','#E8E2F2'][((row*8+col)%3)]
            body+=f'<circle cx="{x}" cy="{y}" r="62" fill="none" stroke="{color}" stroke-width="24" opacity="0.16"/>'
    save('apliquefy-padrao-circulos',body,1440,900)

if __name__=='__main__':board();social();pattern()
