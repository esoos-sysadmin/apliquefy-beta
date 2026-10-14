/**
 * npx tsx app/lp/funnel.test.ts
 *
 * Os números do laudo vão para a frente de quem está decidindo pagar. Trava: as contas
 * saem só das respostas, o arredondamento nunca adianta prazo, a nota do CV vem dos
 * critérios e o leitor de .docx acha o texto.
 */
import assert from "node:assert/strict"
import { deflateRawSync } from "node:zlib"
import { PLANS } from "../lib/constants/plans"
import { analyzeCv, extractText, findings } from "./cv"
import {
    destination,
    formatDuration,
    hoursPerMonth,
    hoursSoFar,
    nextQuizScreen,
    planAppsPerWeek,
    questionsFor,
    REFERENCE_DESTINATION,
    dailyLimitFor,
    responseRate,
    targetSalary,
    weeksTo,
    type Answers,
} from "./funnel"

const a: Answers = { segment: "varejo", appsPerWeek: 10, minutesPerApp: 15, searchWeeks: 13, responsesLastMonth: 1 }

// 10 × 15 min × 52/12 semanas = 650 min = 10,83 h
assert.equal(hoursPerMonth(a)!.toFixed(2), "10.83")
assert.equal(hoursSoFar(a), 32.5) // 13 sem × 10 × 15 / 60
assert.equal(responseRate(a)!.toFixed(4), (1 / (10 * 52 / 12)).toFixed(4))
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
assert.equal(nextQuizScreen({ segment: "dev" }, "bridge"), "english")
assert.equal(nextQuizScreen({}, "cv"), "analysis")
const n = questionsFor({ segment: "dev", appsPerWeek: 5 }).length
assert.ok(n >= 8 && n <= 15, `quiz com ${n} perguntas`)

// Análise do CV
const cv = `Maria Souza — Vendedora
maria@email.com · (11) 98765-4321 · Disponibilidade: escala 6x1
Experiência
Loja X (2021–2024): vendas no balcão, atendimento ao cliente. Bati 120% da meta em 2023 e atendi 40 clientes por dia.
Formação
Ensino médio completo.
Habilidades
Proativa, comunicativa, pontual, trabalho em equipe.
${"Atendimento caixa estoque reposição vitrine. ".repeat(25)}`
const r = analyzeCv(cv, { targetRole: "Vendedor", segment: "varejo" })!
const by = (id: string) => r.criteria.find((c) => c.id === id)!
assert.ok(by("role").pass, "vendedora ↔ vendedor")
assert.ok(by("contact").pass)
assert.ok(by("results").pass, by("results").evidence)
assert.ok(by("sections").pass)
assert.ok(by("link").pass, "disponibilidade conta para varejo")
assert.ok(!by("cliches").pass, by("cliches").evidence)
assert.equal(r.score, 89) // só clichês reprovou: 80 de 90 pontos aplicáveis
assert.deepEqual(findings(r).map((c) => c.id), ["cliches"])
assert.ok(!analyzeCv(cv, { targetRole: "Analista de Dados", segment: "varejo" })!.criteria.find((c) => c.id === "role")!.pass)
assert.equal(analyzeCv("curto demais", { targetRole: "X", segment: "dev" }), null)
// Ano não é telefone
assert.ok(!analyzeCv(`contato: a@b.com 2019-2020 ${"palavra ".repeat(60)}`, { targetRole: "x", segment: "dev" })!.criteria.find((c) => c.id === "contact")!.pass)

// .docx mínimo (zip com word/document.xml deflate) → texto
function zip(name: string, content: string) {
    const data = deflateRawSync(Buffer.from(content))
    const fname = Buffer.from(name)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(8, 8)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt16LE(fname.length, 26)
    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(8, 10)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt16LE(fname.length, 28)
    central.writeUInt32LE(0, 42)
    const cdOffset = local.length + fname.length + data.length
    const eocd = Buffer.alloc(22)
    eocd.writeUInt32LE(0x06054b50, 0)
    eocd.writeUInt16LE(1, 10)
    eocd.writeUInt32LE(central.length + fname.length, 12)
    eocd.writeUInt32LE(cdOffset, 16)
    return Uint8Array.from(Buffer.concat([local, fname, data, central, fname, eocd]))
}
const docx = zip("word/document.xml", "<w:document><w:p><w:r><w:t>Experiência &amp; vendas</w:t></w:r></w:p><w:p><w:t>Linha 2</w:t></w:p></w:document>")
extractText(new File([docx], "cv.docx")).then(({ text }) => {
    assert.equal(text, "Experiência & vendas\nLinha 2\n")
    console.log("ok — funil e análise de CV")
})
