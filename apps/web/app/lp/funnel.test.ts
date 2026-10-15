/**
 * npx tsx app/lp/funnel.test.ts
 *
 * Os números do laudo vão para a frente de quem está decidindo pagar. Trava: as contas
 * saem só das respostas, o arredondamento nunca adianta prazo e o índice vem dos critérios.
 */
import assert from "node:assert/strict"
import { isUpsellSlug, PLANS, UPSELLS } from "../lib/constants/plans"
import {
    dailyLimitFor,
    destination,
    diagnose,
    formatDuration,
    hoursPerMonth,
    hoursSoFar,
    nextQuizScreen,
    planAppsPerWeek,
    questionsFor,
    REFERENCE_DESTINATION,
    responseRate,
    targetSalary,
    weeksTo,
    type Answers,
} from "./funnel"

const a: Answers = { segment: "varejo", appsPerWeek: 10, minutesPerApp: 15, searchWeeks: 13, responsesLastMonth: 1 }

// 10 × 15 min × 52/12 semanas = 650 min = 10,83 h
assert.equal(hoursPerMonth(a)!.toFixed(2), "10.83")
assert.equal(hoursSoFar(a), 32.5) // 13 sem × 10 × 15 / 60
assert.equal(responseRate(a)!.toFixed(4), (1 / ((10 * 52) / 12)).toFixed(4))
assert.equal(hoursPerMonth({ appsPerWeek: 0 }), null, "sem ritmo, sem número")
assert.equal(responseRate({ responsesLastMonth: 2 }), null, "sem candidatura, sem taxa")

assert.deepEqual(destination(a), { apps: 520, own: true })
assert.deepEqual(destination({ appsPerWeek: 1 }), { apps: REFERENCE_DESTINATION, own: false })

// Planos: créditos/mês viram ritmo semanal; Pro chega antes que Starter
const [starter, pro, ent] = PLANS
assert.ok(weeksTo(520, planAppsPerWeek(pro)) < weeksTo(520, planAppsPerWeek(starter)))
assert.ok(weeksTo(520, planAppsPerWeek(ent)) < 1)
// A velocidade prometida só existe com o limite diário ajustado (padrão 50 não basta no Enterprise)
assert.deepEqual([starter, pro, ent].map(dailyLimitFor), [17, 50, 167])

// Arredonda sempre para cima: nunca promete antes
assert.equal(formatDuration(0.1), "1 dia")
assert.equal(formatDuration(0.45), "4 dias")
assert.equal(formatDuration(1.01), "2 semanas")
assert.equal(formatDuration(52), "1 ano")
assert.equal(formatDuration(Infinity), "não chega")

// Salário-alvo só existe com piso real
assert.equal(targetSalary({ income: 2500, raise: "plus20" }), 3000)
assert.equal(targetSalary({ income: 0.1, raise: "double" }), null)
assert.equal(targetSalary({ income: 5000, raise: "usd" }), null)

// Fluxo: quem envia 0 por semana pula minutos/respostas; varejo não vê inglês; ponte depois da emocional
const ids = (x: Answers) => questionsFor(x).map((q) => q.id)
assert.ok(!ids({ appsPerWeek: 0 }).includes("minutesPerApp"))
assert.ok(ids({ appsPerWeek: 3 }).includes("responsesLastMonth"))
assert.ok(!ids({ segment: "varejo" }).includes("english"))
assert.ok(ids({ segment: "dev" }).includes("english"))
assert.equal(nextQuizScreen({ segment: "dev" }, "feeling"), "bridge")
assert.equal(nextQuizScreen({ segment: "dev" }, "bridge"), "profile")
assert.equal(nextQuizScreen({}, "targetRole"), "analysis")
const n = questionsFor({ segment: "dev", appsPerWeek: 5 }).length
assert.ok(n >= 8 && n <= 15, `quiz com ${n} perguntas`)

// Índice: tudo marcado e volume na meta = 100; nada marcado e zero candidaturas = 0
assert.equal(diagnose({ appsPerWeek: 25, profile: ["role", "results", "updated", "tailored", "linkedin"] }).score, 100)
const empty = diagnose({ appsPerWeek: 0, profile: [] })
assert.equal(empty.score, 0)
assert.deepEqual(
    empty.problems.map((c) => c.id),
    ["volume", "role", "results"],
    "os 3 de maior peso",
)
// 10/semana com cargo e LinkedIn: 20 + 15 de 100
assert.equal(diagnose({ appsPerWeek: 10, profile: ["role", "linkedin"] }).score, 35)

// Upsells: slug vem da URL do checkout; chave herdada do protótipo não pode passar.
assert.ok(isUpsellSlug("cv") && isUpsellSlug("voice"))
assert.ok(!isUpsellSlug("toString") && !isUpsellSlug("__proto__") && !isUpsellSlug("starter"))
assert.deepEqual(
    Object.entries(UPSELLS).filter(([, u]) => u.kind === "oto").map(([k]) => k),
    ["voice", "text"],
)

console.log("ok — funil e diagnóstico")
