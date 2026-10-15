APLIQUEFY | FONTE DO GUIA PDF

Arquivo principal: build_guide.py
Saída: ../Apliquefy_Guia_de_Identidade_v1.0.pdf

O gerador lê os ativos reais nas pastas 01_Logos, 02_Simbolo_Produto,
03_Tipografia e 04_Icones. Preserve a estrutura do pacote para regenerar.

Requisitos:
- Python 3.10 ou posterior
- reportlab, PyMuPDF e fonttools
- DejaVuSans.ttf, DejaVuSans-Bold.ttf e DejaVuSansMono.ttf para o texto editorial

A família DejaVu é usada somente no texto editorial deste manual.
A identidade utiliza a Apliquefy Display original fornecida no pacote.
A Regular usa ApliquefyDisplayR2-Regular.ttf (R2, revisão 1.001); a Bold
usa ApliquefyDisplay-Bold.ttf e mantém o desenho original.
O PDF final incorpora os subconjuntos necessários para leitura independente.

Instalação de dependências Python:
  python -m pip install reportlab PyMuPDF fonttools

Execução:
  python build_guide.py

Se DejaVu não estiver em /usr/share/fonts/truetype/dejavu, defina a variável
APLIQUEFY_GUIDE_TEXT_FONT_DIR com o caminho da pasta que contém os três TTFs.

O código desenha caminhos SVG e gradientes axiais diretamente no PDF.
Não substitua essa etapa por conversões que removam gradientes ou usem
fontes semelhantes no lugar dos contornos originais da assinatura.

Após alterações, renderize todas as páginas e revise proporções, acentos,
quebras de linha, legibilidade e cores antes de redistribuir o manual.
