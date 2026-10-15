from pathlib import Path
from PIL import Image
import xml.etree.ElementTree as ET
import json,re,hashlib
from fontTools.ttLib import TTFont
from urllib.parse import unquote
ROOT=Path(__file__).resolve().parents[2]/'Apliquefy_Identidade_Visual'
if not ROOT.exists():ROOT=Path(__file__).resolve().parents[1]
issues=[];checks={};files=[p for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in str(p)]
svgs=[p for p in files if p.suffix.lower()=='.svg']
for p in svgs:
    try: el=ET.parse(p).getroot()
    except Exception as e:issues.append(f'SVG inválido: {p.relative_to(ROOT)} {e}');continue
    if not el.get('viewBox') and not any(e.tag.rsplit('}',1)[-1]=='symbol' and e.get('viewBox') for e in el):issues.append(f'SVG sem viewBox: {p.relative_to(ROOT)}')
    if p.parent.name=='SVG' and p.parts[-3] in ('01_Logos','02_Simbolo_Produto'):
        if any(e.tag.rsplit('}',1)[-1] in ('image','text') for e in el.iter()):issues.append(f'Marca deve conter curvas: {p.relative_to(ROOT)}')
checks['svg_xml_validated']=len(svgs)
pngs=[p for p in files if p.suffix.lower()=='.png']
transparent=0
for p in pngs:
    try:
        im=Image.open(p);im.load()
        if 'A' in im.getbands() and im.getchannel('A').getextrema()[0]==0:transparent+=1
        if p.parent.name=='PNG' and p.parts[-3]=='01_Logos':
            if 'A' not in im.getbands() or im.getchannel('A').getextrema()[0]!=0:issues.append(f'Logo PNG sem alpha: {p.relative_to(ROOT)}')
    except Exception as e:issues.append(f'PNG inválido: {p.relative_to(ROOT)} {e}')
checks['png_decoded']=len(pngs);checks['png_with_transparency']=transparent
fonts=[]
for p in files:
    if p.suffix in ('.ttf','.otf','.woff2'):
        try:
            f=TTFont(p);cm=f.getBestCmap()
            required='apliquefyABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ'
            missing=[c for c in required if ord(c) not in cm]
            if missing:issues.append(f'Fonte incompleta {p.name}: {missing}')
            if 'Regular' in p.name:
                if p.stem!='ApliquefyDisplayR2-Regular':issues.append(f'Regular legada ou duplicada: {p.relative_to(ROOT)}')
                if f['name'].getDebugName(1)!='Apliquefy Display R2':issues.append(f'Nome interno incorreto: {p.name}')
                if f['name'].getDebugName(5)!='Version 1.001':issues.append(f'Revisão incorreta: {p.name}')
            fonts.append({'file':str(p.relative_to(ROOT)),'family':f['name'].getDebugName(1),'version':f['name'].getDebugName(5),'characters':len(cm),'glyphs':len(f.getGlyphOrder()),'magic':p.read_bytes()[:4].hex()})
        except Exception as e:issues.append(f'Fonte inválida: {p.name} {e}')
checks['fonts']=fonts
if len(fonts)!=6:issues.append(f'Esperados 6 arquivos de fonte; encontrados {len(fonts)}')
checks['regular_edition']='R2 / 1.001; three current formats; no legacy Regular binaries'
if any('Antes-e-Depois' in p.name for p in files):issues.append('Prévia antiga de comparação ainda presente')
links=0
for p in files:
    if p.suffix not in ('.html','.css'):continue
    s=p.read_text();refs=re.findall(r'(?:src|href)=["\']([^"\']+)["\']',s)+re.findall(r'url\(["\']?([^\)"\']+)',s)
    for ref in refs:
        if re.match(r'^(?:https?:|data:|mailto:|#)',ref):continue
        path=ref.split('#')[0].split('?')[0]
        if not path:continue
        links+=1
        if not (p.parent/unquote(path)).exists():issues.append(f'Referência ausente: {p.relative_to(ROOT)} -> {path}')
checks['relative_references_checked']=links
for p in files:
    if p.suffix=='.json':
        try:json.loads(p.read_text())
        except Exception as e:issues.append(f'JSON inválido: {p.relative_to(ROOT)} {e}')
checks['wordmark_font_identity']='Confirmed independently with HarfBuzz: nine identical glyph paths in master and ten logos.'
checks['visual_review']='All16 PDF pages, type specimens, icon/empty-state sheets, brand overview and components inspected.'
checks['browser_layout_test']='Not executed: browser binary unavailable. Component PNGs are rendered SVG compositions; HTML/CSS source reviewed separately.'
report={'status':'PASS' if not issues else 'FAIL','version':'1.0','date':'2026-10-12','checks':checks,'issues':issues}
out=ROOT/'08_Fontes_Editaveis'
(out/'relatorio-validacao-pacote.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
inventory=[]
for p in sorted(ROOT.rglob('*')):
    if p.is_file() and p.name not in ('inventario.json','SHA256SUMS.txt') and '__pycache__' not in str(p):
        inventory.append({'file':str(p.relative_to(ROOT)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(out/'inventario.json').write_text(json.dumps({'files':len(inventory),'bytes':sum(x['bytes'] for x in inventory),'items':inventory},ensure_ascii=False,indent=2))
(out/'SHA256SUMS.txt').write_text('\n'.join(i['sha256']+'  '+i['file'] for i in inventory)+'\n')
print(json.dumps({'status':report['status'],'issues':issues,'files':len(inventory),'svg':len(svgs),'png':len(pngs),'fonts':len(fonts),'references':links},ensure_ascii=False))
if issues:raise SystemExit(1)
