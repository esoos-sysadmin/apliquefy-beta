// Os valores DEVEM bater com os enums em packages/database/prisma/schema.prisma

export const linkedinSortOptions = [
    { label: "Mais relevantes", value: "relevant" },
    { label: "Mais recentes", value: "recent" },
] as const;

export const linkedinDatePostedOptions = [
    { label: "Qualquer época", value: "any" },
    { label: "Últimas 24 horas", value: "past_24h" },
    { label: "Última semana", value: "past_week" },
    { label: "Último mês", value: "past_month" },
] as const;

export const linkedinExperienceOptions = [
    { label: "Estágio", value: "internship" },
    { label: "Júnior", value: "entry" },
    { label: "Pleno", value: "associate" },
    { label: "Sênior", value: "mid_senior" },
    { label: "Diretor", value: "director" },
    { label: "Executivo", value: "executive" },
] as const;

export const linkedinJobTypeOptions = [
    { label: "Tempo integral", value: "full_time" },
    { label: "Meio período", value: "part_time" },
    { label: "Contrato", value: "contract" },
    { label: "Temporário", value: "temporary" },
    { label: "Voluntário", value: "volunteer" },
    { label: "Estágio", value: "internship" },
    { label: "Outro", value: "other" },
] as const;

export const linkedinRemoteOptions = [
    { label: "Remoto", value: "remote" },
    { label: "Híbrido", value: "hybrid" },
    { label: "Presencial", value: "on_site" },
] as const;

export const infojobsStateOptions = [
    { label: "Acre", value: "acre" },
    { label: "Alagoas", value: "alagoas" },
    { label: "Amapá", value: "amapa" },
    { label: "Amazonas", value: "amazonas" },
    { label: "Bahia", value: "bahia" },
    { label: "Ceará", value: "ceara" },
    { label: "Distrito Federal", value: "distrito_federal" },
    { label: "Espírito Santo", value: "espirito_santo" },
    { label: "Goiás", value: "goias" },
    { label: "Maranhão", value: "maranhao" },
    { label: "Mato Grosso", value: "mato_grosso" },
    { label: "Mato Grosso do Sul", value: "mato_grosso_do_sul" },
    { label: "Minas Gerais", value: "minas_gerais" },
    { label: "Pará", value: "para" },
    { label: "Paraíba", value: "paraiba" },
    { label: "Paraná", value: "parana" },
    { label: "Pernambuco", value: "pernambuco" },
    { label: "Piauí", value: "piaui" },
    { label: "Rio de Janeiro", value: "rio_de_janeiro" },
    { label: "Rio Grande do Norte", value: "rio_grande_do_norte" },
    { label: "Rio Grande do Sul", value: "rio_grande_do_sul" },
    { label: "Rondônia", value: "rondonia" },
    { label: "Roraima", value: "roraima" },
    { label: "Santa Catarina", value: "santa_catarina" },
    { label: "São Paulo", value: "sao_paulo" },
    { label: "Sergipe", value: "sergipe" },
    { label: "Tocantins", value: "tocantins" },
] as const;

export const infojobsRadiusOptions = [
    { label: "5 km", value: "km_5" },
    { label: "10 km", value: "km_10" },
    { label: "25 km", value: "km_25" },
    { label: "50 km", value: "km_50" },
    { label: "75 km", value: "km_75" },
    { label: "100 km", value: "km_100" },
] as const;

export const infojobsSalaryOptions = [
    { label: "R$ 1.000", value: "brl_1000" },
    { label: "R$ 2.000", value: "brl_2000" },
    { label: "R$ 3.000", value: "brl_3000" },
    { label: "R$ 4.000", value: "brl_4000" },
    { label: "R$ 5.000", value: "brl_5000" },
    { label: "R$ 6.000", value: "brl_6000" },
    { label: "R$ 7.000", value: "brl_7000" },
    { label: "R$ 8.000", value: "brl_8000" },
    { label: "R$ 9.000", value: "brl_9000" },
    { label: "R$ 10.000", value: "brl_10000" },
] as const;

export const infojobsDateOptions = [
    { label: "Hoje", value: "hoje" },
    { label: "Últimos 3 dias", value: "ultimos_3_dias" },
    { label: "Última semana", value: "ultima_semana" },
    { label: "Últimos 15 dias", value: "ultimos_15_dias" },
    { label: "Último mês", value: "ultimo_mes" },
] as const;

export const infojobsWorkModelOptions = [
    { label: "Presencial", value: "presencial" },
    { label: "Home Office", value: "home_office" },
    { label: "Híbrido", value: "hibrido" },
] as const;

