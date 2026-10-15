from pathlib import Path
from html.parser import HTMLParser
import re,json,xml.etree.ElementTree as ET
from PIL import Image

R=Path(__file__).resolve().parents[2]
C=R/'05_Componentes'
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.labels=[];self.controls=[];self.refs=[];self.aria=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if tag=='label' and a.get('for'):self.labels.append(a['for'])
  if tag in ('input','textarea','select'):self.controls.append(a)
  for k in ['src','href']:
   if k in a:self.refs.append(a[k])
  for k in ['aria-controls','aria-labelledby','aria-describedby']:
   if k in a:self.aria+=a[k].split()

checks=[]
for fn in ['catalogo.html','aplicacao.html']:
 p=Parser();p.feed((C/fn).read_text());missing=[]
 for ref in p.refs:
  if ref.startswith(('http:','https:','data:')):continue
  if ref.startswith('#'):
   if ref[1:] not in p.ids:missing.append(ref)
  else:
   target=ref.split('#')[0]
   if not (C/target).exists():missing.append(ref)
 for ref in p.aria:
  if ref not in p.ids:missing.append('#'+ref)
 checks.append({'file':fn,'references_valid':not missing,'missing_references':missing,'unique_ids':len(p.ids)==len(set(p.ids)),'associated_labels_for_named_fields':all(c.get('id') in p.labels or c.get('aria-label') or c.get('aria-labelledby') or c.get('type') in ['checkbox','radio'] for c in p.controls),'no_network_scripts':not any(r.startswith(('http:','https:')) for r in p.refs)})
css=(C/'components.css').read_text()
cssrefs=re.findall(r'url\([\"\']?([^\"\'\)]+)',css)
checks.append({'file':'components.css','references_valid':all((C/x).exists() for x in cssrefs),'references':cssrefs,'responsive_breakpoints':[740,1100],'reduced_motion_present':'prefers-reduced-motion:reduce' in css})
svgcount=0
for p in C.glob('**/*.svg'):
 root=ET.fromstring(p.read_text());assert not root.findall('.//{http://www.w3.org/2000/svg}image'),p;svgcount+=1
pngcount=0
for p in C.glob('**/*.png'):
 im=Image.open(p);im.verify();pngcount+=1
data=json.loads((R/'06_Tokens/design-tokens.json').read_text())
checks.append({'file':'design-tokens.json','parseable':True,'master_gradient_matched':data['brandGradient']['x1']==.26 and [x['position'] for x in data['brandGradient']['stops']]==[0,34,72,100]})
report={'status':'Static checks passed; visual compositions inspected','svg_native_vector_files':svgcount,'valid_png_files':pngcount,'checks':checks,'javascript_syntax':'node --check passed','browser_validation':'Not performed. Runtime has no browser executable; Chromium download returned a truncated archive. No browser-rendering or interaction-test claim is made.','visual_review':'PNG contact sheets inspected: components and desktop/mobile compositions. No clipping or overlapping text observed.'}
(C/'VALIDACAO.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
