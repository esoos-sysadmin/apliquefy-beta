import { z } from "zod";
import { resumeLanguages, resumeTemplates } from "../constants/resume-form";

const certificationsSchema = z.object({
    titulo: z.string().min(3, "O título da certificação é muito curto").optional(),
    link: z.url("Link da certificação inválido").optional().or(z.literal("")),
});

const idiomsSchema = z.object({
    language: z.string().min(1, "Digite o nome do idioma"),
    level: z.enum(["Básico", "Intermediário", "Avançado", "Fluente", "Nativo"], {
        message: "Selecione um nível de idioma válido"
    })
});

const personalInfoSchema = z.object({
    name: z.string().min(3, "O nome deve ter ao menos 3 letras"),
    jobTitle: z.string().min(3, "O cargo deve ter ao menos 3 letras"),
    email: z.email("Formato de e-mail inválido"),
    contact: z.string().min(8, "Digite um número de contato válido com DDD").optional(),
    phone: z.string().min(8, "Digite um número de contato válido com DDD").optional(),
    location: z.string().optional(),
    address: z.string().optional(),
    desiredSalary: z.string().optional(),
    seniority: z.enum(["Estagiário", "Júnior", "Pleno", "Sênior", "Especialista", "Gerente", "Diretor"]).optional().or(z.literal("")),
    linkedin: z.url("Link do LinkedIn inválido").optional().or(z.literal("")),
    linkedinUrl: z.url("Link do LinkedIn inválido").optional().or(z.literal("")),
    portfolio: z.url("Link do portfólio inválido").optional().or(z.literal("")),
    github: z.url("Link do GitHub inválido").optional().or(z.literal("")),
    summary: z.string().max(500, "O resumo não pode exceder 500 caracteres").optional(),
    professionalSummary: z.string().max(500, "O resumo não pode exceder 500 caracteres").optional(),
}).refine((data) => Boolean(data.contact || data.phone), {
    message: "Digite um número de contato válido com DDD",
    path: ["contact"],
});

// O form manda "" em campo opcional não preenchido; `min(n).optional()` aceita undefined
// mas reprova "". Converte antes de validar, senão um "tipo de contrato" em branco
// derruba a criação do currículo inteiro.
const withoutEmpty = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess(
        (value) =>
            value && typeof value === "object"
                ? Object.fromEntries(Object.entries(value).filter(([, v]) => v !== ""))
                : value,
        schema,
    );

const educationSchema = z.object({
    nameOfInstitution: z.string().min(3, "O nome da instituição é muito curto").optional(),
    nameOfGraduation: z.string().min(3, "O nome do curso é muito curto").optional(),
    StartDateOfGraduation: z.string().optional(),
    EndDateOfGraduation: z.string().optional(),
});

const experienceSchema = z.object({
    companyName: z.string().min(3, "O nome da empresa é muito curto").optional(),
    jobType: z.string().min(2, "O tipo de vaga é muito curto").optional(), // "PJ"
    description: z.string().min(3, "A descrição das atividades é muito curta").optional(),
    jobArea: z.string().min(3, "A área de atuação é muito curta"),
    jobStartDate: z.string().optional(),
    jobEndDate: z.string().optional().nullable(),
    isActualJob: z.boolean({
        message: "O campo 'trabalho atual' deve ser verdadeiro ou falso"
    }).optional().default(false),
    certifications: z.array(certificationsSchema).optional()
});

export const resumeSchema = z.object({
    title: z.string().min(1, "O título do currículo é obrigatório"),
    personalInfo: personalInfoSchema,
    education: z.array(withoutEmpty(educationSchema)).optional(),
    experience: z.array(withoutEmpty(experienceSchema)).optional(),
    skills: z.array(z.string().min(2, "O nome da habilidade é muito curto")).optional(),
    idioms: z.array(idiomsSchema).optional(),
    template: z.enum(resumeTemplates).optional(),
    language: z.enum(resumeLanguages).optional(),
    isDefault: z.boolean().optional(),
});