export const infojobsAreaOptions = [
    { label: "Administração", value: "administracao" },
    { label: "Agricultura, Pecuária e Veterinária", value: "agricultura_pecuaria_veterinaria" },
    { label: "Alimentação e Gastronomia", value: "alimentacao_gastronomia" },
    { label: "Arquitetura, Decoração e Design", value: "arquitetura_decoracao_design" },
    { label: "Artes", value: "artes" },
    { label: "Auditoria", value: "auditoria" },
    { label: "Ciências e Pesquisa", value: "ciencias_pesquisa" },
    { label: "Comercial / Vendas", value: "comercial_vendas" },
    { label: "Comércio Exterior", value: "comercio_exterior" },
    { label: "Compras", value: "compras" },
    { label: "Comunicação, TV e Cinema", value: "comunicacao_tv_cinema" },
    { label: "Construção e Manutenção", value: "construcao_manutencao" },
    { label: "Contábil, Finanças e Economia", value: "contabil_financas_economia" },
    { label: "Cultura, Lazer e Entretenimento", value: "cultura_lazer_entretenimento" },
    { label: "Educação, Ensino e Idiomas", value: "educacao_ensino_idiomas" },
    { label: "Engenharia", value: "engenharia" },
    { label: "Estética", value: "estetica" },
    { label: "Hotelaria e Turismo", value: "hotelaria_turismo" },
    { label: "Industrial, Produção e Fábrica", value: "industrial_producao_fabrica" },
    { label: "Informática / TI / Telecomunicações", value: "informatica_ti_telecomunicacoes" },
    { label: "Jurídica", value: "juridica" },
    { label: "Logística", value: "logistica" },
    { label: "Marketing", value: "marketing" },
    { label: "Meio Ambiente e Ecologia", value: "meio_ambiente_ecologia" },
    { label: "Moda", value: "moda" },
    { label: "Qualidade", value: "qualidade" },
    { label: "Química e Petroquímica", value: "quimica_petroquimica" },
    { label: "Recursos Humanos", value: "recursos_humanos" },
    { label: "Saúde", value: "saude" },
    { label: "Segurança", value: "seguranca" },
    { label: "Serviço Social / Comunitário", value: "servico_social_comunitario" },
    { label: "Serviços Gerais", value: "servicos_gerais" },
    { label: "Telemarketing", value: "telemarketing" },
    { label: "Transportes", value: "transportes" },
] as const;

export const infojobsContractOptions = [
    { label: "CLT", value: "clt" },
    { label: "Autônomo", value: "autonomo" },
    { label: "PJ", value: "pj" },
    { label: "Cooperado", value: "cooperado" },
    { label: "Jovem Aprendiz", value: "jovem_aprendiz" },
    { label: "Estágio", value: "estagio" },
    { label: "Temporário", value: "temporario" },
    { label: "Trainee", value: "trainee" },
    { label: "Outros", value: "outros" },
] as const;

export const infojobsShiftOptions = [
    { label: "Período Integral", value: "periodo_integral" },
    { label: "Parcial manhã", value: "parcial_manha" },
    { label: "Parcial tarde", value: "parcial_tarde" },
    { label: "Parcial noite", value: "parcial_noite" },
    { label: "Noturno", value: "noturno" },
] as const;

export const infojobsSeniorityOptions = [
    { label: "Estagiário", value: "estagiario" },
    { label: "Operacional", value: "operacional" },
    { label: "Auxiliar", value: "auxiliar" },
    { label: "Assistente", value: "assistente" },
    { label: "Trainee", value: "trainee" },
    { label: "Técnico", value: "tecnico" },
    { label: "Analista", value: "analista" },
    { label: "Encarregado", value: "encarregado" },
    { label: "Supervisor", value: "supervisor" },
    { label: "Consultor", value: "consultor" },
    { label: "Especialista", value: "especialista" },
    { label: "Coordenador", value: "coordenador" },
    { label: "Gerente", value: "gerente" },
    { label: "Diretor", value: "diretor" },
] as const;

export const infojobsPcdOptions = [
    { label: "Sem filtro", value: "" },
    { label: "Auditiva", value: "auditiva" },
    { label: "Física", value: "fisica" },
    { label: "Visual", value: "visual" },
    { label: "Mental", value: "mental" },
    { label: "Reabilitados", value: "reabilitados" },
    { label: "Psicossocial", value: "psicossocial" },
    { label: "Fala", value: "fala" },
    { label: "Intelectual", value: "intelectual" },
    { label: "TEA", value: "tea" },
] as const;
