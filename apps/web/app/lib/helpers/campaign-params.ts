import type { Campaign } from "../../types/campaign";
import {
    infojobsAreaOptions,
    infojobsContractOptions,
    infojobsDateOptions,
    infojobsPcdOptions,
    infojobsRadiusOptions,
    infojobsSalaryOptions,
    infojobsSeniorityOptions,
    infojobsShiftOptions,
    infojobsStateOptions,
    infojobsWorkModelOptions,
    linkedinDatePostedOptions,
    linkedinExperienceOptions,
    linkedinJobTypeOptions,
    linkedinRemoteOptions,
    linkedinSortOptions,
} from "../constants/campaign-options";

export interface CampaignParam {
    label: string;
    // Sempre uma lista: campos simples têm 1 item; multi-select têm N (renderizados como chips).
    values: string[];
}

type Option = { readonly label: string; readonly value: string };

function labelOf(options: readonly Option[], value: string | null | undefined): string[] | null {
    if (!value) {
        return null;
    }
    return [options.find((option) => option.value === value)?.label ?? value];
}

function labelsOf(options: readonly Option[], values: string[] | null | undefined): string[] | null {
    if (!values || values.length === 0) {
        return null;
    }
    return values.map((value) => options.find((option) => option.value === value)?.label ?? value);
}

// Retorna apenas os filtros preenchidos (plataforma-específicos) da campanha.
export function getCampaignParams(campaign: Campaign): CampaignParam[] {
    const rows: Array<[string, string[] | null]> = [];

    if (campaign.platform === "linkedin") {
        const config = campaign.linkedinConfig;
        rows.push(
            ["Termos de busca", config?.searchTerms ? [config.searchTerms] : null],
            ["Localização", config?.locationTerm ? [config.locationTerm] : null],
            ["Ordenar por", labelOf(linkedinSortOptions, config?.sortBy)],
            ["Data de publicação", labelOf(linkedinDatePostedOptions, config?.datePosted)],
            ["Nível de experiência", labelsOf(linkedinExperienceOptions, config?.expLevel)],
            ["Tipo de vaga", labelsOf(linkedinJobTypeOptions, config?.jobType)],
            ["Modelo de trabalho", labelsOf(linkedinRemoteOptions, config?.remoteFilter)],
        );
    } else {
        const config = campaign.infojobsConfig;
        rows.push(
            ["Termos de busca", config?.searchTerms ? [config.searchTerms] : null],
            ["Estado", labelOf(infojobsStateOptions, config?.locationState)],
            ["Distância", labelOf(infojobsRadiusOptions, config?.kmDeVoce)],
            ["Salário mínimo", labelOf(infojobsSalaryOptions, config?.salaryFilter)],
            ["Data de publicação", labelOf(infojobsDateOptions, config?.datePosted)],
            ["Modelo de trabalho", labelsOf(infojobsWorkModelOptions, config?.workModels)],
            ["Áreas", labelsOf(infojobsAreaOptions, config?.jobAreas)],
            ["Tipo de contrato", labelsOf(infojobsContractOptions, config?.contractTypes)],
            ["Jornada", labelsOf(infojobsShiftOptions, config?.workSchedules)],
            ["Senioridade", labelsOf(infojobsSeniorityOptions, config?.seniorityLevels)],
            ["PcD", labelsOf(infojobsPcdOptions, config?.pcdTypes)],
        );
    }

    return rows
        .filter(([, values]) => values !== null && values.length > 0)
        .map(([label, values]) => ({ label, values: values as string[] }));
}
