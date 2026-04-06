"use client";

import { BriefcaseBusiness } from "lucide-react";
import { SelectField } from "../atoms/SelectField";
import { TagInput } from "../atoms/TagInput";
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
} from "../../lib/constants/campaign-options";

type InfojobsStateValue = (typeof infojobsStateOptions)[number]["value"];
type InfojobsRadiusValue = (typeof infojobsRadiusOptions)[number]["value"];
type InfojobsSalaryValue = (typeof infojobsSalaryOptions)[number]["value"];
type InfojobsDateValue = (typeof infojobsDateOptions)[number]["value"];
type InfojobsWorkModelValue = (typeof infojobsWorkModelOptions)[number]["value"];
type InfojobsAreaValue = (typeof infojobsAreaOptions)[number]["value"];
type InfojobsContractValue = (typeof infojobsContractOptions)[number]["value"];
type InfojobsShiftValue = (typeof infojobsShiftOptions)[number]["value"];
type InfojobsSeniorityValue = (typeof infojobsSeniorityOptions)[number]["value"];
type InfojobsPcdValue = (typeof infojobsPcdOptions)[number]["value"];

export interface InfojobsFormValues {
    searchTerms: string[];
    locationState: InfojobsStateValue;
    radius: InfojobsRadiusValue;
    salary: InfojobsSalaryValue;
    datePosted: InfojobsDateValue;
    workModel: InfojobsWorkModelValue;
    area: InfojobsAreaValue;
    contract: InfojobsContractValue;
    shift: InfojobsShiftValue;
    seniority: InfojobsSeniorityValue;
    pcd: InfojobsPcdValue;
}

export function InfojobsParametersForm({
    values,
    onChange,
}: {
    values: InfojobsFormValues;
    onChange: <K extends keyof InfojobsFormValues>(field: K, value: InfojobsFormValues[K]) => void;
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <BriefcaseBusiness size={18} className="text-orange-300" />
                <h2 className="text-xl font-semibold text-white">InfoJobs Parameters</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Search Terms</span>
                    <TagInput
                        tags={values.searchTerms}
                        onChange={(tags) => onChange("searchTerms", tags)}
                        placeholder="Ex: Desenvolvedor Front-end"
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Estado/UF</span>
                    <SelectField value={values.locationState} onChange={(value) => onChange("locationState", value)} options={infojobsStateOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Raio de busca</span>
                    <SelectField value={values.radius} onChange={(value) => onChange("radius", value)} options={infojobsRadiusOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Pretensão Salarial</span>
                    <SelectField value={values.salary} onChange={(value) => onChange("salary", value)} options={infojobsSalaryOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Data de Publicação</span>
                    <SelectField value={values.datePosted} onChange={(value) => onChange("datePosted", value)} options={infojobsDateOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Modelo de Trabalho</span>
                    <SelectField value={values.workModel} onChange={(value) => onChange("workModel", value)} options={infojobsWorkModelOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Área de Atuação</span>
                    <SelectField value={values.area} onChange={(value) => onChange("area", value)} options={infojobsAreaOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Tipo de Contrato</span>
                    <SelectField value={values.contract} onChange={(value) => onChange("contract", value)} options={infojobsContractOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Jornada</span>
                    <SelectField value={values.shift} onChange={(value) => onChange("shift", value)} options={infojobsShiftOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Nível Hierárquico</span>
                    <SelectField value={values.seniority} onChange={(value) => onChange("seniority", value)} options={infojobsSeniorityOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Inclusão PcD</span>
                    <SelectField value={values.pcd} onChange={(value) => onChange("pcd", value)} options={infojobsPcdOptions} />
                </label>
            </div>
        </div>
    );
}
