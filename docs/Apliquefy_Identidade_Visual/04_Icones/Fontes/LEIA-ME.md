# Reconstrução dos ícones

O código nesta pasta contém a geometria original dos 57 ícones e das quatro ilustrações. É portátil: não depende de caminhos deste ambiente.

## Dependências

- Python 3.9 ou superior; apenas biblioteca padrão.
- Node.js compatível com Sharp; Node.js 22 ou superior recomendado.
- `sharp` 0.35.4. O Sharp usa librsvg para renderizar os SVGs.
- A fonte DejaVu Sans ou equivalente sans-serif só é usada nas legendas das pranchas. Os ícones e as ilustrações não dependem de fontes.

## Reconstruir no pacote

Abra o terminal nesta pasta e execute:

```sh
npm install --no-save sharp@0.35.4
python3 build_icons.py
node render_icons.cjs
```

O primeiro comando de geração escreve SVGs, manifesto, sprite e arquivos de prévia na pasta `04_Icones`, um nível acima. O segundo exporta os PNGs para as pastas já criadas.

## Reconstruir em outro destino

```sh
python3 build_icons.py --output /caminho/destino
node render_icons.cjs /caminho/destino
```

O destino pode ser absoluto ou relativo. Os arquivos de mesmo nome serão substituídos. A geração nunca acessa a rede; somente a instalação do Sharp exige obtenção da dependência.

Os PNGs de produção são RGBA: 24/48/96 px para ícones e 540 × 480 px para ilustrações. O script de rasterização mantém a transparência dos SVGs.
