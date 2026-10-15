# Componentes Apliquefy

Abra `catalogo.html` diretamente no navegador. Não exige servidor, conta, compilação ou internet. `aplicacao.html` demonstra os mesmos componentes em desktop e celular. Preserve a estrutura de pastas para carregar os tokens, a fonte e as assinaturas.

## Conteúdo

- Botões: principal, secundário, discreto e destrutivo; hover, foco, pressionado, desabilitado e carregando.
- Campos de texto, busca, seleção; mensagens de ajuda, erro, foco e estado bloqueado.
- Checkbox, radio, switch, chips de seleção e formulário com validação demonstrativa.
- Cartões de vaga, favoritos, acompanhamento de candidaturas e etapas.
- Status, alertas, toast, estado vazio e skeleton de carregamento.
- Abas, paginação, avatar, tooltip, disclosure e navegação responsiva.
- Exports SVG editáveis e PNG em 1x / 2x; composições vetoriais da aplicação em desktop e celular.

## Interações implementadas

Favoritar vagas, mudar preferências, alternar switches, validar formulário, navegar entre abas usando teclado, mudar página ilustrativa, abrir menu móvel, pausar/retomar o estado do exemplo e fechar mensagens. Todos os dados são fictícios. Nada é enviado ou persistido. A interface não está conectada a serviços externos.

## Integração

`components.css` importa `../06_Tokens/tokens.css`; classes são independentes de frameworks. A família CSS `Apliquefy Display` carrega a Regular R2 (400) e a Bold original (700), ambas locais. A fonte Display é restrita a títulos e marca; os textos funcionais usam a pilha `Inter, system-ui, -apple-system, Segoe UI, sans-serif`, com fallback local. Inter não é redistribuída neste pacote.

As prévias `composicao-desktop` e `composicao-mobile` são composições vetoriais da identidade aplicada, não capturas de navegador. O catálogo HTML é uma implementação separada dos mesmos componentes.

Os SVG de componentes mantêm texto editável em fonte de sistema, sem imagens incorporadas. São modelos de construção, não componentes de software executáveis. Os PNG têm o mesmo enquadramento dos SVG.

## Acessibilidade e limites

Controles usam rótulos associados, foco visível, nome acessível e mensagens que não dependem só de cor. Abas implementam setas, Home e End. Movimento é reduzido conforme a preferência do sistema. Área padrão dos controles: 44 px. O arquivo demonstra boas práticas e deve passar pela revisão de acessibilidade do produto integrado, com leitores de tela e conteúdo real.

Roxo de ação: #7A3BFF, hover #6527DC, pressionado/foco #5420BF. Sucesso usa #08773A sobre #EAF8EF; atenção #A64500 sobre #FFF2E6; erro #B42318 sobre #FFF0EE. Laranja e verde vivos são acentos, não fundos de texto branco.
