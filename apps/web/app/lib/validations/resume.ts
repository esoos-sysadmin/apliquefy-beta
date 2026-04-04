import { z } from "zod";

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
    contact: z.string().min(8, "Digite um número de contato válido com DDD"),
    address: z.string().optional(),
    desiredSalary: z.string().optional(),
    seniority: z.enum(["Estagiário", "Júnior", "Pleno", "Sênior", "Especialista", "Gerente", "Diretor"]).optional(),
    linkedinUrl: z.url("Link do LinkedIn inválido").optional().or(z.literal("")),
    portfolio: z.url("Link do portfólio inválido").optional().or(z.literal("")),
    github: z.url("Link do GitHub inválido").optional().or(z.literal("")),
    professionalSummary: z.string().max(500, "O resumo não pode exceder 500 caracteres").optional(),
});

const educationSchema = z.object({
    nameOfInstitution: z.string().min(3, "O nome da instituição é muito curto").optional(),
    nameOfGraduation: z.string().min(3, "O nome do curso é muito curto").optional(),
    StartDateOfGraduation: z.coerce.date({
        message: "A data de início da graduação é inválida"
    }).optional(), 
    EndDateOfGraduation: z.coerce.date({
        message: "A data de término da graduação é inválida"
    }).optional(),
});

const experienceSchema = z.object({
    companyName: z.string().min(3, "O nome da empresa é muito curto").optional(),
    jobType: z.string().min(3, "O tipo de vaga é muito curto").optional(),
    description: z.string().min(3, "A descrição das atividades é muito curta").optional(),
    jobArea: z.string().min(3, "A área de atuação é muito curta").optional(),
    jobStartDate: z.coerce.date({
        message: "A data de início no emprego é inválida"
    }).optional(),
    jobEndDate: z.coerce.date({
        message: "A data de término no emprego é inválida"
    }).optional(),
    isActualJob: z.boolean({
        message: "O campo 'trabalho atual' deve ser verdadeiro ou falso"
    }).optional().default(false),
    certifications: z.array(certificationsSchema).optional()
});

export const resumeSchema = z.object({
    personalInfo: personalInfoSchema,
    education: z.array(educationSchema).optional(),
    experience: z.array(experienceSchema).optional(),
    skills: z.array(z.string().min(2, "O nome da habilidade é muito curto")).optional(),
    idioms: z.array(idiomsSchema).optional()
});