#!/usr/bin/env python3
"""Build Apliquefy brand manual using native logos and actual display fonts.
Requires reportlab, PyMuPDF, fontTools; invoke from any directory.
"""
from pathlib import Path
import json, math, re, shutil, os
import xml.etree.ElementTree as ET
from fontTools.svgLib.path import parse_path
from fontTools.pens.basePen import BasePen
from fontTools.pens.boundsPen import BoundsPen
import fitz
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT.parent/'work'/'guide'; WORK.mkdir(parents=True,exist_ok=True)
OUT=ROOT/'00_Guia'/'Apliquefy_Guia_de_Identidade_v1.0.pdf'
W,H=960,640
P={'purple':'#7A3BFF','orange':'#FF7A00','green':'#22D36A','ink':'#14121C','white':'#FFFFFF','paper':'#F6F4FA','muted':'#625D6C','line':'#D8D4E2','pdark':'#5420BF','odark':'#A64500','gdark':'#08773A'}
LOGO=ROOT/'01_Logos'/'SVG'
SYMBOL=ROOT/'02_Simbolo_Produto'/'SVG'
PLACEMENTS=[]
PAGE=0
C=None

def font_setup():
    reg=ROOT/'03_Tipografia'/'TTF'/'ApliquefyDisplayR2-Regular.ttf'
    bold=ROOT/'03_Tipografia'/'TTF'/'ApliquefyDisplay-Bold.ttf'
    if not reg.is_file() or not bold.is_file(): raise FileNotFoundError('Need Apliquefy Regular R2 and Bold TTF files.')
    pdfmetrics.registerFont(TTFont('ApRegular',str(reg)))
    pdfmetrics.registerFont(TTFont('ApBold',str(bold)))
    base=Path(os.environ.get('APLIQUEFY_GUIDE_TEXT_FONT_DIR','/usr/share/fonts/truetype/dejavu'))
    pdfmetrics.registerFont(TTFont('Body',str(base/'DejaVuSans.ttf')))
    pdfmetrics.registerFont(TTFont('BodyBold',str(base/'DejaVuSans-Bold.ttf')))
    pdfmetrics.registerFont(TTFont('Mono',str(base/'DejaVuSansMono.ttf')))
    return reg,bold

def col(v): return HexColor(P.get(v,v))
def rect(x,y,w,h,fill='paper',stroke=None,r=0):
    C.setFillColor(col(fill)); C.setStrokeColor(col(stroke or fill))
    if r: C.roundRect(x,H-y-h,w,h,r,fill=1,stroke=bool(stroke))
    else: C.rect(x,H-y-h,w,h,fill=1,stroke=bool(stroke))

def line(x1,y1,x2,y2,color='line',width=1,dash=None):
    C.saveState(); C.setStrokeColor(col(color)); C.setLineWidth(width)
    if dash: C.setDash(dash)
    C.line(x1,H-y1,x2,H-y2); C.restoreState()

def text(s,x,y,size=14,font='Body',color='ink'):
    C.setFillColor(col(color)); C.setFont(font,size); C.drawString(x,H-y-size*0.82,s)

def lines(s,x,y,width,size=13,font='Body',color='ink',leading=None):
    leading=leading or size*1.48
    yy=y
    for para in s.split('\n'):
        words=para.split(); cur=''
        for word in words:
            t=(cur+' '+word).strip()
            if pdfmetrics.stringWidth(t,font,size)>width and cur:
                text(cur,x,yy,size,font,color); yy+=leading; cur=word
            else: cur=t
        if cur: text(cur,x,yy,size,font,color); yy+=leading
        else: yy+=leading*.55
    return yy

def label(s,x,y,color='muted'):
    text(s.upper(),x,y,9,'BodyBold',color)

