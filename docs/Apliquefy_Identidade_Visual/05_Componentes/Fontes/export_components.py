from pathlib import Path
import json, re, html

R=Path(__file__).resolve().parents[2]
O=R/'05_Componentes'/'exports'/'svg'
K={'ink':'#14121C','purple':'#7A3BFF','active':'#5420BF','border':'#D8D4E2','muted':'#625D6C','soft':'#F6F4FA','success':'#08773A','warning':'#A64500','error':'#B42318'}
manifest=[]
def rect(x,y,w,h,fill='#FFFFFF',r=10,stroke=None,sw=1):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{sw}"' if stroke else '')+'/>'
def line(x,y,x2,y2,color='#D8D4E2'):
 return f'<path d="M{x} {y}H{x2}" stroke="{color}"/>' if y==y2 else f'<path d="M{x} {y}L{x2} {y2}" stroke="{color}"/>'
def txt(s,x,y,size=14,fill='#14121C',weight=400,anchor='start'):
 return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{html.escape(s)}</text>'
def ico(name,x,y,size=20,color='#625D6C'):
 p=R/'04_Icones'/'SVG'/f'{name}.svg'
 if not p.exists():return ''
 body=p.read_text().split('>',1)[1].rsplit('</svg>',1)[0]
 body=re.sub(r'<title>.*?</title>','',body)
 return f'<g transform="translate({x} {y}) scale({size/24})" fill="none" stroke="{color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{body}</g>'
def btn(s,x,y,w=136,kind='primary',state='default'):
 fill,stroke,fg={'primary':('#7A3BFF',None,'white'),'secondary':('white','#D8D4E2','#14121C'),'ghost':('none',None,'#5420BF'),'danger':('#B42318',None,'white')}[kind]
 if state=='hover':fill='#6527DC'
 if state=='active':fill='#5420BF'
 if state=='disabled':fill='#ECE9F1';fg='#756F80';stroke=None
 b=(rect(x-4,y-4,w+8,52,'none',14,'#5420BF',2) if state=='focus' else '')
 b+=rect(x,y,w,44,fill,10,stroke)
 b+=txt(s,x+w/2,y+27,14,fg,600,'middle')
 return b
def label(s,x,y):return txt(s,x,y,11,'#625D6C',400)
def badge(s,x,y,w,kind='neutral'):
 bg,fg={'neutral':('#F6F4FA','#625D6C'),'positive':('#EAF8EF','#08773A'),'purple':('#F0E9FF','#5420BF'),'warning':('#FFF2E6','#A64500'),'error':('#FFF0EE','#B42318')}[kind]
 return rect(x,y,w,26,bg,6)+f'<circle cx="{x+11}" cy="{y+13}" r="2.5" fill="{fg}"/>'+txt(s,x+20,y+17,11,fg,600)
def field(labeltext,value,x,y,w=320,state='default',hint=''):
 stroke={'default':'#D8D4E2','focus':'#7A3BFF','error':'#B42318','disabled':'#D8D4E2'}[state]
 fill='#ECE9F1' if state=='disabled' else 'white'
 b=txt(labeltext,x,y,13,weight=600)
 if state=='focus':b+=rect(x-4,y+10,w+8,52,'none',14,'#5420BF',2)
 b+=rect(x,y+14,w,44,fill,10,stroke)+txt(value,x+12,y+41,14,'#756F80' if state=='disabled' else '#14121C')
 if hint:b+=txt(hint,x,y+78,11,'#B42318' if state=='error' else '#625D6C')
 return b
def export(id,title,w,h,body,description):
 header=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title desc"><title id="title">{html.escape(title)}</title><desc id="desc">{html.escape(description)}</desc><g font-family="Arial, Liberation Sans, sans-serif">'
 (O/f'{id}.svg').write_text(header+body+'</g></svg>')
 manifest.append({'id':id,'title':title,'width':w,'height':h,'svg':f'svg/{id}.svg','png1x':f'png-1x/{id}.png','png2x':f'png-2x/{id}@2x.png','description':description})

