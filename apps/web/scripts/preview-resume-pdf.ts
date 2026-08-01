/**
 * Gera o PDF do currículo em disco para conferir o layout sem subir o app.
 *
 *   cd apps/web
 *   npx tsx scripts/preview-resume-pdf.ts               # currículo de exemplo
 *   npx tsx scripts/preview-resume-pdf.ts <resumeId>    # um currículo real do banco
 *
 * Sai em `apps/web/.preview/curriculo.pdf` (ignorado pelo git) — abra pelo VS Code.
 */
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { buildResumePdf } from "../app/lib/resume-pdf";
import type { Resume } from "../app/types/resume";

// Mesma forma que o form web grava no JSONB (nomes do `resumeSchema`).
const SAMPLE: Resume = {
    id: "preview",
    title: "Currículo Engenheiro de Inteligência Artificial",
    createdAt: "2026-01-01",
    personalInfo: {
        name: "Luiz Gomes",
        jobTitle: "Engenheiro de Inteligência Artificial",
        seniority: "Pleno",
        email: "luizhlimagomes28@gmail.com",
        contact: "81 98377-2043",
        address: "Recife - PE",
        linkedinUrl: "linkedin.com/in/luiz-henrique-lima-gomes",
        github: "github.com/K4L1B3",
        portfolio: "belispetre.com",
        desiredSalary: "7000",
        professionalSummary:
            "Engenheiro de IA com foco em LLMs, visão computacional e automação de processos. Experiência ponta a ponta: da coleta e pipelines de dados ao deploy de modelos em produção, integrando APIs, bancos relacionais e agentes autônomos.",
    },
    experience: [
        {
            companyName: "Secretaria Estadual de Saúde",
            jobArea: "Inteligência Artificial",
            jobType: "CLT",
            jobStartDate: "2025-06",
            jobEndDate: "",
            isActualJob: true,
            description:
                "Desenvolvimento de modelos de IA (LLMs e Visão Computacional) e automações com Python e n8n. Criação de pipelines, sistemas de OCR e bots integrados com APIs e PostgreSQL.",
        },
        {
            companyName: "Ray Consulting",
            jobArea: "Engenharia de Dados",
            jobType: "CLT",
            jobStartDate: "2025-04",
            jobEndDate: "2025-06",
            isActualJob: false,
            description:
                "Construção e gestão de pipelines de ETL, automatizando processos de análise de mercado e integrando dados de múltiplas fontes.",
        },
        {
            companyName: "EOGAN",
            jobArea: "Desenvolvimento Full Stack",
            jobType: "CLT",
            jobStartDate: "2022-01",
            jobEndDate: "2024-02",
            isActualJob: false,
            description:
                "Liderança de decisões técnicas e coordenação de equipes de desenvolvimento, garantindo a entrega de soluções escaláveis e de alta qualidade.",
        },
    ],
    education: [
        {
            nameOfGraduation: "Bacharelado em Ciência da Computação",
            nameOfInstitution: "Faculdade Nova Roma",
            StartDateOfGraduation: "2025-01",
            EndDateOfGraduation: "2026-06",
        },
        {
            nameOfGraduation: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
            nameOfInstitution: "Faculdade Nova Roma",
            StartDateOfGraduation: "2022-01",
            EndDateOfGraduation: "2024-01",
        },
    ],
    skills: ["Python", "Django", "Next.js", "ETL", "Machine Learning", "Deep Learning", "SQL", "Blockchain", "React JS", "C#", "Azure", "AWS"],
    idioms: [
        { language: "Português", level: "Nativo" },
        { language: "Inglês", level: "Avançado" },
    ],
};

async function load(resumeId?: string): Promise<Resume> {
    if (!resumeId) return SAMPLE;
    const { prisma } = await import("@repo/database");
    const row = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!row) throw new Error(`Currículo ${resumeId} não encontrado`);
    await prisma.$disconnect();
    return row as unknown as Resume;
}

const out = path.join(__dirname, "..", ".preview", "curriculo.pdf");
load(process.argv[2]).then((resume) => {
    mkdirSync(path.dirname(out), { recursive: true });
    writeFileSync(out, buildResumePdf(resume));
    console.log(`PDF gerado: ${out}`);
});
