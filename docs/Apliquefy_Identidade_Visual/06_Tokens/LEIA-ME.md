# Tokens Apliquefy

`tokens.css` é o contrato CSS usado pelos componentes. `design-tokens.json` contém cores, medidas, tipografia, semântica e notas de uso em uma estrutura JSON de tokens legível, sem declaração de conformidade a schema externo. A seção `metadata` e as descrições de uso são documentação; adapte a estrutura ao pipeline da equipe.

## Hierarquia

- Base: grafite #14121C, branco #FFFFFF, superfície #F6F4FA.
- Ação: roxo #7A3BFF; hover #6527DC; pressionado #5420BF.
- Acentos: laranja #FF7A00 e verde #22D36A.
- Semântica: tons escuros próprios para sucesso, atenção, erro e informação; sempre com texto/ícone.
- Espaços: 4, 8, 12, 16, 24, 32, 48, 64 e 96 px.
- Raios: 6 px em etiquetas, 10 px em controles, 16 px em cartões.
- Controles: 44 px padrão; 36 px apenas variante compacta.
- Corpo: 14/16 px, entrelinha 1.5; títulos Display 28/36/48 px, entrelinha 1.12.

O gradiente documentado é uma referência de cor. Use a geometria e os stops do SVG oficial do símbolo ao reproduzir a assinatura, pois o arquivo mestre tem precedência sobre interpretações em CSS.
