import type { RunnerCampaign, RunnerCampaignApiModel } from "../../shared/runner-types";

const brazilStateLabels: Record<string, string> = {
    acre: "Acre",
    alagoas: "Alagoas",
    amapa: "Amapa",
    amazonas: "Amazonas",
    bahia: "Bahia",
    ceara: "Ceara",
    distrito_federal: "Distrito Federal",
    espirito_santo: "Espirito Santo",
    goias: "Goias",
    maranhao: "Maranhao",
    mato_grosso: "Mato Grosso",
    mato_grosso_do_sul: "Mato Grosso do Sul",
    minas_gerais: "Minas Gerais",
    para: "Para",
    paraiba: "Paraiba",
    parana: "Parana",
    pernambuco: "Pernambuco",
    piaui: "Piaui",
    rio_de_janeiro: "Rio de Janeiro",
    rio_grande_do_norte: "Rio Grande do Norte",
    rio_grande_do_sul: "Rio Grande do Sul",
    rondonia: "Rondonia",
    roraima: "Roraima",
    santa_catarina: "Santa Catarina",
    sao_paulo: "Sao Paulo",
    sergipe: "Sergipe",
    tocantins: "Tocantins",
};

export function formatDistanceToNow(date: string) {
    const timestamp = new Date(date).getTime();
    const diff = Date.now() - timestamp;
    const minute = 60_000;
    const hour = minute * 60;
    const day = hour * 24;

    if (diff < minute) {
        return "Just now";
    }

    if (diff < hour) {
        return `${Math.floor(diff / minute)} min ago`;
    }

    if (diff < day) {
        return `${Math.floor(diff / hour)}h ago`;
    }

    return `${Math.floor(diff / day)}d ago`;
}

export function mapCampaignLocation(campaign: RunnerCampaignApiModel) {
    if (campaign.platform === "linkedin") {
        return campaign.linkedinConfig?.locationTerm || "Location not informed";
    }

    const state = campaign.infojobsConfig?.locationState;
    return state ? brazilStateLabels[state] ?? state : "Location not informed";
}

export function mapCampaignNotes(campaign: RunnerCampaignApiModel) {
    if (campaign.platform === "linkedin") {
        return campaign.linkedinConfig?.searchTerms
            ? `Search terms: ${campaign.linkedinConfig.searchTerms}`
            : "LinkedIn automation configured.";
    }

    return campaign.infojobsConfig?.searchTerms
        ? `Search terms: ${campaign.infojobsConfig.searchTerms}`
        : "InfoJobs automation configured.";
}

export function mapCampaign(campaign: RunnerCampaignApiModel): RunnerCampaign {
    return {
        id: campaign.id,
        name: campaign.name,
        platform: campaign.platform,
        status: campaign.status,
        location: mapCampaignLocation(campaign),
        applications: campaign._count?.jobApplications ?? 0,
        dailyLimit: campaign.dailyLimit ?? 0,
        resumeTitle: campaign.resume?.title ?? "Currículo removido",
        hasResume: Boolean(campaign.resume?.id),
        lastUpdated: formatDistanceToNow(campaign.createdAt),
        notes: mapCampaignNotes(campaign),
    };
}