def page(section,bg='white',dark=False):
    global PAGE
    if PAGE: C.showPage()
    PAGE+=1
    rect(0,0,W,H,bg)
    fg='white' if dark else 'ink'
    dim='#ABA5BA' if dark else 'muted'
    label('APLIQUEFY / IDENTIDADE VISUAL',48,28,dim)
    label(section,560,28,dim)
    line(48,588,912,588,'#35303F' if dark else 'line',.65)
    text('Versão 1.0  /  Outubro 2026',48,605,8,'Body',dim)
    text(f'{PAGE:02}',886,602,11,'Mono',dim)

def title(kicker,headline,sub=None,dark=False):
    color='white' if dark else 'ink'
    label(kicker,48,78,'green' if dark else 'purple')
    text(headline,48,106,34,'BodyBold',color)
    if sub: lines(sub,48,158,830,13,color='#C4BED2' if dark else 'muted')

class PDFPen(BasePen):
    def __init__(self,path): super().__init__(None); self.path=path
    def _moveTo(self,p): self.path.moveTo(*p)
    def _lineTo(self,p): self.path.lineTo(*p)
    def _curveToOne(self,p1,p2,p3): self.path.curveTo(*p1,*p2,*p3)
    def _closePath(self): self.path.close()
    def _endPath(self): pass

def svg(path,x,y,w,h):
    path=Path(path)
    if not path.exists(): raise FileNotFoundError(path)
    root=ET.fromstring(path.read_text())
    vb=[float(n) for n in root.attrib.get('viewBox','0 0 24 24').split()]
    k=min(w/vb[2],h/vb[3]); ox=x+(w-vb[2]*k)/2; oy=y+(h-vb[3]*k)/2
    grads={e.get('id'):e for e in root.iter() if e.tag.split('}')[-1]=='linearGradient'}
    C.saveState(); C.translate(ox,H-oy); C.scale(k,-k); C.translate(-vb[0],-vb[1])
    def number(v,default=0):
        if v is None: return default
        return float(str(v).replace('px','').replace('%',''))/(100 if '%' in str(v) else 1)
    def render(el,inherit):
        tag=el.tag.split('}')[-1]
        if tag in ('defs','title','desc','metadata'): return
        at=dict(inherit); at.update(el.attrib)
        if 'style' in at:
            at.update(dict(s.split(':',1) for s in at['style'].split(';') if ':' in s))
        C.saveState()
        for name,args in re.findall(r'(matrix|translate|scale|rotate)\s*\(([^)]*)\)',el.get('transform','')):
            v=[float(z) for z in re.split(r'[ ,]+',args.strip())]
            if name=='translate': C.translate(v[0],v[1] if len(v)>1 else 0)
            if name=='scale': C.scale(v[0],v[1] if len(v)>1 else v[0])
            if name=='matrix': C.transform(*v)
            if name=='rotate': C.rotate(v[0])
        if tag in ('svg','g'):
            for child in el: render(child,{k:v for k,v in at.items() if k!='transform'})
            C.restoreState(); return
        p=C.beginPath(); bounds=None
        if tag=='path':
            d=el.get('d',''); parse_path(d,PDFPen(p)); bp=BoundsPen(None); parse_path(d,bp); bounds=bp.bounds
        elif tag=='circle':
            cx,cy,r=number(el.get('cx')),number(el.get('cy')),number(el.get('r')); p.ellipse(cx-r,cy-r,2*r,2*r); bounds=(cx-r,cy-r,cx+r,cy+r)
        elif tag=='ellipse':
            cx,cy,rx,ry=number(el.get('cx')),number(el.get('cy')),number(el.get('rx')),number(el.get('ry')); p.ellipse(cx-rx,cy-ry,2*rx,2*ry); bounds=(cx-rx,cy-ry,cx+rx,cy+ry)
        elif tag=='rect':
            xx,yy,ww,hh=[number(el.get(a)) for a in ['x','y','width','height']]; p.roundRect(xx,yy,ww,hh,number(el.get('rx'))) if el.get('rx') else p.rect(xx,yy,ww,hh); bounds=(xx,yy,xx+ww,yy+hh)
        elif tag=='line': p.moveTo(number(el.get('x1')),number(el.get('y1'))); p.lineTo(number(el.get('x2')),number(el.get('y2')))
        elif tag in ('polyline','polygon'):
            coords=[float(v) for v in re.split('[ ,]+',el.get('points','').strip())]; p.moveTo(coords[0],coords[1])
            for i in range(2,len(coords),2): p.lineTo(coords[i],coords[i+1])
            if tag=='polygon': p.close()
        else:
            raise ValueError('Unsupported SVG node '+tag+' in '+str(path))
        fill=at.get('fill','#000000'); stroke=at.get('stroke','none'); mode=0 if at.get('fill-rule')=='evenodd' else 1
        fill=at.get('color',P['ink']) if fill=='currentColor' else fill
        stroke=at.get('color',P['ink']) if stroke=='currentColor' else stroke
        C.setLineWidth(number(at.get('stroke-width'),1)); C.setLineCap({'butt':0,'round':1,'square':2}.get(at.get('stroke-linecap'),0)); C.setLineJoin({'miter':0,'round':1,'bevel':2}.get(at.get('stroke-linejoin'),0))
        if fill.startswith('url('):
            g=grads[fill[5:-1]]; bx,by,br,bb=bounds
            colors=[HexColor(s.get('stop-color')) for s in g]; positions=[number(s.get('offset')) for s in g]
            x1=bx+(br-bx)*number(g.get('x1')); y1=by+(bb-by)*number(g.get('y1')); x2=bx+(br-bx)*number(g.get('x2'),1); y2=by+(bb-by)*number(g.get('y2'))
            C.saveState(); C.clipPath(p,stroke=0,fill=0,fillMode=mode); C.linearGradient(x1,y1,x2,y2,colors,positions); C.restoreState()
            if stroke!='none': C.setStrokeColor(HexColor(stroke)); C.drawPath(p,stroke=1,fill=0,fillMode=mode)
        else:
            if fill!='none': C.setFillColor(HexColor(fill))
            if stroke!='none': C.setStrokeColor(HexColor(stroke))
            C.drawPath(p,stroke=int(stroke!='none'),fill=int(fill!='none'),fillMode=mode)
        C.restoreState()
    render(root,{})
    C.restoreState(); PLACEMENTS.append((PAGE-1,path,x,y,w,h))

