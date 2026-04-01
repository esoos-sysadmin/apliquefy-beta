import { z } from "zod";

// ======================= BASE =======================

const campaignBaseSchema = z.object({
    name: z.string().min(3, "O nome da campanha deve ter ao menos 3 caracteres"),
    resumeId: z.string().uuid("ID do currículo inválido"),
    dailyLimit: z.number().int().min(1, "O limite diário deve ser ao menos 1").max(200, "O limite diário não pode exceder 200").optional().default(50),
});

// ======================= LINKEDIN =======================

export const linkedinSortEnum = z.enum(["recent", "relevant"]);
export const linkedinDateEnum = z.enum(["any", "past_month", "past_week", "past_24h"]);
export const linkedinExpEnum = z.enum(["internship", "entry", "associate", "mid_senior", "director", "executive"]);
export const linkedinJobTypeEnum = z.enum(["full_time", "part_time", "contract", "temporary", "volunteer", "internship", "other"]);
export const linkedinRemoteEnum = z.enum(["remote", "hybrid", "on_site"]);

const linkedinConfigSchema = z.object({
    searchTerms: z.string().min(2, "O termo de busca deve ter ao menos 2 caracteres"),
    locationTerm: z.string().min(2, "A localização deve ter ao menos 2 caracteres").optional(),
    sortBy: linkedinSortEnum.optional().default("relevant"),
    datePosted: linkedinDateEnum.optional().default("any"),
    expLevel: z.array(linkedinExpEnum).optional().default([]),
    jobType: z.array(linkedinJobTypeEnum).optional().default([]),
    remoteFilter: z.array(linkedinRemoteEnum).optional().default([]),
});

export const createLinkedinCampaignSchema = campaignBaseSchema.extend({
    linkedinConfig: linkedinConfigSchema,
});

// ======================= INFOJOBS =======================

export const ijWorkModelEnum = z.enum(["presencial", "home_office", "hibrido"]);
export const ijRadiusEnum = z.enum(["km_5", "km_10", "km_25", "km_50", "km_75", "km_100"]);
export const ijSalaryEnum = z.enum(["brl_1000", "brl_2000", "brl_3000", "brl_4000", "brl_5000", "brl_6000", "brl_7000", "brl_8000", "brl_9000", "brl_10000"]);
export const ijDatePostedEnum = z.enum(["hoje", "ultimos_3_dias", "ultima_semana", "ultimos_15_dias", "ultimo_mes"]);
export const ijJobAreaEnum = z.enum([
    "administracao", "agricultura_pecuaria_veterinaria", "alimentacao_gastronomia",
    "arquitetura_decoracao_design", "artes", "auditoria", "ciencias_pesquisa",
    "comercial_vendas", "comercio_exterior", "compras", "comunicacao_tv_cinema",
    "construcao_manutencao", "contabil_financas_economia", "cultura_lazer_entretenimento",
    "educacao_ensino_idiomas", "engenharia", "estetica", "hotelaria_turismo",
    "industrial_producao_fabrica", "informatica_ti_telecomunicacoes", "juridica",
    "logistica", "marketing", "meio_ambiente_ecologia", "moda", "qualidade",
    "quimica_petroquimica", "recursos_humanos", "saude", "seguranca",
    "servico_social_comunitario", "servicos_gerais", "telemarketing", "transportes",
]);
export const ijContractEnum = z.enum(["clt", "autonomo", "pj", "cooperado", "jovem_aprendiz", "estagio", "temporario", "trainee", "outros"]);
export const ijScheduleEnum = z.enum(["periodo_integral", "parcial_manha", "parcial_tarde", "parcial_noite", "noturno"]);
export const ijSeniorityEnum = z.enum(["estagiario", "operacional", "auxiliar", "assistente", "trainee", "tecnico", "analista", "encarregado", "supervisor", "consultor", "especialista", "coordenador", "gerente", "diretor"]);
export const ijPcdEnum = z.enum(["auditiva", "fisica", "visual", "mental", "reabilitados", "psicossocial", "fala", "intelectual", "tea"]);

export const brazilStateEnum = z.enum([
    "acre", "alagoas", "amapa", "amazonas", "bahia", "ceara", "distrito_federal",
    "espirito_santo", "goias", "maranhao", "mato_grosso", "mato_grosso_do_sul",
    "minas_gerais", "para", "paraiba", "parana", "pernambuco", "piaui",
    "rio_de_janeiro", "rio_grande_do_norte", "rio_grande_do_sul", "rondonia",
    "roraima", "santa_catarina", "sao_paulo", "sergipe", "tocantins",
]);

const infojobsConfigSchema = z.object({
    searchTerms: z.string().min(2, "O termo de busca deve ter ao menos 2 caracteres"),
    locationState: brazilStateEnum.optional(),
    kmDeVoce: ijRadiusEnum.optional().default("km_25"),
    salaryFilter: ijSalaryEnum.optional(),
    datePosted: ijDatePostedEnum.optional(),
    workModels: z.array(ijWorkModelEnum).optional().default([]),
    jobAreas: z.array(ijJobAreaEnum).optional().default([]),
    contractTypes: z.array(ijContractEnum).optional().default([]),
    workSchedules: z.array(ijScheduleEnum).optional().default([]),
    seniorityLevels: z.array(ijSeniorityEnum).optional().default([]),
    pcdTypes: z.array(ijPcdEnum).optional().default([]),
});

export const createInfojobsCampaignSchema = campaignBaseSchema.extend({
    infojobsConfig: infojobsConfigSchema,
});

// ======================= UPDATE =======================

export const updateCampaignSchema = z.object({
    name: z.string().min(3, "O nome da campanha deve ter ao menos 3 caracteres").optional(),
    resumeId: z.string().uuid("ID do currículo inválido").optional(),
    dailyLimit: z.number().int().min(1).max(200).optional(),
}).refine(
    (data) => data.name !== undefined || data.resumeId !== undefined || data.dailyLimit !== undefined,
    { message: "Ao menos um campo deve ser enviado para atualização (name, resumeId ou dailyLimit)" }
);
