"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ChevronDown, Copy, Download, Languages, Loader2, Maximize, MoveHorizontal, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import { useResumes } from "../../hooks/use-resumes";
import {
    emptyExperience, emptyEducation, emptyIdiom,
    resumeLanguageLabels, resumeLanguages, resumeTemplateLabels, resumeTemplates,
} from "../../lib/constants/resume-form";
import { RESUME_TRANSLATION_COST } from "../../lib/constants/credits";
import { calcResumeProgress, formatPhone } from "../../lib/helpers/resume";
import { downloadResumePdf, renderResumePdf } from "../../lib/resume-pdf";
import { toast } from "../../lib/toast";
import { ApiError } from "../../lib/api-client";
import { flattenZodErrorTree, type FieldError } from "../../lib/format-field-errors";
import { inputStyle, errorStyle, labelStyle } from "../../lib/constants/resume-styles";
import { ConfirmDialog } from "../molecules/ConfirmDialog";
import { FormErrorBanner } from "../molecules/FormErrorBanner";
import { ResumeProgressBar } from "../molecules/ResumeProgressBar";
import { ResumePersonalDetailsSection } from "./ResumePersonalDetailsSection";
import { ResumeWorkExperienceSection } from "./ResumeWorkExperienceSection";
import { ResumeSkillsSection } from "./ResumeSkillsSection";
import { ResumeEducationSection } from "./ResumeEducationSection";
import { ResumeIdiomsSection } from "./ResumeIdiomsSection";
import type { ResumeFormData } from "../../types/resume-form";
import type { CreateResumeInput, Resume, ResumeLanguage, ResumeTemplate } from "../../types/resume";

// Hover com leve elevação + brilho; o ícone (group-hover) cresce junto.
const toolButton =
    "group inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-[10px] border border-blue-500 px-3.5 text-[13px] font-semibold text-blue-300 no-underline transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-blue-500/15 hover:text-fg hover:shadow-[0_8px_24px_rgb(var(--c-accent) / 0.25)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";
const toolIcon = "transition-transform duration-200 group-hover:scale-110";

const zoomButton =
    "inline-flex h-[30px] min-w-[30px] items-center justify-center rounded-lg px-2 text-xs font-semibold text-slate-300 transition-all duration-150 hover:bg-blue-500/15 hover:text-fg active:scale-90";

const menuItem =
    "group/item flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] text-slate-200 transition-all duration-150 ease-out hover:translate-x-1 hover:bg-blue-500/15 hover:text-fg disabled:cursor-not-allowed disabled:opacity-50";
const menuIcon = "shrink-0 text-slate-400 transition-all duration-150 group-hover/item:scale-110 group-hover/item:text-blue-300";

// Largura de uma A4 a 100% no visualizador de PDF: 210mm em px CSS (96dpi).
const A4_WIDTH_PX = 794;


export type ResumeEditorInitial = { form: ResumeFormData; template: ResumeTemplate; language: ResumeLanguage };

/**
 * Formulário à esquerda, PDF ao vivo à direita. Sem `resumeId` é criação: salvar cria
 * o currículo e troca para a URL de edição. O estado nasce de `initial` uma vez só —
 * revalidação do SWR não apaga edição não salva; quem muda de currículo remonta via `key`.
 */
