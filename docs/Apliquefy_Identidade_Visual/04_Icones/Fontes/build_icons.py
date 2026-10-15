from pathlib import Path
import argparse, json, html
from xml.etree import ElementTree as ET

parser = argparse.ArgumentParser(description='Build original Apliquefy vector icons and manifests.')
parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parent.parent,
                    help='Output folder. Default: the parent of this Fontes folder.')
ROOT = parser.parse_args().output.resolve()
ROOT.mkdir(parents=True, exist_ok=True)
for p in ['SVG','PNG/24px','PNG/48px','PNG/96px','Estados/SVG','Estados/PNG','Previa']:
    (ROOT/p).mkdir(parents=True,exist_ok=True)

# Original Apliquefy icon geometry. All units are expressed on a 24 × 24 grid.
# The useful area usually runs from 3 to 21, with optical exceptions for points.
ICONS = [
('home','Início','Navegação','<path d="M3.5 10.5 12 3.7l8.5 6.8M5.5 9.2v10.1a1 1 0 0 0 1 1h3.3v-6.2h4.4v6.2h3.3a1 1 0 0 0 1-1V9.2"/>'),
('search','Buscar','Navegação','<circle cx="10.5" cy="10.5" r="6.4"/><path d="m15.1 15.1 5.1 5.1"/>'),
('work','Vagas','Trabalho','<rect x="3.4" y="7.8" width="17.2" height="12.3" rx="2.2"/><path d="M8.2 7.8V5.6a1.7 1.7 0 0 1 1.7-1.7h4.2a1.7 1.7 0 0 1 1.7 1.7v2.2M3.6 12.1a24 24 0 0 0 16.8 0M12 12.3v2.8"/>'),
('profile','Perfil','Conta','<circle cx="12" cy="7.9" r="3.7"/><path d="M4.3 20c.6-4.1 3.2-6.1 7.7-6.1s7.1 2 7.7 6.1"/>'),
('resume','Currículo','Trabalho','<path d="M14.2 3.5H6.4a1.6 1.6 0 0 0-1.6 1.6v13.8a1.6 1.6 0 0 0 1.6 1.6h11.2a1.6 1.6 0 0 0 1.6-1.6V8.5zM14.2 3.5v5h5M8.5 11.4h3.2M8.5 15h7"/>'),
('education','Formação','Trabalho','<path d="m2.7 8.5 9.3-4.4 9.3 4.4-9.3 4.4zM6.6 10.5v5.1c3.3 2.5 7.5 2.5 10.8 0v-5.1M21.3 8.5v7"/>'),
('experience','Experiência','Trabalho','<rect x="5" y="3.8" width="14" height="14.4" rx="2.4"/><path d="M8.4 18.2v2.3L12 19l3.6 1.5v-2.3M8.7 8.2h6.6M8.7 11.9h4.5"/>'),
('location','Localização','Preferências','<path d="M18.4 10.1c0 4.6-6.4 10.5-6.4 10.5S5.6 14.7 5.6 10.1a6.4 6.4 0 1 1 12.8 0Z"/><circle cx="12" cy="10" r="2.2"/>'),
('clock','Horário','Preferências','<circle cx="12" cy="12" r="8.5"/><path d="M12 6.9v5.5l3.4 2"/>'),
('salary','Remuneração','Preferências','<path d="M19 7V5.1a1.3 1.3 0 0 0-1.6-1.3L5.3 6.3a2.2 2.2 0 0 0-1.8 2.2v9.3a2.2 2.2 0 0 0 2.2 2.2h13a1.8 1.8 0 0 0 1.8-1.8V8.8A1.8 1.8 0 0 0 18.7 7H5.1M20.5 11.3h-4.1a2.3 2.3 0 0 0 0 4.6h4.1"/><circle cx="16.6" cy="13.6" r=".7" fill="currentColor" stroke="none"/>'),
('filter','Filtros','Preferências','<path d="M3.6 4.5h16.8l-6.2 7.9v6.4l-4.4 1.4v-7.8z"/>'),
('automation','Automação','Candidaturas','<path d="M4.1 9.1a8.3 8.3 0 0 1 13.7-3.5L20 7.8M20 3.8v4h-4M19.9 14.9a8.3 8.3 0 0 1-13.7 3.5L4 16.2M4 20.2v-4h4M12.8 7.3 9.3 12h4.9l-3 4.7"/>'),
('preferences','Preferências','Preferências','<path d="M4 6.5h7M15 6.5h5M4 12h3M11 12h9M4 17.5h10M18 17.5h2"/><circle cx="13" cy="6.5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="16" cy="17.5" r="2"/>'),
('send','Enviar candidatura','Candidaturas','<path d="m3.5 10.5 17-7-7 17-2.2-7.8zM11.3 12.7l4.3-4.3"/>'),
('applications','Candidaturas','Candidaturas','<rect x="3.8" y="3.8" width="16.4" height="16.4" rx="2.6"/><path d="M10.1 8h6.2M10.1 12h6.2M10.1 16h4.2"/><path d="M7.2 8h.1M7.2 12h.1M7.2 16h.1" stroke-width="2.2"/>'),
('interview','Conversa','Candidaturas','<path d="M19.9 12.2a6.7 6.7 0 0 1-6.7 6.7H9l-5.1 2v-5.1a6.7 6.7 0 0 1-1.1-3.6V10a6.7 6.7 0 0 1 6.7-6.7h3.7a6.7 6.7 0 0 1 6.7 6.7zM7.2 8.9h8.3M7.2 12.6h5.6"/>'),
('calendar','Calendário','Candidaturas','<rect x="3.8" y="5.6" width="16.4" height="14.8" rx="2.1"/><path d="M7.8 3.6v4M16.2 3.6v4M3.8 10h16.4M7.9 14h.1M12 14h.1M16.1 14h.1M7.9 17.1h.1M12 17.1h.1"/>'),
('notification','Notificações','Conta','<path d="M19.3 16.8H4.7c1.5-1.5 1.7-3.4 1.7-6.1a5.6 5.6 0 0 1 11.2 0c0 2.7.2 4.6 1.7 6.1ZM9.8 20h4.4M12 3v2.1"/>'),
('pause','Pausar','Controle','<rect x="6" y="4" width="3.6" height="16" rx="1.2"/><rect x="14.4" y="4" width="3.6" height="16" rx="1.2"/>'),
('play','Iniciar','Controle','<path d="M7 4.8a.8.8 0 0 1 1.2-.7l11.2 7.2a.8.8 0 0 1 0 1.4L8.2 19.9a.8.8 0 0 1-1.2-.7z"/>'),
('stop','Encerrar','Controle','<rect x="5.2" y="5.2" width="13.6" height="13.6" rx="2"/>'),
('check','Confirmar','Estados','<path d="m4.6 12.1 4.7 4.7 10.1-9.6"/>'),
('check-circle','Concluído','Estados','<circle cx="12" cy="12" r="8.5"/><path d="m7.8 12.1 2.7 2.8 5.8-5.6"/>'),
('error','Erro','Estados','<circle cx="12" cy="12" r="8.5"/><path d="m9.1 9.1 5.8 5.8M14.9 9.1l-5.8 5.8"/>'),
('warning','Atenção','Estados','<path d="M10.6 4.5a1.6 1.6 0 0 1 2.8 0l7.2 12.9a1.6 1.6 0 0 1-1.4 2.4H4.8a1.6 1.6 0 0 1-1.4-2.4zM12 9.1v4.6M12 16.8v.1"/>'),
('info','Informação','Estados','<circle cx="12" cy="12" r="8.5"/><path d="M12 10.8v6M12 7.2v.1"/>'),
('lock','Privacidade','Conta','<rect x="5" y="10.3" width="14" height="10.1" rx="2"/><path d="M8 10.3V7.6a4 4 0 0 1 8 0v2.7M12 14.2v2.4"/>'),
('globe','Idioma','Conta','<circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="3.5" ry="8.5"/><path d="M3.9 9.1h16.2M3.9 14.9h16.2"/>'),
('upload','Importar','Arquivos','<path d="M12 15V3.8m-4.1 4.1L12 3.8l4.1 4.1M4 14.2V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3.8"/>'),
('download','Baixar','Arquivos','<path d="M12 3.8V15m-4.1-4.1L12 15l4.1-4.1M4 14.2V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3.8"/>'),
('chevron-left','Voltar','Navegação','<path d="m14.8 5.8-6.2 6.2 6.2 6.2"/>'),
('chevron-right','Avançar','Navegação','<path d="m9.2 5.8 6.2 6.2-6.2 6.2"/>'),
('chevron-up','Recolher','Navegação','<path d="m5.8 14.8 6.2-6.2 6.2 6.2"/>'),
('chevron-down','Expandir','Navegação','<path d="m5.8 9.2 6.2 6.2 6.2-6.2"/>'),
('external-link','Abrir em outro site','Navegação','<path d="M10 4.2H6.2a2 2 0 0 0-2 2v11.6a2 2 0 0 0 2 2h11.6a2 2 0 0 0 2-2V14M13.5 4.2h6.3v6.3M11 13l8.8-8.8"/>'),
('help','Ajuda','Conta','<circle cx="12" cy="12" r="8.5"/><path d="M9.1 8.7a2.9 2.9 0 0 1 5.7.8c0 1.8-2.8 2.1-2.8 4M12 16.9v.1"/>'),
('settings','Configurações','Conta','<path d="m10.1 3.6-.6 2.1-1.8 1-2.1-.5-1.9 3.3 1.5 1.6v1.8l-1.5 1.6 1.9 3.3 2.1-.5 1.8 1 .6 2.1h3.8l.6-2.1 1.8-1 2.1.5 1.9-3.3-1.5-1.6v-1.8l1.5-1.6-1.9-3.3-2.1.5-1.8-1-.6-2.1z"/><circle cx="12" cy="12" r="3.1"/>'),
('logout','Sair','Conta','<path d="M10.1 3.8H5.8a1.8 1.8 0 0 0-1.8 1.8v12.8a1.8 1.8 0 0 0 1.8 1.8h4.3M10.2 12h10m-3.8-3.8 3.8 3.8-3.8 3.8"/>'),
('retail','Comércio','Áreas de atuação','<path d="M5.7 4h12.6l2.1 5.4H3.6zM3.6 9.4v1a2.1 2.1 0 0 0 4.2 0 2.1 2.1 0 0 0 4.2 0 2.1 2.1 0 0 0 4.2 0 2.1 2.1 0 0 0 4.2 0v-1M5 12.4v7.7h14v-7.7M9.6 20.1v-5.2h4.8v5.2"/>'),
('health','Saúde e farmácia','Áreas de atuação','<path d="M9.1 3.8h5.8v5.3h5.3v5.8h-5.3v5.3H9.1v-5.3H3.8V9.1h5.3z"/>'),
('office','Escritório','Áreas de atuação','<path d="M5.2 20.3V3.7h13.6v16.6M3.3 20.3h17.4M9.7 20.3v-4.5h4.6v4.5M9 7.7h.1M14.9 7.7h.1M9 11.6h.1M14.9 11.6h.1" stroke-linejoin="round"/>'),
('arrow-right','Continuar','Navegação','<path d="M3.8 12h16.4m-6-6 6 6-6 6"/>'),
('arrow-left','Retornar','Navegação','<path d="M20.2 12H3.8m6-6-6 6 6 6"/>'),
('plus','Adicionar','Ações','<path d="M12 4.6v14.8M4.6 12h14.8"/>'),
('minus','Diminuir','Ações','<path d="M4.6 12h14.8"/>'),
('close','Fechar','Ações','<path d="m5.8 5.8 12.4 12.4M18.2 5.8 5.8 18.2"/>'),
('eye','Mostrar','Conta','<path d="M2.8 12s3.2-6.1 9.2-6.1 9.2 6.1 9.2 6.1-3.2 6.1-9.2 6.1S2.8 12 2.8 12Z"/><circle cx="12" cy="12" r="2.7"/>'),
('eye-off','Ocultar','Conta','<path d="m3.8 3.8 16.4 16.4M8.3 6.8C5.1 8.4 2.8 12 2.8 12s3.2 6.1 9.2 6.1c1.4 0 2.8-.4 4-1M12.1 5.9c6 0 9.1 6.1 9.1 6.1s-.8 1.5-2.5 3.1M9.6 10.8a2.7 2.7 0 0 0 3.6 3.6"/>'),
('bookmark','Salvar vaga','Trabalho','<path d="M6.1 20.4V5.6A1.8 1.8 0 0 1 7.9 3.8h8.2a1.8 1.8 0 0 1 1.8 1.8v14.8L12 16.9z"/>'),
('email','E-mail','Contato','<rect x="3.2" y="5.5" width="17.6" height="13" rx="2"/><path d="m4 6.4 8 6.1 8-6.1"/>'),
('phone','Telefone','Contato','<path d="m8.4 3.8 2 4.5-2.5 2.1a14.7 14.7 0 0 0 5.7 5.7l2.1-2.5 4.5 2c.3 2.8-1 4.8-3.7 4.6C10 19.7 4.3 14 3.8 7.5c-.2-2.7 1.8-4 4.6-3.7Z"/>'),
('link','Link','Ações','<path d="m9.3 14.7 5.4-5.4M8.7 8.6l3.4-3.4a4.4 4.4 0 0 1 6.2 6.2l-2.8 2.8M15.3 15.4l-3.4 3.4a4.4 4.4 0 0 1-6.2-6.2l2.8-2.8"/>'),
('trash','Excluir','Ações','<path d="M3.8 6.7h16.4M8.5 6.7V4h7v2.7M6.1 6.7l.8 12a1.6 1.6 0 0 0 1.6 1.5h7a1.6 1.6 0 0 0 1.6-1.5l.8-12M10.1 10.4v6M13.9 10.4v6"/>'),
('edit','Editar','Ações','<path d="m4 15.7 11.4-11.4a1.8 1.8 0 0 1 2.5 0l1.8 1.8a1.8 1.8 0 0 1 0 2.5L8.3 20l-4.7.4zM13.5 6.2l4.3 4.3M4 15.7 8.3 20"/>'),
('refresh','Atualizar','Ações','<path d="M4.1 9.1a8.3 8.3 0 0 1 13.7-3.5L20 7.8M20 3.8v4h-4M19.9 14.9a8.3 8.3 0 0 1-13.7 3.5L4 16.2M4 20.2v-4h4"/>'),
('menu','Menu','Navegação','<path d="M4 6.5h16M4 12h16M4 17.5h16"/>'),
('loader','Carregando','Estados','<circle cx="12" cy="12" r="8" opacity=".18"/><path d="M12 4a8 8 0 0 1 8 8"/>'),
]

