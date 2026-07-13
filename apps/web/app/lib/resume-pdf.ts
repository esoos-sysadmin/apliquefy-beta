import { jsPDF } from "jspdf";
import type { Resume } from "../types/resume";

// Gera um PDF A4 do currículo e baixa direto (doc.save) — sem abrir janela
// nem diálogo de impressão.

// "2026-07" -> "07/2026"; vazio -> ""
function fmtDate(value?: string | null): string {
    if (!value) return "";
    const m = String(value).match(/^(\d{4})-(\d{2})/);
    return m ? `${m[2]}/${m[1]}` : String(value);
}

function period(start?: string | null, end?: string | null, current?: boolean): string {
    const from = fmtDate(start);
    const to = current ? "Atual" : fmtDate(end);
    if (from && to) return `${from} — ${to}`;
    return from || to || "";
}

const BLUE: [number, number, number] = [37, 99, 235];
const DARK: [number, number, number] = [26, 26, 26];
const GRAY: [number, number, number] = [90, 90, 90];
const MARGIN = 16;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - MARGIN;

export function downloadResumePdf(resume: Resume): void {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const p = resume.personalInfo ?? {};
    let y = MARGIN;

    // garante espaço; senão, nova página
    const ensure = (needed: number) => {
        if (y + needed > BOTTOM) {
            doc.addPage();
            y = MARGIN;
        }
    };

    const text = (
        value: string,
        size: number,
        color: [number, number, number],
        opts: { bold?: boolean; align?: "left" | "right"; x?: number; gap?: number } = {},
    ) => {
        doc.setFont("helvetica", opts.bold ? "bold" : "normal");
        doc.setFontSize(size);
        doc.setTextColor(...color);
        const x = opts.x ?? MARGIN;
        const lines = doc.splitTextToSize(value, CONTENT_W);
        ensure(lines.length * size * 0.42 + (opts.gap ?? 0));
        doc.text(lines, opts.align === "right" ? PAGE_W - MARGIN : x, y, { align: opts.align ?? "left" });
        y += lines.length * size * 0.42 + (opts.gap ?? 1.5);
    };

    const heading = (title: string) => {
        ensure(10);
        y += 3;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(...BLUE);
        doc.text(title.toUpperCase(), MARGIN, y);
        y += 1.5;
        doc.setDrawColor(220, 224, 230);
        doc.setLineWidth(0.3);
        doc.line(MARGIN, y, PAGE_W - MARGIN, y);
        y += 4;
    };

    // Cabeçalho
    text(p.name || resume.title, 20, DARK, { bold: true, gap: 1 });
    const role = [p.jobTitle, p.seniority].filter(Boolean).join(" · ");
    if (role) text(role, 11, BLUE, { bold: true, gap: 1 });
    const contacts = [p.email, p.contact || p.phone, p.address || p.location, p.linkedinUrl || p.linkedin, p.portfolio, p.github]
        .filter(Boolean)
        .join("   ·   ");
    if (contacts) text(contacts, 8.5, GRAY, { gap: 2 });
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 4;

    // Resumo
    const summary = p.professionalSummary || p.summary;
    if (summary) {
        heading("Resumo");
        text(summary, 9.5, [51, 51, 51]);
    }

    // Experiência
    const experience = (resume.experience ?? []).filter((e) => e.jobType || e.position || e.companyName || e.company);
    if (experience.length) {
        heading("Experiência");
        for (const e of experience) {
            const roleLine = [e.jobType || e.position, e.companyName || e.company].filter(Boolean).join(" — ");
            const when = period(e.jobStartDate || e.startDate, e.jobEndDate || e.endDate, e.isActualJob ?? e.current);
            ensure(6);
            const yTop = y;
            text(roleLine, 10.5, DARK, { bold: true, gap: 0.5 });
            if (when) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.setTextColor(...GRAY);
                doc.text(when, PAGE_W - MARGIN, yTop, { align: "right" });
            }
            if (e.description) text(e.description, 9.5, [51, 51, 51], { gap: 2 });
            else y += 2;
        }
    }

    // Formação
    const education = (resume.education ?? []).filter((ed) => ed.nameOfGraduation || ed.degree || ed.nameOfInstitution || ed.institution);
    if (education.length) {
        heading("Formação");
        for (const ed of education) {
            const line = [ed.nameOfGraduation || ed.degree, ed.nameOfInstitution || ed.institution].filter(Boolean).join(" — ");
            const when = period(ed.StartDateOfGraduation || ed.startDate, ed.EndDateOfGraduation || ed.endDate);
            ensure(6);
            const yTop = y;
            text(line, 10.5, DARK, { bold: true, gap: 2 });
            if (when) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.setTextColor(...GRAY);
                doc.text(when, PAGE_W - MARGIN, yTop, { align: "right" });
            }
        }
    }

    // Competências
    const skills = resume.skills ?? [];
    if (skills.length) {
        heading("Competências");
        text(skills.join("   ·   "), 9.5, [51, 51, 51]);
    }

    // Idiomas
    const idioms = (resume.idioms ?? []).filter((i) => i.language);
    if (idioms.length) {
        heading("Idiomas");
        text(idioms.map((i) => (i.level ? `${i.language} — ${i.level}` : i.language)).join("   ·   "), 9.5, [51, 51, 51]);
    }

    const safeName = (resume.title || p.name || "curriculo").replace(/[^\w\-À-ÿ ]/g, "").trim() || "curriculo";
    doc.save(`${safeName}.pdf`);
}
