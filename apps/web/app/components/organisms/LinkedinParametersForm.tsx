"use client";

import { BriefcaseBusiness, MapPin } from "lucide-react";
import { SelectField } from "../atoms/SelectField";
import { TagInput } from "../atoms/TagInput";
import {
    linkedinDatePostedOptions,
    linkedinExperienceOptions,
    linkedinJobTypeOptions,
    linkedinRemoteOptions,
    linkedinSortOptions,
} from "../../lib/constants/campaign-options";

type LinkedinSortValue = (typeof linkedinSortOptions)[number]["value"];
type LinkedinDatePostedValue = (typeof linkedinDatePostedOptions)[number]["value"];
type LinkedinExperienceValue = (typeof linkedinExperienceOptions)[number]["value"];
type LinkedinJobTypeValue = (typeof linkedinJobTypeOptions)[number]["value"];
type LinkedinRemoteValue = (typeof linkedinRemoteOptions)[number]["value"];

export interface LinkedinFormValues {
    searchTerms: string[];
    location: string[];
    sortBy: LinkedinSortValue;
    datePosted: LinkedinDatePostedValue;
    experienceLevel: LinkedinExperienceValue;
    jobType: LinkedinJobTypeValue;
    remoteFilter: LinkedinRemoteValue;
}

export function LinkedinParametersForm({
    values,
    onChange,
}: {
    values: LinkedinFormValues;
    onChange: <K extends keyof LinkedinFormValues>(field: K, value: LinkedinFormValues[K]) => void;
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <BriefcaseBusiness size={18} className="text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">LinkedIn Parameters</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Search Terms</span>
                    <TagInput
                        tags={values.searchTerms}
                        onChange={(tags) => onChange("searchTerms", tags)}
                        placeholder="e.g. Frontend Developer"
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Location</span>
                    <TagInput
                        tags={values.location}
                        onChange={(tags) => onChange("location", tags)}
                        placeholder="e.g. Brazil, Remote"
                        icon={<MapPin size={16} className="shrink-0 text-slate-500" />}
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Sort By</span>
                    <SelectField value={values.sortBy} onChange={(value) => onChange("sortBy", value)} options={linkedinSortOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Date Posted</span>
                    <SelectField value={values.datePosted} onChange={(value) => onChange("datePosted", value)} options={linkedinDatePostedOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Experience Level</span>
                    <SelectField value={values.experienceLevel} onChange={(value) => onChange("experienceLevel", value)} options={linkedinExperienceOptions} />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Job Type</span>
                    <SelectField value={values.jobType} onChange={(value) => onChange("jobType", value)} options={linkedinJobTypeOptions} />
                </label>

                <label className="block space-y-2 lg:col-span-2 xl:max-w-[calc(50%-0.5rem)]">
                    <span className="text-sm font-medium text-slate-300">Remote Filter</span>
                    <SelectField value={values.remoteFilter} onChange={(value) => onChange("remoteFilter", value)} options={linkedinRemoteOptions} />
                </label>
            </div>
        </div>
    );
}
