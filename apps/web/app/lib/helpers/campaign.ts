import type { Campaign } from "../../types/campaign";
import { atsWorkModelOptions } from "../constants/campaign-options";

const brazilStateLabels: Record<string, string> = {
    acre: "Acre",
    alagoas: "Alagoas",
    amapa: "Amapá",
    amazonas: "Amazonas",
    bahia: "Bahia",
    ceara: "Ceará",
    distrito_federal: "Distrito Federal",
    espirito_santo: "Espírito Santo",
    goias: "Goiás",
    maranhao: "Maranhão",
    mato_grosso: "Mato Grosso",
    mato_grosso_do_sul: "Mato Grosso do Sul",
    minas_gerais: "Minas Gerais",
    para: "Pará",
    paraiba: "Paraíba",
    parana: "Paraná",
    pernambuco: "Pernambuco",
    piaui: "Piauí",
    rio_de_janeiro: "Rio de Janeiro",
    rio_grande_do_norte: "Rio Grande do Norte",
    rio_grande_do_sul: "Rio Grande do Sul",
    rondonia: "Rondônia",
    roraima: "Roraima",
    santa_catarina: "Santa Catarina",
    sao_paulo: "São Paulo",
    sergipe: "Sergipe",
    tocantins: "Tocantins",
};

const atsWorkModelLabels: Record<string, string> = Object.fromEntries(atsWorkModelOptions.map((option) => [option.value, option.label]));

export function getCampaignLocation(campaign: Campaign): string {
    if (campaign.platform === "ats") {
        const config = campaign.atsConfig;
        const place = config?.locationTerm?.trim();
        const models = (config?.workModels ?? []).map((model) => atsWorkModelLabels[model] ?? model).join("/");
        return [place, models].filter(Boolean).join(" · ") || "Qualquer local";
    }

    if (campaign.platform === "linkedin") {
        return campaign.linkedinConfig?.locationTerm || "Localização não informada";
    }

    const state = campaign.infojobsConfig?.locationState;
    return state ? brazilStateLabels[state] || state : "Localização não informada";
}

export function getApplicationsCount(campaign: Campaign): number {
    return campaign._count?.jobApplications ?? 0;
}