b=txt('Ações',24,36,20,weight=600)+txt('Uma ação principal por contexto.',24,61,12,'#625D6C')
for i,(s,kind) in enumerate([('Continuar','primary'),('Voltar','secondary'),('Agora não','ghost'),('Excluir','danger')]):b+=btn(s,24+i*174,85,154,kind)
for i,(s,state) in enumerate([('Hover','hover'),('Pressionado','active'),('Foco','focus'),('Desabilitado','disabled')]):b+=label(s,24+i*174,167)+btn('Continuar',24+i*174,182,154,'primary',state)
export('01-botoes','Botões e estados',728,252,b,'Hierarquia e estados nativos vetoriais. Texto editável. PNG com fundo transparente.')

b=txt('Campos de formulário',24,36,20,weight=600)
b+=field('Que trabalho você procura?','Atendente',24,83,326,'default','Você pode procurar por função ou área.')
b+=field('Onde você quer trabalhar?','Recife, PE',384,83,326,'focus','Exemplo visual do estado de foco.')
b+=field('E-mail','ana@',24,218,326,'error','Digite um e-mail completo para continuar.')
b+=field('País','Brasil',384,218,326,'disabled','Não representa cobertura disponível.')
export('02-campos','Campos e estados',734,328,b,'Campos com rótulos permanentes e estados padrão, foco, erro e desabilitado.')

b=txt('Status de candidaturas',24,36,20,weight=600)
for x,s,w,k in [(24,'Enviada',91,'positive'),(127,'Em análise',107,'purple'),(246,'A revisar',94,'warning'),(352,'Pausada',94,'neutral'),(458,'Não enviada',121,'error')]:b+=badge(s,x,66,w,k)
b+=txt('A cor complementa o texto; nunca substitui a informação.',24,127,12,'#625D6C')
export('03-status','Etiquetas de status',603,150,b,'Cinco status com texto, ponto e superfícies semânticas.')

b=rect(1,1,438,288,'white',16,'#D8D4E2')+rect(25,25,44,44,'#F6F4FA',10)+txt('MH',47,52,13,'#14121C',600,'middle')+txt('Auxiliar de loja',81,42,16,weight=600)+txt('Mercado Horizonte',81,62,12,'#625D6C')+ico('bookmark',392,32,20)
b+=ico('location',25,91,16)+txt('Recife, PE',47,104,12,'#625D6C')+ico('clock',137,91,16)+txt('Presencial',159,104,12,'#625D6C')
b+=badge('Efetivo',25,125,82)+badge('Ensino médio',117,125,122)+line(25,179,415,179,'#ECE9F1')+txt('R$ 1.850 / mês',25,209,14,weight=600)+txt('Valor mensal informado',25,230,11,'#625D6C')+btn('Ver detalhes',285,197,130,'secondary')
b+=txt('Publicada hoje',25,268,10,'#625D6C')
export('04-cartao-vaga','Cartão de oportunidade',440,290,b,'Oportunidade fictícia do varejo. Ação secundária e status legível.')

b=rect(1,1,778,262,'white',16,'#D8D4E2')+txt('Acompanhamento de candidaturas',25,34,16,weight=600)+txt('Hoje',755,34,11,'#625D6C',anchor='end')
for y,initial,title,company,state,w,kind,time in [(58,'FV','Atendente de farmácia','Farmácia Vila','Enviada',91,'positive','Hoje, 10:42'),(124,'EA','Estágio administrativo','Escritório Aurora','Em análise',107,'purple','Hoje, 09:18'),(190,'MH','Auxiliar de loja','Mercado Horizonte','A revisar',94,'warning','Ontem')]:
 b+=rect(25,y,40,40,'#F6F4FA',10)+txt(initial,45,y+25,12,'#14121C',600,'middle')+txt(title,81,y+15,14,weight=600)+txt(company+'',81,y+34,11,'#625D6C')+badge(state,519,y+7,w,kind)+txt(time,754,y+25,11,'#625D6C',anchor='end')
 if y<190:b+=line(25,y+54,754,y+54,'#ECE9F1')
