/**
 * npx tsx app/lib/resume-pdf.test.ts
 *
 * O PDF é o anexo que o runner manda para o empregador e tem de caber em UMA página.
 * Trava o contrato: nunca mais de uma página, `truncated` só quando nem a menor escala
 * comporta o conteúdo, e o `\n` literal de currículos importados não chega ao papel.
 */
import assert from "node:assert/strict";
import { descriptionLines, renderResumePdf } from "./resume-pdf";
import type { Resume, ResumeTemplate } from "../types/resume";

const base: Resume = {
    id: "t",
    title: "Teste",
    createdAt: "2026-01-01",
    language: "en",
    personalInfo: { name: "Luiz Gomes", jobTitle: "AI Engineer", email: "a@b.com", contact: "81 98377-2043", professionalSummary: "Engineer." },
    experience: [
        { companyName: "Eng4tech", jobArea: "Full Stack Developer", jobStartDate: "2022-06", jobEndDate: "2023-01", description: "Built things.\\n- Applied patterns." },
    ],
    education: [{ nameOfGraduation: "Computer Science", nameOfInstitution: "Nova Roma", StartDateOfGraduation: "2025-01", EndDateOfGraduation: "2026-06" }],
    skills: ["Python", "SQL"],
    idioms: [{ language: "Português", level: "Nativo" }],
};

const bloated: Resume = {
    ...base,
    experience: Array.from({ length: 40 }, (_, i) => ({ ...base.experience![0], companyName: `Empresa ${i}`, description: "Texto longo. ".repeat(40) })),
};

for (const template of ["harvard", "two-column"] as ResumeTemplate[]) {
    const normal = renderResumePdf({ ...base, template });
    assert.equal(normal.doc.getNumberOfPages(), 1, `${template}: uma página`);
    assert.equal(normal.truncated, false, `${template}: currículo normal não corta`);

    const big = renderResumePdf({ ...bloated, template });
    assert.equal(big.doc.getNumberOfPages(), 1, `${template}: excesso continua em uma página`);
    assert.equal(big.truncated, true, `${template}: excesso é sinalizado`);
}

assert.deepEqual(descriptionLines("Built things.\\n- Applied patterns.\n• Led team"), [
    { bullet: false, text: "Built things." },
    { bullet: true, text: "Applied patterns." },
    { bullet: true, text: "Led team" },
]);

console.log("resume-pdf: ok");
