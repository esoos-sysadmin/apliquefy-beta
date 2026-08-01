#!/usr/bin/env bash
# Gera/atualiza o handoff (.claude/handoff.md) resumindo o estado atual da branch.
# Uso: npm run handoff  [base]        (base padrão: main; ou via env HANDOFF_BASE)
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

OUT=".claude/handoff.md"
BASE="${HANDOFF_BASE:-${1:-main}}"
BRANCH=$(git branch --show-current)
LAST_COMMIT=$(git log -1 --pretty=format:"%h %s")
DATE=$(date +"%Y-%m-%d %H:%M")

# Usa a ref remota se existir, senão a local. '...' compara a partir do merge-base.
if git rev-parse --verify --quiet "origin/$BASE" >/dev/null; then
  REF="origin/$BASE"
else
  REF="$BASE"
fi

DIFF=$(git diff "$REF...HEAD" --text \
  -- . \
  ':(exclude)*.pdf' ':(exclude)*.png' ':(exclude)*.jpg' ':(exclude)*.jpeg' \
  ':(exclude)*.gif' ':(exclude)*.ico' ':(exclude)*-lock.json' ':(exclude)*.lock' \
  2>/dev/null || true)

if [ -z "${DIFF//[$'\t\r\n ']/}" ]; then
  BODY="_Sem diferenças em relação a \`$REF\`._"
elif ! command -v claude >/dev/null 2>&1; then
  echo "handoff: 'claude' não encontrado no PATH; abortando." >&2
  exit 0
else
  BODY=$(printf '%s' "$DIFF" | claude -p "
Você é um assistente de engenharia de software. Analise o diff abaixo e gere um HANDOFF em português — o estado atual do trabalho nesta branch, para quem for continuar.

O documento deve ter estas seções (markdown):

## O que foi alterado
Um a três parágrafos explicando o COMPORTAMENTO e a LÓGICA que mudou (não só o nome dos arquivos): que fluxos surgiram, condições, validações, campos novos, o que passou a aparecer/recolher, o que mudou no payload/PDF/tipos. Explique o 'porquê' e o 'como' de forma que quem não viu o código entenda.

## Arquivos modificados
Uma lista com um item por arquivo alterado. Para CADA arquivo, escreva o caminho seguido de ' — ' e uma frase técnica explicando exatamente o que mudou naquele arquivo (baseado no diff). Não invente arquivos que não estão no diff.

## Pontos de atenção e próximos passos
Decisões, gambiarras, riscos e o que ainda falta (TODO). Omita a seção se não houver nada relevante.

Seja objetivo e técnico. Retorne apenas o corpo em markdown, sem cercar em bloco de código.
")
fi

mkdir -p "$(dirname "$OUT")"
{
  echo "# Handoff — $BRANCH"
  echo
  echo "> Atualizado em $DATE · base \`$REF\` · último commit \`$LAST_COMMIT\`"
  echo
  printf '%s\n' "$BODY"
} > "$OUT"

echo "handoff: $OUT atualizado."