export('05-candidaturas','Linhas de candidatura',780,264,b,'Três estados de candidatura ilustrativos, com empresas e horários fictícios.')

b=txt('Escolhas',24,35,20,weight=600)
for x,checked,text in [(24,True,'Presencial'),(196,False,'Híbrido')]:
 b+=rect(x,65,18,18,'#7A3BFF' if checked else 'white',4,None if checked else '#D8D4E2')
 if checked:b+=ico('check',x+1,66,16,'white')
 b+=txt(text,x+29,80,14)
for x,checked,text in [(24,True,'Agora'),(196,False,'Em 30 dias')]:
 b+=f'<circle cx="{x+9}" cy="124" r="9" fill="white" stroke="{K["purple"] if checked else K["border"]}"/>'
 if checked:b+=f'<circle cx="{x+9}" cy="124" r="5" fill="#7A3BFF"/>'
 b+=txt(text,x+29,129,14)
export('06-checkbox-radio','Checkbox e radio',370,166,b,'Seleções de opção múltipla e única. Indicador de forma reforça a cor.')

b=txt('Preferências',24,35,20,weight=600)
for y,on,t in [(67,True,'Receber resumo'),(117,False,'Incluir vagas de estágio')]:
 b+=txt(t,24,y+17,14)+rect(306,y,40,24,'#7A3BFF' if on else '#827C8A',12)+f'<circle cx="{335 if on else 317}" cy="{y+12}" r="9" fill="white"/>'
export('07-switch','Interruptores de preferência',370,166,b,'Interruptores ligados e desligados acompanhados de rótulo.')

b=txt('Áreas de interesse',24,35,20,weight=600)
for x,y,w,t,on in [(24,62,194,'Comércio e atendimento',True),(230,62,138,'Administração',False),(24,110,154,'Primeiro emprego',True),(190,110,92,'Estágio',False)]:
 b+=rect(x,y,w,36,'#F0E9FF' if on else 'white',6,'#7A3BFF' if on else '#D8D4E2')+txt(t,x+12,y+23,13,'#5420BF' if on else '#625D6C')
export('08-chips','Seleção de áreas',392,170,b,'Chips com estados selecionado e disponível.')

b=rect(1,1,618,113,'#F8F4FF',10,'#DBCEF4')+ico('info',19,20,20,'#5420BF')+txt('Você define sua busca.',51,33,14,weight=600)+txt('Escolha as áreas, a região e os horários que fazem sentido.',51,58,13,'#625D6C')+txt('Revise suas preferências sempre que precisar.',51,80,13,'#625D6C')
export('09-alerta','Alerta informativo',620,115,b,'Mensagem informativa com ícone, título e orientação clara.')

b=rect(0,0,464,58,'#14121C',10)+ico('check',17,19,20,'#75D99F')+txt('Preferências salvas.',49,35,14,'white')+ico('close',425,19,20,'white')
export('10-toast','Toast de confirmação',464,58,b,'Confirmação breve em alto contraste, com ação de fechar.')

b=txt('Etapas da candidatura',24,35,20,weight=600)
for i,(title,sub) in enumerate([('Perfil','Informações completas'),('Preferências','Busca definida'),('Revisão','Confira os dados'),('Envio','Acompanhe o status')]):
 x=24+i*178
 if i<3:b+=line(x+28,80,x+178,80)
 fill,stroke,fg=('#EAF8EF','#BCE6CD','#08773A') if i<2 else ('#7A3BFF','#7A3BFF','white') if i==2 else ('#F6F4FA','#D8D4E2','#625D6C')
 b+=f'<circle cx="{x+14}" cy="80" r="14" fill="{fill}" stroke="{stroke}"/>'
 b+=ico('check',x+6,72,16,fg) if i<2 else txt(str(i+1),x+14,84,12,fg,600,'middle')
 b+=txt(title,x,116,12,weight=600)+txt(sub,x,136,11,'#625D6C')
export('11-etapas','Etapas de candidatura',738,160,b,'Etapas concluídas, atual e futura de um fluxo fictício.')

