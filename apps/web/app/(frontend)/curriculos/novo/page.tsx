"use client";

import { useEffect, useState } from "react";
import { emptyResumeForm, RESUME_IMPORT_STORAGE_KEY } from "../../../lib/constants/resume-form";
import { ResumeEditor } from "../../../components/organisms/ResumeEditor";
import type { ResumeFormData } from "../../../types/resume-form";

export default function NovoResumePage() {
    const [draft, setDraft] = useState<{ form: ResumeFormData; imported: boolean } | null>(null);

    // Currículo importado de PDF: consome o rascunho uma única vez. Fica no efeito
    // (não no useState inicial) porque sessionStorage não existe no render do servidor.
    useEffect(() => {
        const raw = sessionStorage.getItem(RESUME_IMPORT_STORAGE_KEY);
        sessionStorage.removeItem(RESUME_IMPORT_STORAGE_KEY);
        try {
            setDraft(raw ? { form: { ...emptyResumeForm, ...(JSON.parse(raw) as ResumeFormData) }, imported: true } : { form: emptyResumeForm, imported: false });
        } catch {
            // rascunho corrompido: segue com o formulário vazio
            setDraft({ form: emptyResumeForm, imported: false });
        }
    }, []);

    if (!draft) return null;

    return (
        <ResumeEditor
            initial={{ form: draft.form, template: "harvard", language: "pt" }}
            notice={
                draft.imported && (
                    <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 12, border: "1px solid rgb(var(--c-sky-400) / 0.3)", background: "rgb(var(--c-sky-400) / 0.1)", color: "rgb(var(--c-sky-300))", fontSize: 14 }}>
                        Dados preenchidos a partir do seu PDF pela IA. Revise tudo antes de salvar — datas e contatos costumam precisar de ajuste.
                    </div>
                )
            }
        />
    );
}