export function ResumeEditor({ resumeId, initial, notice }: { resumeId?: string; initial: ResumeEditorInitial; notice?: React.ReactNode }) {
    const router = useRouter();
    const { createResume, updateResume, translateResume } = useResumes();

    const [form, setForm] = useState<ResumeFormData>(initial.form);
    const [template, setTemplate] = useState<ResumeTemplate>(initial.template);
    const [language, setLanguage] = useState<ResumeLanguage>(initial.language);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiErrors, setApiErrors] = useState<FieldError[]>([]);
    const [busy, setBusy] = useState<null | "save" | "duplicate" | ResumeLanguage>(null);
    const [preview, setPreview] = useState<{ url: string; truncated: boolean } | null>(null);
    const [confirmLeave, setConfirmLeave] = useState(false);
    const previewUrl = useRef<string | null>(null);
    // "width" = página ocupando a largura do painel (padrão); "page" = página inteira; número = % fixo.
    const [zoom, setZoom] = useState<"width" | "page" | number>("width");
    const previewBox = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDetailsElement>(null);

    // <details> não fecha sozinho: clique fora ou Esc fecham o menu.
    useEffect(() => {
        const close = (event: Event) => {
            const menu = menuRef.current;
            if (!menu?.open) return;
            // blur da janela = clique dentro do iframe do preview, que não dispara pointerdown aqui
            if (event.type === "blur" || (event instanceof KeyboardEvent ? event.key === "Escape" : !menu.contains(event.target as Node))) menu.open = false;
        };
        document.addEventListener("pointerdown", close);
        document.addEventListener("keydown", close);
        window.addEventListener("blur", close);
        return () => {
            window.removeEventListener("blur", close);
            document.removeEventListener("pointerdown", close);
            document.removeEventListener("keydown", close);
        };
    }, []);

    const payload: CreateResumeInput = useMemo(
        () => ({
            title: form.title,
            personalInfo: form.personalInfo,
            experience: form.experience,
            skills: form.skills,
            education: form.education,
            idioms: form.idioms.filter((i) => i.language && i.level),
            template,
            language,
        }),
        [form, template, language],
    );

    const [saved, setSaved] = useState(() => JSON.stringify(payload));
    const dirty = JSON.stringify(payload) !== saved;
    const previewResume = { ...payload, id: resumeId ?? "novo", createdAt: "" } as Resume;

    // Preview = o mesmo PDF do download e do runner, gerado do estado do form (não do salvo).
    useEffect(() => {
        const timer = setTimeout(() => {
            const { doc, truncated } = renderResumePdf({ ...payload, id: "preview", createdAt: "" } as Resume);
            const url = URL.createObjectURL(doc.output("blob"));
            if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
            previewUrl.current = url;
            setPreview({ url, truncated });
        }, 400);
        return () => clearTimeout(timer);
    }, [payload]);

    useEffect(() => () => {
        if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    }, []);

    function setPersonal(field: string, value: string) {
        setForm((f) => ({
            ...f,
            personalInfo: { ...f.personalInfo, [field]: field === "contact" ? formatPhone(value) : value },
        }));
    }

    function setItem<K extends "experience" | "education" | "idioms">(key: K, index: number, field: string, value: string | boolean) {
        setForm((f) => {
            const list = [...f[key]] as ResumeFormData[K];
            list[index] = { ...list[index], [field]: value } as ResumeFormData[K][number];
            return { ...f, [key]: list };
        });
    }

    function validate() {
        const errs: Record<string, string> = {};
        if (!form.title.trim()) errs.title = "O título do currículo é obrigatório";
        if (!form.personalInfo.name || form.personalInfo.name.length < 3) errs.name = "O nome deve ter ao menos 3 letras";
        if (!form.personalInfo.jobTitle || form.personalInfo.jobTitle.length < 3) errs.jobTitle = "O cargo deve ter ao menos 3 letras";
        if (!form.personalInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personalInfo.email)) errs.email = "Formato de e-mail inválido";
        if (!form.personalInfo.contact || form.personalInfo.contact.replace(/\D/g, "").length < 8) errs.contact = "Digite um número de contato válido com DDD";
        setErrors(errs);
        if (Object.keys(errs).length) toast.error("Corrija os campos destacados antes de salvar.");
        return Object.keys(errs).length === 0;
    }

    // Erro de rede/servidor já vira toast no hook (handleClientError); 400 de validação
    // do servidor vira a lista de campos no topo do formulário.
    async function run(kind: NonNullable<typeof busy>, action: () => Promise<void>) {
        setApiErrors([]);
        setBusy(kind);
        try {
            await action();
        } catch (error) {
            if (error instanceof ApiError && error.status === 400 && error.details) {
                setApiErrors(flattenZodErrorTree(error.details));
            }
        } finally {
            setBusy(null);
        }
    }

    /** Grava e devolve o id: cria na primeira vez, atualiza depois. */
    async function persist(): Promise<string> {
        if (resumeId) {
            await updateResume(resumeId, payload);
            setSaved(JSON.stringify(payload));
            return resumeId;
        }
        const created = await createResume({ ...payload, isDefault: false });
        setSaved(JSON.stringify(payload));
        router.replace(`/curriculos/${created.id}`);
        return created.id;
    }

    const save = () => run("save", async () => {
        if (validate()) await persist();
    });

    // Duplicar simples não precisa de IA nem de endpoint: grava o form atual como novo currículo.
    const duplicate = () => run("duplicate", async () => {
        if (!validate()) return;
        const created = await createResume({ ...payload, title: `${form.title} (cópia)`, isDefault: false });
        router.push(`/curriculos/${created.id}`);
    });

    // A IA traduz o que está salvo; salva antes para não traduzir uma versão velha.
    const translate = (target: ResumeLanguage) => run(target, async () => {
        if (!validate()) return;
        const id = await persist();
        const created = await translateResume(id, target);
        router.push(`/curriculos/${created.id}`);
    });

    // O visualizador nativo não expõe o zoom atual; parte do % equivalente a "largura" para o +/−.
    function stepZoom(delta: number) {
        const fitWidth = Math.round((((previewBox.current?.clientWidth ?? A4_WIDTH_PX) - 40) / A4_WIDTH_PX) * 100);
        const current = typeof zoom === "number" ? zoom : fitWidth;
        setZoom(Math.min(300, Math.max(30, Math.round((current + delta) / 10) * 10)));
    }
    const viewerParams = zoom === "width" ? "view=FitH&zoom=page-width" : zoom === "page" ? "view=Fit&zoom=page-fit" : `zoom=${zoom}`;

    const leave = () => (dirty ? setConfirmLeave(true) : router.push("/curriculos"));
    const menuBusy = busy === "duplicate" || resumeLanguages.includes(busy as ResumeLanguage);

    // xl: o editor ocupa a altura da tela (100vh menos o padding de 32px do <main>);
    // só o formulário rola, o preview fica parado mostrando a página inteira.
    return (
        <div className="resume-editor flex flex-col xl:h-[calc(100vh-64px)]" style={{ color: "rgb(var(--c-fg))", fontFamily: "sans-serif" }}>
            <div className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <button type="button" onClick={leave} aria-label="Voltar para currículos" className={`${toolButton} border-line-strong text-slate-300 hover:border-slate-500`}>
                        <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                    </button>
                    <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                        {resumeId ? "Editar currículo" : "Novo currículo"}
                    </h1>
                    {dirty && <span className="text-xs text-amber-300">Alterações não salvas</span>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {resumeId && (
                        <Link href={`/curriculos/analisar?resume=${resumeId}`} className={toolButton}>
                            <Sparkles size={15} className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                            Analisar com IA
                        </Link>
                    )}

                    {/* <details> nativo: abre/fecha sem estado React; o efeito acima fecha ao clicar fora */}
                    <details ref={menuRef} className="group/menu relative">
                        <summary className={`${toolButton} cursor-pointer list-none group-open/menu:bg-blue-500/15 group-open/menu:text-fg [&::-webkit-details-marker]:hidden`}>
                            {menuBusy ? <Loader2 size={15} className="animate-spin" /> : <Copy size={15} className={toolIcon} />}
                            Duplicar e traduzir
                            <ChevronDown size={14} className="transition-transform duration-200 group-open/menu:rotate-180" />
                        </summary>
                        {/* dropdown-in (globals.css) toca a cada abertura: o painel só existe com o <details> aberto */}
                        <div className="absolute right-0 z-20 mt-2 w-72 origin-top-right animate-[dropdown-in_0.16s_ease-out] rounded-xl border border-line-strong bg-surface/95 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur">
                            <button type="button" className={menuItem} disabled={!!busy} onClick={duplicate}>
                                <Copy size={14} className={menuIcon} /> Duplicar
                            </button>
                            {resumeLanguages.map((lang) => (
                                <button key={lang} type="button" className={menuItem} disabled={!!busy} onClick={() => translate(lang)}>
                                    <Languages size={14} className={menuIcon} />
                                    Duplicar em {resumeLanguageLabels[lang]} com IA
                                    <span className="ml-auto rounded-full px-2 py-0.5 text-xs text-slate-500 transition-colors duration-150 group-hover/item:bg-blue-500/20 group-hover/item:text-blue-200">
                                        {RESUME_TRANSLATION_COST} cr
                                    </span>
                                </button>
                            ))}
                        </div>
                    </details>

                    <button type="button" onClick={() => downloadResumePdf(previewResume)} className={toolButton}>
                        <Download size={15} className="transition-transform duration-200 group-hover:translate-y-0.5" />
                        Baixar PDF
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        disabled={!!busy}
                        className={`${toolButton} border-transparent bg-blue-600 text-white shadow-[0_10px_30px_rgba(122,59,255,0.28)] hover:bg-blue-500 hover:shadow-[0_12px_32px_rgba(122,59,255,0.45)]`}
                    >
                        {busy === "save" ? "Salvando..." : resumeId ? "Salvar" : "Criar currículo"}
                    </button>
                </div>
            </div>

            <div className="grid gap-6 xl:min-h-0 xl:flex-1 xl:grid-cols-2">
                <div className="min-w-0 xl:overflow-y-auto xl:pr-3">
                    {notice}
                    <FormErrorBanner errors={apiErrors} />

                    <div style={{ marginBottom: 20 }} className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
                        <div>
                            <label style={labelStyle}>Título do currículo *</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                placeholder="Ex: Currículo Dev Full Stack"
                                style={inputStyle(!!errors.title)}
                            />
                            {errors.title && <span style={errorStyle}>{errors.title}</span>}
                        </div>
                        <div>
                            <label style={labelStyle}>Modelo</label>
                            <select value={template} onChange={(e) => setTemplate(e.target.value as ResumeTemplate)} style={inputStyle()}>
                                {resumeTemplates.map((t) => <option key={t} value={t}>{resumeTemplateLabels[t]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Idioma do PDF</label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value as ResumeLanguage)} style={inputStyle()}>
                                {resumeLanguages.map((l) => <option key={l} value={l}>{resumeLanguageLabels[l]}</option>)}
                            </select>
                        </div>
                    </div>

                    <ResumeProgressBar progress={calcResumeProgress(form)} />

                    <ResumePersonalDetailsSection personalInfo={form.personalInfo} errors={errors} onChange={setPersonal} />

                    <ResumeWorkExperienceSection
                        experience={form.experience}
                        onChange={(i, field, value) => setItem("experience", i, field, value)}
                        onAdd={() => setForm((f) => ({ ...f, experience: [...f.experience, { ...emptyExperience }] }))}
                        onRemove={(i) => setForm((f) => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }))}
                    />

                    <ResumeSkillsSection
                        skills={form.skills}
                        onAdd={(skill) => setForm((f) => (f.skills.includes(skill) ? f : { ...f, skills: [...f.skills, skill] }))}
                        onRemove={(skill) => setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }))}
                    />

                    <ResumeEducationSection
                        education={form.education}
                        onChange={(i, field, value) => setItem("education", i, field, value)}
                        onAdd={() => setForm((f) => ({ ...f, education: [...f.education, { ...emptyEducation }] }))}
                        onRemove={(i) => setForm((f) => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }))}
                    />

                    <ResumeIdiomsSection
                        idioms={form.idioms}
                        onChange={(i, field, value) => setItem("idioms", i, field, value)}
                        onAdd={() => setForm((f) => ({ ...f, idioms: [...f.idioms, { ...emptyIdiom }] }))}
                        onRemove={(i) => setForm((f) => ({ ...f, idioms: f.idioms.filter((_, idx) => idx !== i) }))}
                    />
                </div>

                <div className="flex min-w-0 flex-col gap-3 xl:min-h-0">
                    {preview?.truncated && (
                        <div className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <span>
                                O currículo passou de 1 página mesmo com a fonte reduzida e o final foi cortado — inclusive no
                                PDF enviado nas candidaturas. Encurte descrições ou remova itens até o aviso sumir.
                            </span>
                        </div>
                    )}
                    <div className="flex shrink-0 items-center justify-end gap-1 self-end rounded-xl border border-line-strong bg-surface p-1">
                        <button type="button" title="Diminuir zoom" aria-label="Diminuir zoom" className={zoomButton} onClick={() => stepZoom(-10)}>
                            <ZoomOut size={15} />
                        </button>
                        <span className="inline-flex h-[30px] min-w-[52px] items-center justify-center text-xs font-semibold text-slate-300">
                            {typeof zoom === "number" ? `${zoom}%` : zoom === "width" ? "Largura" : "Página"}
                        </span>
                        <button type="button" title="Aumentar zoom" aria-label="Aumentar zoom" className={zoomButton} onClick={() => stepZoom(10)}>
                            <ZoomIn size={15} />
                        </button>
                        <button type="button" title="Ajustar à largura" aria-label="Ajustar à largura" className={`${zoomButton} ${zoom === "width" ? "bg-blue-500/15 text-blue-300" : ""}`} onClick={() => setZoom("width")}>
                            <MoveHorizontal size={15} />
                        </button>
                        <button type="button" title="Página inteira" aria-label="Página inteira" className={`${zoomButton} ${zoom === "page" ? "bg-blue-500/15 text-blue-300" : ""}`} onClick={() => setZoom("page")}>
                            <Maximize size={15} />
                        </button>
                    </div>
                    <div ref={previewBox} className="h-[80vh] overflow-hidden rounded-xl border border-line-strong bg-[#525659] xl:h-auto xl:min-h-0 xl:flex-1">
                        {preview ? (
                            // key: o visualizador nativo ignora mudança só no #hash; remonta para aplicar o zoom.
                            <iframe key={`${preview.url}-${zoom}`} src={`${preview.url}#toolbar=0&navpanes=0&${viewerParams}`} title="Pré-visualização do currículo" className="h-full w-full" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-slate-300">Gerando pré-visualização...</div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmLeave}
                title="Sair sem salvar?"
                description="As alterações feitas desde o último salvamento serão perdidas."
                confirmLabel="Sair"
                cancelLabel="Continuar editando"
                danger
                onCancel={() => setConfirmLeave(false)}
                onConfirm={() => router.push("/curriculos")}
            />
        </div>
    );
}