b=rect(1,1,438,238,'white',16,'#D8D4E2')+ico('search',204,29,32)+txt('Nenhuma vaga encontrada.',220,102,16,'#14121C',600,'middle')+txt('Experimente outra função ou amplie a região',220,132,13,'#625D6C',anchor='middle')+txt('da sua busca.',220,151,13,'#625D6C',anchor='middle')+btn('Ajustar busca',143,174,154,'secondary')
export('12-estado-vazio','Estado vazio',440,240,b,'Estado vazio com ação útil e texto de orientação.')

b=rect(1,1,438,218,'white',16,'#D8D4E2')+rect(25,25,44,44,'#ECE9F1',10)+rect(85,28,208,12,'#ECE9F1',4)+rect(85,53,138,12,'#ECE9F1',4)+rect(25,96,292,12,'#ECE9F1',4)+rect(25,123,356,12,'#ECE9F1',4)+rect(25,150,168,12,'#ECE9F1',4)+txt('Carregando oportunidades…',25,194,12,'#625D6C')
export('13-skeleton','Estado de carregamento',440,220,b,'Skeleton estático com descrição textual; não depende de animação.')

b=txt('Candidaturas',24,35,20,weight=600)
for x,t,w,on in [(24,'Todas',76,True),(108,'Enviadas',98,False),(214,'A revisar',98,False)]:
 b+=rect(x,59,w,44,'#F0E9FF' if on else 'none',6)+txt(t,x+w/2,86,14,'#5420BF' if on else '#625D6C',600 if on else 400,'middle')
b+=line(24,111,396,111)+txt('Acompanhe suas candidaturas em um só lugar.',24,145,12,'#625D6C')
export('14-abas','Abas de navegação',420,173,b,'Abas com seleção explícita. HTML correspondente oferece navegação pelo teclado.')

b=txt('Paginação',24,35,20,weight=600)
for i,s in enumerate(['←','1','2','3','4','5','→']):
 x=24+i*42
 b+=rect(x,61,36,36,'#F0E9FF' if i==1 else 'none',6,'#D5C3FE' if i==1 else None)+txt(s,x+18,84,13,'#5420BF' if i==1 else '#625D6C',600 if i==1 else 400,'middle')
b+=txt('Página 1 de 5',24,127,12,'#625D6C')
export('15-paginacao','Paginação',342,150,b,'Paginação de cinco páginas ilustrativas.')

b=f'<circle cx="48" cy="48" r="24" fill="#EAE3F4"/>'+txt('AS',48,54,16,'#5C427C',600,'middle')+txt('Ana Silva',89,43,14,weight=600)+txt('Minha conta',89,65,12,'#625D6C')+ico('info',296,38,20)
export('16-avatar','Avatar e identificação',342,96,b,'Avatar com iniciais e identificação fictícia. Sem fotografia genérica obrigatória.')

b=rect(1,1,478,147,'white',10,'#D8D4E2')+txt('O que acontece com os dados deste exemplo?',19,32,13,weight=600)+ico('chevron-up',439,16,20)+txt('Ficam apenas na memória desta página. O catálogo',19,70,13,'#625D6C')+txt('não envia candidaturas, não acessa serviços externos',19,92,13,'#625D6C')+txt('e não salva dados após recarregar.',19,114,13,'#625D6C')
export('17-disclosure','Informação complementar',480,149,b,'Disclosure aberto com resposta clara sobre a demonstração.')

b=rect(1,1,478,113,'#FFF2E6',10,'#F0D2B5')+ico('warning',19,20,20,'#A64500')+txt('Revise uma informação.',51,33,14,weight=600)+txt('Complete sua disponibilidade para continuar',51,60,13,'#625D6C')+txt('com suas candidaturas.',51,82,13,'#625D6C')
export('18-alerta-atencao','Alerta de atenção',480,115,b,'Alerta de atenção com orientação e sem associação exclusivamente cromática.')
(O.parent/'manifest.json').write_text(json.dumps({'name':'Apliquefy UI components','version':'1.0','exports':manifest},ensure_ascii=False,indent=2))
print(f'Exported {len(manifest)} SVG components.')
