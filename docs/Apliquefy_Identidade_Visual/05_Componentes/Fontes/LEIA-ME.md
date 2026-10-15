# Fontes dos componentes e prévias

Os arquivos nesta pasta regeneram HTML, CSS, JavaScript, tokens, componentes vetoriais e composições da aplicação. Caminhos são resolvidos a partir desta pasta; mantenha a organização do pacote.

## Dependências

Python 3.10 ou superior, `fonttools` e `Pillow` (requirements.txt); Node.js 20 ou superior e `sharp` (package.json). Instale dependências no seu ambiente de desenvolvimento. A instalação pode exigir internet; a geração usa apenas arquivos locais.

## Ordem de geração

Execute a partir desta pasta, depois de gerar os arquivos de logo, fonte e ícones nas respectivas pastas do pacote:

```sh
python build_components.py
python export_components.py
python application_compositions.py
node render_static.js
node --check ../components.js
python validate_static.py
```

- `build_components.py`: catálogo HTML, aplicação HTML, CSS, JS e tokens.
- `export_components.py`: 18 componentes SVG nativos e manifesto de exports.
- `application_compositions.py`: composições desktop/mobile em SVG, com títulos convertidos em curvas a partir da fonte Regular R2 incluída (`03_Tipografia/TTF/ApliquefyDisplayR2-Regular.ttf`).
- `render_static.js`: PNG 1x/2x e pranchas a partir dos SVG.
- `validate_static.py`: referências, IDs, rótulos, sintaxe XML, arquivos PNG e tokens.

A execução regrava os arquivos derivados: edite os geradores para conservar alterações futuras. Os SVG de componentes também são editáveis diretamente, mas alterações diretas serão substituídas ao regenerar.

As composições são provas visuais vetoriais, não capturas de navegador. O catálogo implementa comportamentos demonstrativos locais e não envia dados. A validação estática não substitui a revisão do produto integrado em navegador e com tecnologias assistivas.
