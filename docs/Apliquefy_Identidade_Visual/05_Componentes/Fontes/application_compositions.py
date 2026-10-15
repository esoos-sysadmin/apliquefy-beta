from pathlib import Path
exec((Path(__file__).resolve().parent/'export_components.py').read_text().split("b=txt('Ações'")[0])
import xml.etree.ElementTree as ET
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

C=R/'05_Componentes'
fontpath=R/'03_Tipografia'/'TTF'/'ApliquefyDisplayR2-Regular.ttf'
font=TTFont(fontpath)

def heading(text,x,y,size):
 gs=font.getGlyphSet();cmap=font.getBestCmap();units=font['head'].unitsPerEm;s=size/units;body='';cursor=0
 for c in text:
  n=cmap.get(ord(c),'.notdef');pen=SVGPathPen(gs);gs[n].draw(pen)
  body+=f'<path d="{pen.getCommands()}" transform="translate({cursor} 0)"/>'
  cursor+=font['hmtx'][n][0]
 return f'<g fill="#14121C" transform="translate({x} {y}) scale({s} {-s})">{body}</g>'

def embed(svg,x,y,w):
 source=Path(svg).read_text();v=re.search(r'viewBox="([^"]+)"',source).group(1).split();sw,sh=float(v[2]),float(v[3])
 content=source.split('>',1)[1].rsplit('</svg>',1)[0]
 content=re.sub(r'<title[^>]*>.*?</title>|<desc[^>]*>.*?</desc>','',content)
 return f'<g transform="translate({x} {y}) scale({w/sw})">{content}</g>',w/sw*sh

def job(x,y,w,title='Auxiliar de loja',company='Mercado Horizonte',initial='MH',kind='Efetivo',salary='R$ 1.850 / mês',extra='Ensino médio'):
 # Same hierarchy, grid, radius and labels as the reusable card; compact vertically for the applied specimen.
 b=rect(x,y,w,242,'white',16,'#D8D4E2')+rect(x+20,y+20,42,42,'#F6F4FA',10)+txt(initial,x+41,y+47,12,'#14121C',600,'middle')+txt(title,x+74,y+35,15,weight=600)+txt(company,x+74,y+55,12,'#625D6C')+ico('bookmark',x+w-38,y+28,18)
 b+=ico('location',x+20,y+83,16)+txt('Recife, PE',x+41,y+96,12,'#625D6C')+ico('clock',x+130,y+83,16)+txt('Presencial',x+151,y+96,12,'#625D6C')
 b+=badge(kind,x+20,y+116,84 if kind=='Efetivo' else 82)+badge(extra,x+114,y+116,120 if extra=='Ensino médio' else 164)
 b+=line(x+20,y+160,x+w-20,y+160,'#ECE9F1')+txt(salary,x+20,y+187,13,weight=600)+txt('Valor mensal informado',x+20,y+206,11,'#625D6C')+btn('Ver detalhes',x+w-150,y+178,130,'secondary')
 return b

def make_desktop():
 w,h=1440,1130;b=rect(0,0,w,h,'#FBFAFD',0)+rect(0,0,232,h,'white',0)+line(232,0,232,h)+rect(232,0,1208,84,'white',0)+line(232,84,1440,84)
 logo,_=embed(R/'01_Logos/SVG/apliquefy-horizontal-principal.svg',22,23,188);b+=logo
 for i,(t,ic,on) in enumerate([('Visão geral','home',True),('Oportunidades','search',False),('Candidaturas','resume',False),('Preferências','settings',False)]):
  y=133+i*54
  if on:b+=rect(18,y,195,44,'#F0E9FF',10)
  b+=ico(ic,33,y+12,20,'#5420BF' if on else '#625D6C')+txt(t,65,y+28,13,'#5420BF' if on else '#625D6C',600 if on else 400)
 b+=line(24,h-116,208,h-116)+f'<circle cx="44" cy="{h-73}" r="18" fill="#EAE3F4"/>'+txt('AS',44,h-68,12,'#5C427C',600,'middle')+txt('Ana Silva',74,h-79,12,weight=600)+txt('Minha conta',74,h-60,10,'#625D6C')
 b+=txt('Minha busca',272,49,12,'#625D6C')+txt('/',357,49,12,'#625D6C')+txt('Visão geral',378,49,12,weight=600)+rect(1189,29,111,25,'white',6,'#D8D4E2')+f'<circle cx="1201" cy="42" r="2.5" fill="#FF7A00"/>'+txt('Demonstração',1209,46,10,'#625D6C',600)+ico('bell',1320,30,22)+f'<circle cx="1392" cy="42" r="18" fill="#EAE3F4"/>'+txt('AS',1392,46,12,'#5C427C',600,'middle')
 b+=txt('SUA BUSCA, NO SEU RITMO',272,132,11,'#625D6C',600)+heading('Olá, Ana.',272,187,40)+txt('Acompanhe cada passo da sua busca por trabalho.',272,218,15,'#625D6C')+btn('Pausar candidaturas',1210,170,184,'secondary')
 b+=rect(272,247,1122,82,'#F8F4FF',10,'#DBCEF4')+ico('info',290,269,20,'#5420BF')+txt('Suas preferências',322,276,14,weight=600)+txt('Comércio, atendimento e administração · Recife e região · Presencial ou híbrido.',322,302,13,'#625D6C')
 for i,(labelt,num) in enumerate([('Oportunidades selecionadas','12'),('Candidaturas enviadas','8'),('Informações a revisar','2')]):
  x=272+i*382;b+=rect(x,353,358,118,'white',12,'#D8D4E2')+txt(labelt,x+20,381,12,'#625D6C')+txt(num,x+20,420,29,weight=600)
 b+=heading('Oportunidades para explorar',272,522,26)+txt('Ver todas',1394,521,12,'#625D6C',anchor='end')+job(272,545,548)+job(844,545,550,'Estágio administrativo','Escritório Aurora','EA','Estágio','R$ 1.200 / mês','Cursando graduação')
 b+=heading('Atividade recente',272,839,26)+txt('Hoje',1394,838,12,'#625D6C',anchor='end')+rect(272,862,1122,190,'white',16,'#D8D4E2')
 for i,(initial,title,company,state,kind,time) in enumerate([('FV','Atendente de farmácia','Farmácia Vila','Enviada','positive','Hoje, 10:42'),('EA','Estágio administrativo','Escritório Aurora','Em análise','purple','Hoje, 09:18'),('MH','Auxiliar de loja','Mercado Horizonte','A revisar','warning','Ontem')]):
  y=878+i*56;b+=rect(292,y,36,36,'#F6F4FA',10)+txt(initial,310,y+23,11,'#14121C',600,'middle')+txt(title,342,y+14,13,weight=600)+txt(company,342,y+32,11,'#625D6C')+badge(state,1110,y+6,105,kind)+txt(time,1374,y+25,11,'#625D6C',anchor='end')
  if i<2:b+=line(292,y+47,1374,y+47,'#ECE9F1')
 b+=txt('Composição visual. Pessoas, empresas, vagas, valores e métricas são fictícios. Nenhuma candidatura é enviada.',272,1090,11,'#625D6C')
 return w,h,b

