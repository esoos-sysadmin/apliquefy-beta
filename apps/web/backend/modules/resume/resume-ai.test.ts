/**
 * npx tsx backend/modules/resume/resume-ai.test.ts
 *
 * PDF de currículo não tem padrão, então a saída da IA vem torta: campo faltando,
 * null no lugar de string, seniority/level fora do enum. Se a normalização deixar
 * passar `undefined`, o formulário quebra em runtime (`.length` de undefined) ou
 * grava lixo no banco. Este check trava o contrato: sempre ResumeFormData completo.
 */
import assert from "node:assert/strict";
import { normalizeExtractedResume } from "./resume-ai";
import { emptyResumeForm } from "../../../app/lib/constants/resume-form";

// pior caso: só o mínimo, com nulls
const sparse = normalizeExtractedResume({ personalInfo: { name: "Ana", email: null }, skills: null });
assert.equal(sparse.title, "Currículo importado");
assert.equal(sparse.personalInfo.name, "Ana");
assert.deepEqual(Object.keys(sparse.personalInfo).sort(), Object.keys(emptyResumeForm.personalInfo).sort());
for (const [key, value] of Object.entries(sparse.personalInfo)) {
    assert.equal(typeof value, "string", `personalInfo.${key} deveria ser string`);
}
assert.deepEqual(sparse.skills, []);
assert.deepEqual(sparse.experience, []);
assert.deepEqual(sparse.idioms, []);

// valor fora do enum não pode derrubar a extração inteira — vira ""
const offEnum = normalizeExtractedResume({
    title: "Dev",
    personalInfo: { seniority: "Ninja" },
    idioms: [{ language: "Inglês", level: "C1" }, { language: "", level: "Fluente" }],
    skills: ["React", " ", "  Go  ", "C"],
});
assert.equal(offEnum.personalInfo.seniority, "");
assert.deepEqual(offEnum.idioms, [{ language: "Inglês", level: "" }]); // idioma sem nome é descartado
assert.deepEqual(offEnum.skills, ["React", "Go"]); // vazios e 1 letra fora

// caminho feliz: preserva o que veio
const full = normalizeExtractedResume({
    title: "Currículo Dev",
    personalInfo: { name: "Ana Lima", jobTitle: "Dev", email: "a@b.com", contact: "11999998888", seniority: "Pleno" },
    experience: [{ companyName: "Acme", jobArea: "Tecnologia", jobStartDate: "2020-01", isActualJob: true }],
    education: [{ nameOfInstitution: "USP", nameOfGraduation: "CC" }],
});
assert.equal(full.personalInfo.seniority, "Pleno");
assert.equal(full.experience[0]!.companyName, "Acme");
assert.equal(full.experience[0]!.isActualJob, true);
assert.equal(full.experience[0]!.jobEndDate, ""); // campo ausente vira "", nunca undefined
assert.equal(full.education[0]!.EndDateOfGraduation, "");

console.log("resume-ai: ok");