def svg(body, size=24, label=None):
    title=f'<title>{html.escape(label)}</title>' if label else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" color="#14121C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{title}{body}</svg>'

manifest={'name':'Apliquefy Icons','version':'1.0.0','created':'2026-10-12','original_geometry':True,'viewBox':'0 0 24 24','stroke_width':1.8,'linecap':'round','linejoin':'round','color':'currentColor','png_color':'#14121C','png_sizes':[24,48,96],'icons':[]}
for slug,label,category,body in ICONS:
    out=svg(body,label=label)
    ET.fromstring(out)
    (ROOT/'SVG'/f'{slug}.svg').write_text(out)
    manifest['icons'].append({'id':slug,'label_pt_BR':label,'category_pt_BR':category,'svg':f'SVG/{slug}.svg','png':{str(n):f'PNG/{n}px/{slug}.png' for n in [24,48,96]}})

symbols=''.join(f'<symbol id="apliquefy-{s}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{b}</g></symbol>' for s,l,c,b in ICONS)
(ROOT/'apliquefy-icons-sprite.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg">{symbols}</svg>')
(ROOT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')

# A neutral preview deliberately keeps every utility icon at the same weight and colour.
cols=8; cellw=140; cellh=112; w=1200; h=160+((len(ICONS)+cols-1)//cols)*cellh+72
parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" fill="#F6F4FA"/><text x="40" y="53" font-family="DejaVu Sans,sans-serif" font-size="28" font-weight="600" fill="#14121C">Apliquefy / Ícones de produto</text><text x="40" y="83" font-family="DejaVu Sans,sans-serif" font-size="14" fill="#635E70">{len(ICONS)} desenhos originais · grade 24 × 24 · traço 1,8 · uma linguagem para todas as trajetórias</text>']
for i,(slug,label,cat,body) in enumerate(ICONS):
    x=40+(i%cols)*cellw; y=115+(i//cols)*cellh
    parts.append(f'<rect x="{x}" y="{y}" width="128" height="100" rx="12" fill="white"/>')
    parts.append(f'<g transform="translate({x+49},{y+17}) scale(1.25)" fill="none" stroke="#14121C" color="#14121C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{body}</g>')
    parts.append(f'<text x="{x+64}" y="{y+67}" text-anchor="middle" font-family="DejaVu Sans,sans-serif" font-size="10" fill="#14121C">{html.escape(label)}</text><text x="{x+64}" y="{y+84}" text-anchor="middle" font-family="DejaVu Sans,sans-serif" font-size="9" fill="#797381">{slug}</text>')
parts.append(f'<text x="40" y="{h-31}" font-family="DejaVu Sans,sans-serif" font-size="12" fill="#635E70">SVG com currentColor · PNG transparente em 24, 48 e 96 px · sem dependência de fonte</text></svg>')
(ROOT/'Previa'/'apliquefy-icones-prancha.svg').write_text(''.join(parts))

# Empty state illustrations. Each is native editable geometry, with transparent exterior.
states={
'definir-preferencias':('Definir preferências','<rect x="39" y="20" width="102" height="120" rx="17" fill="#FFFFFF" stroke="#D7D1E2"/><path d="M58 47h63M58 74h63M58 101h63" stroke="#14121C"/><circle cx="78" cy="47" r="7" fill="#7A3BFF" stroke="#7A3BFF"/><circle cx="103" cy="74" r="7" fill="#FFFFFF" stroke="#14121C"/><circle cx="89" cy="101" r="7" fill="#FFFFFF" stroke="#14121C"/><circle cx="140" cy="130" r="19" fill="#7A3BFF" stroke="none"/><path d="m132 130 5 5 10-10" stroke="white"/>'),
'buscando-oportunidades':('Buscando oportunidades','<rect x="28" y="35" width="88" height="100" rx="14" fill="#FFFFFF" stroke="#D7D1E2"/><path d="M46 58h43M46 73h34M46 88h27" stroke="#B4ABBF"/><circle cx="114" cy="86" r="26" fill="#FFFFFF" stroke="#7A3BFF" stroke-width="4"/><path d="m133 105 21 21" stroke="#7A3BFF" stroke-width="7"/><path d="M104 86h20M114 76v20" stroke="#14121C"/>'),
'sem-resultados':('Nenhuma correspondência ainda','<rect x="35" y="34" width="110" height="102" rx="14" fill="#FFFFFF" stroke="#D7D1E2"/><path d="M35 61h110" stroke="#D7D1E2"/><circle cx="50" cy="48" r="3" fill="#7A3BFF" stroke="none"/><path d="M62 48h32M60 112h60" stroke="#B4ABBF"/><circle cx="90" cy="86" r="14" fill="#F1EBFF" stroke="none"/><path d="M83 86h14" stroke="#7A3BFF"/>'),
'candidatura-enviada':('Candidatura enviada','<rect x="42" y="20" width="94" height="123" rx="15" fill="#FFFFFF" stroke="#D7D1E2"/><path d="M61 48h55M61 65h43M61 82h31" stroke="#B4ABBF"/><circle cx="131" cy="119" r="26" fill="#7A3BFF" stroke="none"/><path d="m119 119 8 8 17-17" stroke="#FFFFFF" stroke-width="4"/>')
}
for slug,(label,body) in states.items():
    bg='<ellipse cx="90" cy="84" rx="78" ry="69" fill="#F1EBFF"/>'
    s=f'<svg xmlns="http://www.w3.org/2000/svg" width="180" height="160" viewBox="0 0 180 160"><title>{label}</title><g fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{bg}{body}</g></svg>'
    ET.fromstring(s)
    (ROOT/'Estados/SVG'/f'{slug}.svg').write_text(s)

preview=['<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="340" viewBox="0 0 1000 340"><rect width="1000" height="340" fill="#FFFFFF"/><text x="36" y="48" font-family="DejaVu Sans,sans-serif" font-size="23" fill="#14121C">Apliquefy / Estados de produto</text>']
for i,(slug,(label,body)) in enumerate(states.items()):
    preview.append(f'<g transform="translate({36+i*244},95)"><ellipse cx="90" cy="84" rx="78" ry="69" fill="#F1EBFF"/><g fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{body}</g><text x="90" y="190" text-anchor="middle" font-family="DejaVu Sans,sans-serif" font-size="11" fill="#14121C">{label}</text></g>')
preview.append('</svg>')
(ROOT/'Previa'/'apliquefy-estados-prancha.svg').write_text(''.join(preview))

readme='''# Apliquefy Icons — versão 1.0

57 ícones funcionais originais e 4 ilustrações de estados. Desenhados em vetores nativos para uma experiência de candidatura clara, próxima e confiável.

## Construção
- Ícones: grade 24 × 24; espessura 1,8 unidades; terminais e junções arredondados; área útil usual de 3 a 21 unidades.
- Todos os SVGs são geometria real: paths, círculos, retângulos e elipses; sem imagens incorporadas e sem fonte de ícones.
- Os PNGs têm transparência real e cor #14121C, em 24, 48 e 96 px.
- As quatro ilustrações têm viewBox 180 × 160, transparência exterior e PNG 540 × 480.
- Geometria original criada para esta entrega, sem dependência de pacote de ícones de terceiros.

## Uso no produto
Use 24 px como tamanho padrão. O SVG individual usa `currentColor`, com grafite como valor inicial. Para modificar a cor por CSS, insira o SVG diretamente no documento e defina `color` no elemento. Um SVG carregado por `<img>` não herda a cor CSS do documento externo.

O sprite contém os símbolos `apliquefy-{id}`. Exemplo: `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="apliquefy-icons-sprite.svg#apliquefy-search"/></svg>`.

Mantenha o traço uniforme. Não preencha arbitrariamente ícones de linha, não estique, não aplique gradientes aos ícones utilitários. Reserve a expressão do gradiente para a identidade principal.

## Clareza e acessibilidade
O botão com ícone precisa de nome acessível: por exemplo, `aria-label="Pausar candidaturas"`. O título presente no SVG é informativo e não substitui a implementação de acessibilidade do componente. Elementos decorativos devem ser ocultados de tecnologias assistivas. Estados devem ser comunicados com texto além de cor. Não use o ícone de saúde como garantia de certificação médica.

## Organização
- `SVG/`: um arquivo por ícone.
- `PNG/24px`, `PNG/48px`, `PNG/96px`: exportações transparentes.
- `apliquefy-icons-sprite.svg`: sprite reutilizável.
- `manifest.json`: IDs, nomes em português, categorias e caminhos.
- `Estados/`: quatro ilustrações em SVG e PNG.
- `Previa/`: pranchas para inspeção, não usar como sprite ou fonte de recorte.

Nenhuma frase faz parte das ilustrações. A interface deve acrescentar título, explicação e ação adequados ao contexto. “Nenhuma correspondência ainda” pede um caminho para revisar preferências; “Candidatura enviada” só deve aparecer após confirmação real do envio.
'''
(ROOT/'LEIA-ME.md').write_text(readme)
print(f'Wrote {len(ICONS)} icons, 4 states, manifest and previews at {ROOT}')