def pill(s,x,y,w=None,fill='paper',color='ink',font='Body',size=10):
    w=w or pdfmetrics.stringWidth(s,font,size)+22
    rect(x,y,w,28,fill,r=14); text(s,x+11,y+8,size,font,color)

def bullet(num,head,body,x,y,w=250):
    label(num,x,y,'purple'); text(head,x,y+26,19,'BodyBold'); lines(body,x,y+62,w,12,color='muted')

def boxnote(head,body,x,y,w,h=94,fill='paper'):
    rect(x,y,w,h,fill,r=12); text(head,x+18,y+17,13,'BodyBold'); lines(body,x+18,y+42,w-36,11,color='muted')

def add_asset(svgname,x,y,w,h): svg(LOGO/svgname,x,y,w,h)
def symbol(svgname,x,y,w,h): svg(SYMBOL/svgname,x,y,w,h)

# ---------- Pages ----------
def build():
    global C
    reg,bold=font_setup()
    C=canvas.Canvas(str(WORK/'base.pdf'),pagesize=(W,H),pageCompression=1)
    C.setTitle('Apliquefy | Guia de Identidade Visual v1.0')
    C.setAuthor('Apliquefy')
    C.setSubject('Filosofia de marca, identidade, tipografia original e sistema digital')
    C.setCreator('Apliquefy identity build / ReportLab + PyMuPDF')

    page('O SISTEMA')
    label('IDENTIDADE VISUAL / 1.0',48,92,'purple')
    add_asset('apliquefy-horizontal-principal.svg',40,146,730,142)
    text('A busca por trabalho',48,335,36,'BodyBold')
    text('deve caber na vida.',48,380,36,'BodyBold')
    lines('Uma identidade próxima, competente e clara.\nCriada para acompanhar diferentes trajetórias profissionais.',50,470,625,14,color='muted')
    pill('DIRETRIZES + ARQUIVOS + SISTEMA DIGITAL',48,536,size=9)

    page('01 / FILOSOFIA')
    title('A IDEIA CENTRAL','Menos barreiras. Mais movimento.')
    lines('A Apliquefy ajuda pessoas a transformar a intenção de buscar trabalho em candidaturas. A tecnologia assume parte do esforço repetitivo para que cada pessoa possa continuar vivendo, trabalhando e construindo seu próximo passo.',48,188,766,21,font='Body',leading=30)
    line(48,350,912,350)
    bullet('01','Acesso','Acolher diferentes experiências, ocupações e níveis de familiaridade digital.',48,388,245)
    bullet('02','Confiança','Explicar o processo, informar o andamento e tornar a automação compreensível.',354,388,245)
    bullet('03','Autonomia','Dar clareza sobre preferências, candidaturas e formas de pausar a busca.',660,388,245)

    page('02 / PÚBLICO E PROMESSA')
    title('UMA MARCA ABRANGENTE','Toda trajetória merece cuidado.','O público é amplo. A linguagem e a experiência devem acolher situações concretas.')
    scenarios=[('Primeiro emprego','Começar sem exigir um histórico profissional extenso.'),('Varejo e serviços','Buscar oportunidades dentro de uma rotina de trabalho.'),('Estágio e formação','Relacionar área de estudo, disponibilidade e oportunidades.'),('Escritório e transição','Avançar com experiência, preferências e objetivos diferentes.')]
    for i,(head,body) in enumerate(scenarios):
        x=48+(i%2)*442; y=219+(i//2)*142
        rect(x,y,422,120,'paper',r=14); text(f'0{i+1}',x+20,y+20,11,'Mono','purple'); text(head,x+61,y+18,17,'BodyBold'); lines(body,x+61,y+51,337,12,color='muted')
    lines('Ambição global significa adaptar idioma, contratação e requisitos locais. A comunicação comercial informa apenas a cobertura que o produto efetivamente oferece.',48,526,853,11,color='muted')

    page('03 / ARQUITETURA DA MARCA')
    title('RECONHECIMENTO','Uma assinatura. Várias escalas.','As versões resolvem usos e fundos. Todas pertencem ao mesmo desenho.')
    rect(48,218,545,286,'paper',r=16)
    add_asset('apliquefy-horizontal-principal.svg',79,291,482,105)
    label('ASSINATURA PRINCIPAL',72,239)
    text('Símbolo em gradiente + nome em grafite',72,462,12,'Body')
    rect(613,218,299,133,'paper',r=16)
    add_asset('apliquefy-wordmark-grafite.svg',642,260,243,51)
    label('NOME COMO LOGO',634,235)
    rect(613,371,140,133,'paper',r=16); symbol('apliquefy-simbolo-gradiente.svg',646,400,75,75)
    rect(773,371,139,133,'paper',r=16); symbol('apliquefy-app-claro.svg',804,399,78,78)
    label('SÍMBOLO',625,382); label('PRODUTO',785,382)
    lines('O nome é lettering proprietário. Use os contornos fornecidos nos logos; não redigite nem substitua por uma fonte parecida.',48,531,857,12,color='muted')

    page('04 / PROPORÇÃO E PROTEÇÃO')
    title('CONSISTÊNCIA','Espaço para reconhecer.','x = altura-x do lettering. Área livre mínima = 0,5x em todos os lados.')
    # Accurate construction: master contains 48 units of padding and 150-unit mark height.
    master=ET.fromstring((LOGO/'apliquefy-horizontal-principal.svg').read_text())
    vw,vh=[float(v) for v in master.get('viewBox').split()[2:]]
    k=650/vw; dx=155; dy=273; content_x=dx+48*k; content_y=dy+48*k
    content_w=(vw-96)*k; content_h=(vh-96)*k
    # x-height derives from 520/1000 and the same scale as the final wordmark.
    wm_group=list(master)[-1]
    match=re.search(r'scale\(([-0-9.]+)\)',wm_group.get('transform',''))
    font_scale=float(match.group(1)) if match else 150/970.55
    xx=520*font_scale*k; guard=xx*.5
    rect(93,241,770,233,'paper',r=8)
    add_asset('apliquefy-horizontal-principal.svg',dx,dy,650,vh*k)
    gx,gy,gw,gh=content_x-guard,content_y-guard,content_w+2*guard,content_h+2*guard
    line(gx,gy,gx+gw,gy,'purple',.8,[3,3]); line(gx,gy+gh,gx+gw,gy+gh,'purple',.8,[3,3])
    line(gx,gy,gx,gy+gh,'purple',.8,[3,3]); line(gx+gw,gy,gx+gw,gy+gh,'purple',.8,[3,3])
    line(content_x,content_y,content_x+content_w,content_y,'line',.6,[2,2]); line(content_x,content_y+content_h,content_x+content_w,content_y+content_h,'line',.6,[2,2])
    line(content_x,content_y,content_x,content_y+content_h,'line',.6,[2,2]); line(content_x+content_w,content_y,content_x+content_w,content_y+content_h,'line',.6,[2,2])
    text('0,5x',gx-35,content_y+content_h*.4,10,'Mono','purple'); text('0,5x',450,gy-19,10,'Mono','purple')
    text('A área livre é medida a partir do contorno visível da assinatura.',138,450,9,'Body','muted')
    specs=[('160 px','Horizontal'),('110 px','Nome isolado'),('24 px','Símbolo padrão'),('16 px','Símbolo micro')]
    for i,(v,l) in enumerate(specs):
        x=48+i*221; text(v,x,495,24,'BodyBold'); text(l,x,530,11,'Body','muted')
    text('Mínimos digitais de referência. Para impressão, teste a reprodução e a leitura no suporte final.',48,563,10,'Body','muted')

    page('05 / CORES')
    title('PALETA E FUNÇÃO','A cor concentra a energia.','O grafite ancora a assinatura. O gradiente reúne expressão e reconhecimento.')
    swatches=[('Roxo','purple','Expressão principal'),('Laranja','orange','Energia pontual'),('Verde','green','Acento do símbolo'),('Grafite','ink','Texto e estrutura'),('Branco','white','Respiro'),('Névoa','paper','Superfícies suaves')]
    for i,(name,key,role) in enumerate(swatches):
        x=48+i*146
        rect(x,223,130,133,key,stroke='line' if key in ['white','paper'] else None,r=10)
        text(name,x,374,14,'BodyBold'); text(P[key],x,399,11,'Mono','muted'); lines(role,x,426,130,10,color='muted')
    line(48,470,912,470)
    label('TONS FUNCIONAIS',48,491)
    for i,(key,lbl) in enumerate([('pdark','Roxo profundo'),('odark','Laranja profundo'),('gdark','Verde profundo')]):
        x=245+i*223; rect(x,491,30,30,key,r=6); text(lbl,x+41,489,11,'BodyBold'); text(P[key],x+41,509,10,'Mono','muted')
    text('Paleta digital sRGB. Os tons profundos apoiam interfaces e contraste; não criam novas assinaturas.',48,554,10,'Body','muted')

    page('06 / COR EM CONTEXTO')
    title('HIERARQUIA','Uma marca em fundos diferentes.')
    rect(48,193,422,199,'paper',r=16); add_asset('apliquefy-horizontal-principal.svg',74,256,368,78)
    rect(490,193,422,199,'ink',r=16); add_asset('apliquefy-horizontal-negativa.svg',516,256,368,78)
    label('FUNDO CLARO',70,216); label('FUNDO ESCURO',512,216,'#C4BED2')
    boxnote('Base neutra','Superfícies claras ou grafite permitem que o símbolo seja o foco.',48,418,275,119)
    boxnote('Acentos com função','Evite repetir o gradiente em todos os botões, cards e títulos.',342,418,275,119)
    boxnote('Contraste legível','Use tons profundos quando necessário. Não dependa apenas da cor para informar estados.',637,418,275,119)
    text('Evite letras brancas pequenas sobre laranja ou verde vivos. Verifique cada combinação no uso real.',48,555,10,'Body','muted')

    page('07 / TIPOGRAFIA ORIGINAL')
    title('APLIQUEFY DISPLAY','Uma voz desenhada para a marca.','Família original de exibição: Regular R2 e Bold. Curvas abertas, terminais arredondados e ritmo próprio.')
    text('apliquefy',48,220,82,'ApBold')
    text('Seu próximo passo.',48,320,39,'ApRegular')
    text('ABCDEFGHIJKLMNOPQRSTUVWXYZ',48,406,23,'ApRegular')
    text('abcdefghijklmnopqrstuvwxyz',48,449,27,'ApBold')
    text('0123456789  À Á Â Ã Ç É Ê Í Ó Ô Õ Ú Ü',48,497,22,'ApRegular')
    text('Regular R2 / revisão 1.001. O lettering dos logos e a Bold preservam a construção e o espaçamento.',48,558,10,'Body','muted')

    page('08 / USO TIPOGRÁFICO')
    title('LEGIBILIDADE','Expressão no título. Clareza no uso.')
    rect(48,197,503,325,'paper',r=16)
    label('EXEMPLO DE HIERARQUIA',72,219)
    text('O próximo passo',72,270,33,'ApBold'); text('começa com você.',72,316,33,'ApBold')
    lines('Organize suas preferências e acompanhe suas candidaturas com clareza.',72,381,401,14,color='muted')
    rect(72,442,225,44,'purple',r=10); text('Encontrar oportunidades',88,458,11,'BodyBold','white')
    text('Títulos',590,210,15,'BodyBold'); lines('Instale Apliquefy Display R2 (Regular) e Apliquefy Display (Bold). Use em títulos e textos curtos; na web, ambos usam a família CSS Apliquefy Display.',590,244,310,12,color='muted')
    text('Interface e leitura longa',590,341,15,'BodyBold'); lines('Use a pilha de fontes do sistema para formulários, ajuda, descrições extensas e informações de serviço.',590,375,310,12,color='muted')
    lines('Cobertura inicial: latim ocidental. Os arquivos não incluem todos os sistemas de escrita; use fontes de apoio adequadas para outros idiomas.',48,547,848,11,color='muted')

    page('09 / ICONOGRAFIA')
    title('UM VOCABULÁRIO COMUM','Ícones que ajudam a entender.','Grade de 24 px, traço de 1,8 px e terminais arredondados. Cor herdada via currentColor.')
    icon_names=['search','location','work','resume','automation','send','clock','check-circle','education','calendar','profile','filter','pause','lock','salary','globe']
    iconfiles=[ROOT/'04_Icones'/'SVG'/(n+'.svg') for n in icon_names]
    if len(iconfiles)<8: raise FileNotFoundError('Need actual icon SVG assets in 04_Icones.')
    for i,f in enumerate(iconfiles):
        x=48+(i%8)*110; y=220+(i//8)*132
        rect(x,y,94,91,'paper',r=12); svg(f,x+30,y+17,34,34)
        names={'search':'Buscar','location':'Localização','work':'Trabalho','resume':'Currículo','automation':'Automação','send':'Enviar','clock':'Tempo','check-circle':'Concluído','education':'Formação','calendar':'Calendário','profile':'Perfil','filter':'Filtros','pause':'Pausar','lock':'Segurança','salary':'Salário','globe':'Idioma'}
        name=names.get(f.stem,f.stem)
        lines(name,x+3,y+67,89,8,color='muted',leading=10)
    boxnote('Tamanho','Priorize 20 ou 24 px em UI; respeite a espessura do desenho.',48,493,275,74)
    boxnote('Significado','Use rótulos para ações ambíguas ou pouco familiares.',342,493,275,74)
    boxnote('Estado','Combine cor, texto e forma para sucesso, atenção e erro.',637,493,275,74)

    page('10 / COMPONENTES')
    title('SISTEMA DIGITAL','A confiança também está nos detalhes.','Amostra de aplicação. Os valores e estados implementáveis estão no kit de componentes e tokens.')
    rect(48,211,420,334,'paper',r=16)
    label('AÇÕES E ESTADOS',72,233)
    rect(72,271,158,44,'purple',r=10); text('Continuar',120,286,12,'BodyBold','white')
    rect(249,271,188,44,'white',stroke='line',r=10); text('Ver preferências',272,286,12,'BodyBold')
    pill('Ativa',72,334,84,'#DAF5E5','gdark','BodyBold',11)
    pill('Em análise',169,334,124,'#EEE7FF','pdark','BodyBold',11)
    pill('Pausada',306,334,104,'#E9E6ED','muted','BodyBold',11)
    text('Localização',72,405,12,'BodyBold'); rect(72,431,372,44,'white',stroke='line',r=10); text('Cidade ou região',88,446,12,'Body','muted')
    text('Grade 4 px / controles 44 px / raio 10 px',72,505,10,'Mono','muted')
    text('Forma',510,222,15,'BodyBold'); lines('Grade de 4 px. Raios de 6 px em elementos pequenos, 10 px em controles e 16 px em cartões.',510,253,389,12,color='muted')
    text('Interação',510,343,15,'BodyBold'); lines('Foco de 2 px com afastamento de 3 px. Ações principais evidentes e retorno claro para cada estado.',510,374,389,12,color='muted')
    text('Acessibilidade',510,464,15,'BodyBold'); lines('Área clicável confortável, contraste e informação que não dependa só da cor.',510,495,389,12,color='muted')

    page('11 / APLICAÇÃO DIGITAL')
    title('WEBSITE PRIMEIRO','Familiar, simples e com presença.','Exemplo de composição para orientar a implementação. A oferta deve refletir a cobertura real do produto.')
    rect(48,211,864,346,'paper',stroke='line',r=14)
    add_asset('apliquefy-horizontal-principal.svg',71,231,186,42)
    text('Como funciona',563,246,10,'Body','muted'); text('Entrar',699,246,10,'Body'); rect(767,233,114,44,'purple',r=10); text('Começar',798,249,10,'BodyBold','white')
    line(72,289,886,289)
    text('Sua busca por trabalho',76,327,35,'ApBold'); text('acompanha sua vida.',76,373,35,'ApBold')
    lines('Defina o que você procura. Conte com IA para apoiar suas candidaturas e acompanhe o andamento.',76,435,496,12,color='muted')
    rect(76,490,208,44,'purple',r=10); text('Preparar minha busca',92,506,11,'BodyBold','white')
    symbol('apliquefy-simbolo-gradiente.svg',660,328,192,192)

    page('12 / VOZ E REPRESENTAÇÃO')
    title('PROXIMIDADE COM RESPEITO','Falar com pessoas. Mostrar pessoas.')
    label('LINGUAGEM',48,204,'purple'); label('REPRESENTAÇÃO',502,204,'purple')
    text('Direta e compreensível',48,245,20,'BodyBold')
    lines('Explique a ação e o que acontece depois. Prefira “candidatura enviada” a jargões de automação. Escreva frases curtas e evite infantilizar.',48,286,386,14,color='muted')
    text('Clara sobre os limites',48,412,20,'BodyBold')
    lines('A marca pode apoiar a busca e o envio de candidaturas. Não promete contratação, entrevista nem cobertura inexistente.',48,451,386,14,color='muted')
    line(470,215,470,554)
    text('Dignidade em toda ocupação',502,245,20,'BodyBold')
    lines('Fotografe ambientes e pessoas reais, com diversidade de idade, aparência e profissão. Varejo, serviços, saúde e escritório recebem o mesmo cuidado.',502,286,386,14,color='muted')
    text('Tecnologia como apoio',502,412,20,'BodyBold')
    lines('Priorize o benefício humano. Evite robôs, cérebros digitais e imagens que reduzam a identidade a uma estética genérica de IA.',502,451,386,14,color='muted')

    page('13 / MOVIMENTO')
    title('RITMO','Movimento que informa.')
    phases=[('1','Intenção','A pessoa inicia uma ação.'),('2','Processo','O sistema mostra andamento.'),('3','Retorno','O resultado fica compreensível.')]
    for i,(n,head,body) in enumerate(phases):
        x=48+i*294; rect(x,219,275,211,'paper',r=16)
        text(n,x+21,240,34,'ApBold','purple'); text(head,x+21,307,19,'BodyBold'); lines(body,x+21,347,232,13,color='muted')
        if i<2: line(x+256,265,x+289,265,'purple',2)
    boxnote('Transições','Curvas suaves e duração curta. Evite saltos e movimentos que distraiam.',48,457,275,99)
    boxnote('Carregamento','Explique a espera. Não use porcentagens fictícias nem progresso enganoso.',342,457,275,99)
    boxnote('Movimento reduzido','Respeite prefers-reduced-motion e ofereça retorno estático equivalente.',637,457,275,99)

    page('14 / INTEGRIDADE')
    title('CRITÉRIOS DE USO','O reconhecimento vem da consistência.')
    rules=[('Preserve o desenho','Use os SVGs originais e redimensione de forma proporcional.'),('Mantenha o nome estável','O nome aparece em grafite, branco ou na versão monocromática prevista.'),('Proteja o espaço','Não encoste textos, bordas, fotos ou outros símbolos na assinatura.'),('Concentre o gradiente','Não recolora letras individualmente nem crie gradientes alternativos.'),('Escolha uma família','Sorriso e raios das explorações anteriores ficam fora desta identidade.'),('Use a versão adequada','Em espaços mínimos, utilize o símbolo micro e preserve legibilidade.')]
    for i,(head,body) in enumerate(rules):
        x=48+(i%2)*442; y=211+(i//2)*112
        text(f'{i+1:02}',x,y,12,'Mono','purple'); text(head,x+42,y-2,16,'BodyBold'); lines(body,x+42,y+32,355,12,color='muted')

    page('15 / ENTREGA E CONTINUIDADE',bg='ink',dark=True)
    title('ARQUIVOS ORGANIZADOS','Um sistema pronto para evoluir.',dark=True)
    folders=[('00_Guia','Este manual e sua fonte de geração.'),('01_Logos','Assinaturas horizontais, verticais e wordmarks.'),('02_Simbolo_Produto','Símbolo, versão micro e ícones de produto.'),('03_Tipografia','Fontes originais, formatos e informações de uso.'),('04_Icones','Biblioteca de ícones vetoriais e rasterizados.'),('05_Componentes','Componentes e estados para implementação.'),('06_Tokens','Valores do sistema em formatos reutilizáveis.'),('07_Aplicacoes','Exemplos de aplicação da identidade.'),('08_Fontes_Editaveis','Arquivos e código para manutenção do sistema.')]
    for i,(name,desc) in enumerate(folders):
        y=193+i*32
        text(name,48,y,11,'Mono','white'); text(desc,276,y,11,'Body','#C4BED2')
    lines('Release inicial: fontes de exibição com cobertura latina ocidental e sistema visual para uso digital. Valide legibilidade, idioma, reprodução e componentes no contexto real antes de ampliar aplicações.',48,514,841,12,color='#C4BED2')
    C.save()
    # Native paths and axial gradients were drawn directly into the PDF.
    doc=fitz.open(WORK/'base.pdf')
    doc.set_metadata({'title':'Apliquefy | Guia de Identidade Visual v1.0','author':'Apliquefy','subject':'Sistema de identidade, tipografia original e aplicações digitais','creator':'Apliquefy identity build'})
    doc.save(OUT,garbage=4,deflate=True)
    print(json.dumps({'output':str(OUT),'pages':len(doc),'svg_placements':len(PLACEMENTS),'font_regular':str(reg),'font_bold':str(bold)},ensure_ascii=False,indent=2))
    doc.close()

if __name__=='__main__': build()
