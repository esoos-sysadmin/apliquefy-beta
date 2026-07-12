const FIELD_LABELS: Record<string, string> = {
    title: "Título do currículo",
    name: "Nome",
    jobTitle: "Cargo",
    email: "E-mail",
    contact: "Telefone",
    address: "Endereço",
    desiredSalary: "Pretensão salarial",
    seniority: "Senioridade",
    linkedinUrl: "LinkedIn",
    portfolio: "Portfólio",
    github: "GitHub",
    professionalSummary: "Resumo profissional",
    personalInfo: "Dados pessoais",
    experience: "Experiência",
    companyName: "Nome da empresa",
    jobType: "Tipo de vaga",
    description: "Descrição das atividades",
    jobArea: "Área de atuação",
    jobStartDate: "Início do trabalho",
    jobEndDate: "Fim do trabalho",
    isActualJob: "Trabalho atual",
    skills: "Habilidades",
    education: "Formação",
    nameOfInstitution: "Instituição",
    nameOfGraduation: "Curso",
    StartDateOfGraduation: "Início do curso",
    EndDateOfGraduation: "Fim do curso",
    idioms: "Idiomas",
    language: "Idioma",
    level: "Nível",
    isDefault: "Currículo padrão",
    resumeId: "Currículo",
    platform: "Plataforma",
    dailyLimit: "Limite diário",
    linkedinConfig: "Configuração do LinkedIn",
    infojobsConfig: "Configuração do InfoJobs",
    searchTerms: "Termos de busca",
    locationTerm: "Localização",
    locationState: "Estado",
    sortBy: "Ordenação",
    datePosted: "Data de publicação",
    expLevel: "Nível de experiência",
    remoteFilter: "Modelo remoto",
    kmDeVoce: "Raio de busca",
    salaryFilter: "Faixa salarial",
    workModels: "Modelo de trabalho",
    jobAreas: "Áreas",
    contractTypes: "Tipos de contrato",
    workSchedules: "Jornada",
    seniorityLevels: "Senioridade",
    pcdTypes: "PcD",
};

export interface FieldError {
    path: string;
    label: string;
    message: string;
}

function labelForSegment(segment: string): string {
    if (/^\d+$/.test(segment)) return `#${Number(segment) + 1}`;
    return FIELD_LABELS[segment] ?? segment;
}

function buildLabel(pathSegments: string[]): string {
    return pathSegments
        .map(labelForSegment)
        .join(" › ");
}

export function flattenZodErrorTree(tree: unknown): FieldError[] {
    const out: FieldError[] = [];

    function walk(node: unknown, pathSegments: string[]) {
        if (!node || typeof node !== "object") return;
        const obj = node as Record<string, unknown>;

        const errors = obj._errors;
        if (Array.isArray(errors)) {
            for (const message of errors) {
                if (typeof message === "string" && message.length > 0) {
                    out.push({
                        path: pathSegments.join("."),
                        label: pathSegments.length > 0 ? buildLabel(pathSegments) : "Formulário",
                        message,
                    });
                }
            }
        }

        for (const key of Object.keys(obj)) {
            if (key === "_errors") continue;
            walk(obj[key], [...pathSegments, key]);
        }
    }

    walk(tree, []);
    return out;
}