def make_mobile():
 w,h=390,1550;b=rect(0,0,w,h,'#FBFAFD',0)+rect(0,0,w,76,'white',0)+line(0,76,w,76)+ico('menu',23,27,22,'#5420BF')+rect(201,26,111,25,'white',6,'#D8D4E2')+f'<circle cx="213" cy="39" r="2.5" fill="#FF7A00"/>'+txt('Demonstração',221,43,10,'#625D6C',600)+f'<circle cx="351" cy="39" r="18" fill="#EAE3F4"/>'+txt('AS',351,43,12,'#5C427C',600,'middle')
 b+=txt('SUA BUSCA, NO SEU RITMO',20,114,10,'#625D6C',600)+heading('Olá, Ana.',20,161,34)+txt('Acompanhe cada passo da sua busca',20,194,14,'#625D6C')+txt('por trabalho.',20,215,14,'#625D6C')+btn('Pausar candidaturas',20,236,188,'secondary')
 b+=rect(20,301,350,135,'#F8F4FF',10,'#DBCEF4')+ico('info',35,320,20,'#5420BF')+txt('Suas preferências',67,342,13,weight=600)+txt('Comércio e administração · Recife',67,384,12,'#625D6C')+txt('Presencial ou híbrido.',67,405,12,'#625D6C')
 for i,(l1,l2,num) in enumerate([('Oportunidades','selecionadas','12'),('Candidaturas','enviadas','8'),('Informações','a revisar','2')]):
  x=20+i*120;b+=rect(x,457,110,107,'white',12,'#D8D4E2')+txt(l1,x+11,479,10,'#625D6C')+txt(l2,x+11,494,10,'#625D6C')+txt(num,x+11,538,28,weight=600)
 b+=heading('Oportunidades',20,611,25)+txt('Com base nas suas preferências',20,636,12,'#625D6C')+job(20,657,350)+job(20,915,350,'Estágio administrativo','Escritório Aurora','EA','Estágio','R$ 1.200 / mês','Cursando graduação')
 b+=heading('Atividade recente',20,1207,25)+rect(20,1226,350,136,'white',16,'#D8D4E2')
 for i,(title,company,state,kind) in enumerate([('Atendente de farmácia','Farmácia Vila','Enviada','positive'),('Estágio administrativo','Escritório Aurora','Em análise','purple')]):
  y=1245+i*57;b+=txt(title,36,y+13,12,weight=600)+txt(company,36,y+32,11,'#625D6C')+badge(state,258,y+5,97,kind)
  if i==0:b+=line(36,y+46,354,y+46,'#ECE9F1')
 b+=txt('Composição visual com dados fictícios.',20,1400,11,'#625D6C')+txt('Nenhuma candidatura é enviada.',20,1418,11,'#625D6C')
 b+=rect(0,1470,390,80,'white',0)+line(0,1470,390,1470)
 for i,(textt,ic,on) in enumerate([('Início','home',True),('Vagas','search',False),('Candidaturas','resume',False),('Preferências','settings',False)]):
  x=14+i*94
  if on:b+=rect(x,1480,80,56,'#F0E9FF',8)
  b+=ico(ic,x+30,1486,20,'#5420BF' if on else '#625D6C')+txt(textt,x+40,1526,10,'#5420BF' if on else '#625D6C',600 if on else 400,'middle')
 return w,h,b

for name,maker in [('composicao-desktop',make_desktop),('composicao-mobile',make_mobile)]:
 w,h,b=maker()
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title desc"><title id="title">Apliquefy — {name}</title><desc id="desc">Composição vetorial demonstrativa da identidade aplicada; dados fictícios. Não é captura de produto funcional.</desc><g font-family="Arial, Liberation Sans, sans-serif">{b}</g></svg>'
 (C/'previews'/f'{name}.svg').write_text(svg)
print('Application vector compositions created.')
