# Handoff — develop

> Atualizado em 2026-08-01 20:24 · base `origin/main` · último commit `92e1089 design: mudado a cor da página`

## O que foi alterado

A mudança é puramente visual e centraliza o fundo da aplicação num único lugar: o `body`. Antes, cada layout e várias páginas pintavam o próprio fundo com a cor sólida `#0B111A` (auth, dashboard, landing, planos, obrigado, termos, política de privacidade). Agora o `globals.css` define uma variável `--app-canvas` com um canvas em camadas — dois halos radiais de baixa opacidade (um quente/pêssego no canto superior direito, um violeta no canto inferior esquerdo) sobre um gradiente linear grafite de `#141824` → `#0e1119` → `#0a0c12` — aplicado como `background-image` no `body` com `background-attachment: fixed`, de modo que o degradê acompanhe o viewport e não se repita nem "role" com o conteúdo. A base grafite substitui o antigo azul `#0B111A` e foi escolhida para não competir com os cards navy (`#111827`) nem com o accent azul dos botões.

Como consequência, todos os containers que antes pintavam fundo próprio tiveram essa pintura removida (ou trocada por `transparent` nos layouts que usam inline style), deixando o canvas do `body` aparecer através deles. Também foi removido o bloco `@media (prefers-color-scheme: dark)` do `globals.css`: as variáveis `--background`/`--foreground` passam a ser fixas em tema escuro (`#0e1119` / `#ededed`), ou seja, a aplicação não responde mais à preferência de tema do sistema — é dark-only por definição.

A Sidebar mudou de tratamento e de dimensão: passou de fundo sólido `#0B111A` com borda `#1C2333` para um gradiente vertical `#161b28` → `#11151f` (mesma família dos cards, meio tom acima do canvas) e borda translúcida `rgba(255,255,255,0.06)`, para que o menu leia como superfície da própria app e não como um painel colado por cima. A largura subiu de 220px para 264px, com o `marginLeft` do `<main>` do layout de dashboard ajustado no mesmo valor para acompanhar.

## Arquivos modificados

- `apps/web/app/globals.css` — `--background`/`--foreground` fixados em tema escuro (`#0e1119`/`#ededed`), removido o bloco `@media (prefers-color-scheme: dark)`, adicionada a variável `--app-canvas` (dois `radial-gradient` + um `linear-gradient`) e aplicada no `body` via `background-image` + `background-color` + `background-attachment: fixed`.
- `apps/web/app/components/organisms/Sidebar.tsx` — largura de 220 → 264px, fundo sólido `#0B111A` trocado por `linear-gradient(180deg, #161b28, #11151f)` e borda direita de `#1C2333` para `rgba(255,255,255,0.06)`; comentário explicando a escolha de tom.
- `apps/web/app/(frontend)/layout.tsx` — `background` do wrapper de `#0B111A` para `transparent` e `marginLeft` do `<main>` de 220 → 264px, acompanhando a nova largura da Sidebar.
- `apps/web/app/(landing)/layout.tsx` — `background` do wrapper de `#0B111A` para `transparent`.
- `apps/web/app/(auth)/layout.tsx` — removida a classe `bg-[#0B111A]` do `<main>`.
- `apps/web/app/(landing)/planos/page.tsx` — removida a classe `bg-[#0B111A]` do container.
- `apps/web/app/(landing)/obrigado/page.tsx` — removida a classe `bg-[#0B111A]` do container.
- `apps/web/app/(landing)/termos-de-servico/page.tsx` — removida a classe `bg-[#0B111A]` do container.
- `apps/web/app/(landing)/politica-de-privacidade/page.tsx` — removida a classe `bg-[#0B111A]` do container.

## Pontos de atenção e próximos passos

- `background-attachment: fixed` tem custo de repaint em scroll em alguns navegadores mobile (e é ignorado/tratado de forma inconsistente no iOS Safari, onde pode virar `scroll` ou esticar demais o gradiente). Vale validar em iOS antes de considerar fechado; alternativa é um pseudo-elemento `position: fixed; inset: 0; z-index: -1`.
- A variável `--background` continua declarada e usada como `background-color` de fallback, mas na prática o `--app-canvas` cobre tudo. Não é bug, só código com dois donos da mesma responsabilidade.
- A largura da Sidebar está duplicada em dois arquivos (264 no `Sidebar.tsx`, 264 no `marginLeft` do layout de dashboard). Se mudar de novo, precisa mudar nos dois — candidato a virar uma constante ou CSS var.
- Ainda podem existir outros pontos do app com `bg-[#0B111A]` hardcoded fora do escopo deste diff (o desktop, por exemplo, não foi tocado). Vale um grep pelo token antes de dar o tema por concluído.
- Perda funcional deliberada: sem `prefers-color-scheme`, quem usa o SO em light mode continua vendo a interface escura. Se tema claro estiver no roadmap, essa remoção precisa ser revertida com as variáveis reorganizadas.
