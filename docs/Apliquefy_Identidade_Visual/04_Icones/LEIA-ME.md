# Apliquefy Icons — versão 1.0

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
