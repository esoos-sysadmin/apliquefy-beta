# Spec — Celular com nuvem em primeiro lugar + filtros da campanha "Sites de empresas"

**Data:** 2026-11-22 · **Branch:** `feature/descoberta-nuvem-mobile` · **Base:** `docs/impl-sdd-nuvem.md` (§6.4, §7.3)

## A. Experiência no celular (só front)

**Alvo:** 360×800 (Chrome DevTools), sem rolagem horizontal, toque ≥ 44 px, nada "apertado".

### A1. Detecção de celular
- Hook `useIsMobile()` com `matchMedia("(max-width: 767px), (pointer: coarse)")`, atualiza em `change`.
- Antes de montar devolve `null`: renderiza como desktop (sem flash de bloqueio errado).
- É **UX, não regra de negócio**: o backend continua aceitando LinkedIn/InfoJobs (o usuário pode criar pelo celular e ativar no PC). Sem checagem de user-agent no servidor.

### A2. `/campanhas/nova` no celular
- O card **"Sites de empresas" vem primeiro** e já selecionado.
- LinkedIn e InfoJobs: cinza (`opacity`/`grayscale`), `aria-disabled`, sem seleção ao toque.
- Alerta informativo (não erro) acima dos cards:
  > **Você está no celular.** Daqui, suas candidaturas vão pela nuvem, em formulários abertos nos sites das empresas (Greenhouse, Lever, Ashby…). Para candidatar pelo LinkedIn ou InfoJobs, use o app no computador. **[Baixar o app desktop →]** (`/desktop`)
- Desktop: comportamento atual inalterado.

### A3. Revisão geral a 360 px
Páginas: `/campanhas`, `/campanhas/nova` (os 3 formulários), `/relatorios`, `/curriculos`, `/curriculos/novo`, `/candidaturas/[id]/concluir`, `/conta`, `/assinatura`, sidebar/gaveta, `NeedsUserBanner`.
Corrigir: paddings/gaps excessivos, grids que não colapsam, botões lado a lado que deveriam empilhar, textos cortados, modais maiores que a tela, inputs < 44 px.
Também: a opção **"Nuvem"** no filtro de plataforma de `/campanhas` (pendência anterior).

## B. Filtros da campanha "Sites de empresas"

### B1. Contrato (fonte da verdade)
`campaign_ats` — substitui `remote_only`:

| Coluna | Tipo | Vazio = | Valores |
|---|---|---|---|
| `work_models` | `text[]` | todos | `remote`, `hybrid`, `onsite` |
| `seniorities` | `text[]` | todas | `intern`, `junior`, `mid`, `senior`, `lead` |
| `exclude_terms` | `text[]` | nenhum | palavras/expressões; vaga cujo título contém alguma é descartada |

Migração: `remote_only = true` → `work_models = {remote}`; depois `DROP remote_only`.

`job_postings` ganha `workplace_type varchar NULL` (`remote` | `hybrid` | `onsite` | NULL = não informado).

API (`POST /api/campaigns/ats`, update e `GET /api/internal/campaigns/active` → `config`): `workModels`, `seniorities`, `excludeTerms` (arrays, camelCase); `remoteOnly` sai.
Posting input (`POST /api/internal/postings/upsert`): `workplaceType` opcional.

### B2. Regras de matching (worker)
- **Modelo de trabalho:** `workplace_type` da vaga; se NULL, inferir do `location`/título (`remot` → remote; `hybrid|híbrid` → hybrid). Ainda desconhecido → conta como `onsite` **ou** `hybrid` (passa se o usuário marcou algum dos dois). `remote` continua exigindo remoto acessível do Brasil (`_remote_reachable`).
- **Local:** `locationTerm` só vale para presencial/híbrido; vaga remota acessível ignora o local (como hoje).
- **Senioridade:** inferida do **título** (pt/en/es): intern = estágio/estagiário/intern/trainee/aprendiz; junior = júnior/jr/junior/entry; mid = pleno/pl/mid/ii; senior = sênior/sr/senior/iii; lead = staff/principal/lead/líder/especialista/specialist/tech lead/manager/gerente/head/coordenador. Título sem marcador = **desconhecida → passa** (a maioria não tem).
- **Excluir termos:** comparação por palavras normalizadas (sem acento, minúsculas), igual a `title_matches`.

### B3. Descoberta
Preencher `workplaceType`: Lever `workplaceType` (remote/hybrid/onsite; `unspecified` → NULL); Ashby `workplaceType` (`Remote`/`Hybrid`/`OnSite`) com fallback em `isRemote`; Greenhouse e Apify: inferência pelo texto do local (mesma regra de B2), senão NULL.

### B4. Tela (`AtsParametersForm`)
- "Modelo de trabalho": chips multi-seleção Remoto · Híbrido · Presencial (substitui o checkbox "só remoto").
- "Senioridade": chips Estágio · Júnior · Pleno · Sênior · Especialista/Liderança.
- "Excluir vagas com": `TagInput` (ex.: "vendas", "PJ").
- Nenhum chip marcado = todos (dizer isso em texto pequeno). Mesmo padrão visual dos chips de ATS.

## Fora de escopo
Tipo de contrato (CLT/PJ), faixa salarial, idioma da vaga, filtro por empresa — dados não vêm de forma confiável dos 3 ATS. Respostas padrão (CPF etc.) têm spec própria.

## Aceite
- 360×800: `/campanhas/nova` mostra nuvem primeiro, os outros em cinza e o alerta com link; nenhuma página da lista A3 rola na horizontal.
- Criar campanha com `workModels=[remote,hybrid]`, `seniorities=[senior]`, `excludeTerms=[vendas]` persiste e volta igual em `/internal/campaigns/active`.
- Testes do robots cobrindo inferência de senioridade e modelo, e as 3 regras de B2.
- `npm run check-types`, `cloud-queue.test.ts` (Postgres descartável) e pytest verdes.
