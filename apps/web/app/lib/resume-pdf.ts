import { jsPDF } from "jspdf";
import type { Resume, ResumeEducation, ResumeExperience, ResumeLanguage, ResumePersonalInfo } from "../types/resume";

// Gerador ÚNICO do PDF do currículo: alimenta o preview do editor, o botão de download
// e o `GET /api/resumes/[id]/pdf` que o runner baixa para anexar na candidatura.
// O que o usuário vê é literalmente o arquivo que o empregador recebe.
//
// Sempre UMA página: reduz a escala da fonte até caber e, se nem no piso couber,
// corta o excesso e devolve `truncated` para o editor avisar. Nunca chama addPage.
//
// Harvard (padrão) é coluna única de propósito: quem lê este PDF primeiro é o parser
// ATS do LinkedIn/InfoJobs, e duas colunas embaralham a ordem do texto extraído. O
// modelo de duas colunas é opt-in e desenha a coluna esquerda inteira antes da direita
// para a extração sair na ordem de leitura.

type RGB = [number, number, number];
type Font = "times" | "helvetica";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - MARGIN;
const PT_TO_MM = 0.3528;
// ponytail: degraus fixos de escala; busca binária se 6 renders ficarem lentos no preview
const FONT_SCALES = [1, 0.94, 0.88, 0.82, 0.76, 0.7];

const BLACK: RGB = [17, 17, 17];
const INK: RGB = [18, 33, 46];
const BODY: RGB = [44, 52, 64];
const MUTED: RGB = [96, 108, 122];
const BLUE: RGB = [30, 110, 196];

const I18N: Record<
    ResumeLanguage,
    {
        summary: string; experience: string; education: string; skills: string; languages: string;
        certifications: string; contact: string; present: string; phone: string; location: string;
        months: string[]; levels: Record<string, string>;
    }
> = {
    pt: {
        summary: "Resumo", experience: "Experiência", education: "Formação", skills: "Competências",
        languages: "Idiomas", certifications: "Certificações", contact: "Contato", present: "Atual",
        phone: "Telefone", location: "Local",
        months: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
        levels: {},
    },
    en: {
        summary: "Summary", experience: "Experience", education: "Education", skills: "Skills",
        languages: "Languages", certifications: "Certifications", contact: "Contact", present: "Present",
        phone: "Phone", location: "Location",
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        levels: { Básico: "Basic", Intermediário: "Intermediate", Avançado: "Advanced", Fluente: "Fluent", Nativo: "Native" },
    },
    es: {
        summary: "Resumen", experience: "Experiencia", education: "Formación", skills: "Habilidades",
        languages: "Idiomas", certifications: "Certificaciones", contact: "Contacto", present: "Actual",
        phone: "Teléfono", location: "Ubicación",
        months: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
        levels: { Intermediário: "Intermedio", Avançado: "Avanzado", Fluente: "Fluido" },
    },
};

type Labels = (typeof I18N)[ResumeLanguage];

// O JSONB de `resumes` grava os nomes do form (`companyName`, `jobArea`,
// `nameOfGraduation`…), mas o tipo aceita os curtos também. Ler a chave errada é
// silencioso — já custou um PDF sem empresa, sem cargo e sem datas —, então a
// tradução fica aqui, num lugar só.
const pick = (...values: Array<string | null | undefined>) => values.find((v) => v)?.trim() ?? "";

// "2025-06" -> "jun 2025". Formato desconhecido volta como veio.
function fmtDate(t: Labels, value: string): string {
    const m = value.match(/^(\d{4})-(\d{2})/);
    if (!m) return value;
    const month = Number(m[2]);
    return month >= 1 && month <= 12 ? `${t.months[month - 1]} ${m[1]}` : value;
}

function period(t: Labels, start: string, end: string, current?: boolean): string {
    const from = start ? fmtDate(t, start) : "";
    const to = current ? t.present : end ? fmtDate(t, end) : "";
    if (from && to) return `${from} – ${to}`;
    return from || to;
}

// "https://www.linkedin.com/in/fulano/" -> "linkedin.com/in/fulano": cabe numa linha
// e o protocolo não acrescenta nada em papel.
const shortUrl = (value: string) => value.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

/** Quebra a descrição em linhas; `-`/`•`/`*` no início vira marcador. O `\n` literal
 *  (barra + n) aparece em currículos importados e é tratado como quebra real. */
export function descriptionLines(value: string): { bullet: boolean; text: string }[] {
    return value
        .replace(/\\n/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({ bullet: /^[-•*]\s*/.test(line), text: line.replace(/^[-•*]\s*/, "") }));
}

function readResume(resume: Resume) {
    const t = I18N[resume.language ?? "pt"] ?? I18N.pt;
    const p: ResumePersonalInfo = resume.personalInfo ?? {};
    const experience = (resume.experience ?? [])
        .map((e: ResumeExperience) => ({
            // `jobArea` é o campo de cargo do form; `jobType` é vínculo (CLT/PJ) e não título.
            role: pick(e.jobArea, e.position),
            company: pick(e.companyName, e.company),
            when: period(t, pick(e.jobStartDate, e.startDate), pick(e.jobEndDate, e.endDate), e.isActualJob ?? e.current),
            lines: descriptionLines(pick(e.description)),
        }))
        .filter((e) => e.role || e.company);
    const education = (resume.education ?? [])
        .map((ed: ResumeEducation) => ({
            course: pick(ed.nameOfGraduation, ed.degree),
            institution: pick(ed.nameOfInstitution, ed.institution),
            when: period(t, pick(ed.StartDateOfGraduation, ed.startDate), pick(ed.EndDateOfGraduation, ed.endDate)),
        }))
        .filter((ed) => ed.course || ed.institution);

    return {
        t,
        name: pick(p.name, resume.title),
        jobTitle: pick(p.jobTitle),
        summary: pick(p.professionalSummary, p.summary),
        location: pick(p.address, p.location),
        phone: pick(p.contact, p.phone),
        email: pick(p.email),
        links: [
            { label: "LinkedIn", value: shortUrl(pick(p.linkedinUrl, p.linkedin)) },
            { label: "GitHub", value: shortUrl(pick(p.github)) },
            { label: "Portfolio", value: shortUrl(pick(p.portfolio)) },
        ].filter((l) => l.value),
        experience,
        education,
        skills: (resume.skills ?? []).map((s) => s.trim()).filter(Boolean),
        idioms: (resume.idioms ?? [])
            .filter((i) => i.language)
            .map((i) => ({ language: i.language, level: i.level ? (t.levels[i.level] ?? i.level) : "" })),
        certifications: (resume.experience ?? []).flatMap((e) => e.certifications ?? []).map((c) => pick(c.titulo)).filter(Boolean),
    };
}

type TextStyle = { size: number; color: RGB; bold?: boolean; italic?: boolean; align?: "left" | "center" | "justify"; font?: Font };

/** Cursor vertical numa faixa da página. Ao estourar o rodapé, marca `overflow` e
 *  ignora o resto: o renderer tenta de novo numa escala menor. */
class Column {
    overflow = false;

    constructor(
        private doc: jsPDF,
        private font: Font,
        private scale: number,
        readonly x: number,
        readonly w: number,
        public y = MARGIN,
    ) {}

    private lh(size: number) {
        return size * this.scale * PT_TO_MM * 1.28;
    }

    private use(s: TextStyle) {
        const style = s.bold && s.italic ? "bolditalic" : s.bold ? "bold" : s.italic ? "italic" : "normal";
        this.doc.setFont(s.font ?? this.font, style);
        this.doc.setFontSize(s.size * this.scale);
        this.doc.setTextColor(...s.color);
    }

    private room(h: number) {
        if (this.overflow || this.y + h > BOTTOM) {
            this.overflow = true;
            return false;
        }
        return true;
    }

    gap(mm: number) {
        this.y += mm * this.scale;
    }

    text(value: string, s: TextStyle, indent = 0) {
        if (!value) return;
        this.use(s);
        const width = this.w - indent;
        const lines = this.doc.splitTextToSize(value, width) as string[];
        lines.forEach((line, i) => {
            if (!this.room(this.lh(s.size))) return;
            const last = i === lines.length - 1;
            if (s.align === "center") {
                this.doc.text(line, this.x + this.w / 2, this.y, { align: "center", baseline: "top" });
            } else {
                // justify na última linha esticaria as palavras até a margem.
                const align = s.align === "justify" && !last ? "justify" : "left";
                this.doc.text(line, this.x + indent, this.y, { align, maxWidth: width, baseline: "top" });
            }
            this.y += this.lh(s.size);
        });
    }

    bullet(value: string, s: TextStyle) {
        if (!this.room(this.lh(s.size))) return;
        this.use(s);
        this.doc.text("•", this.x + 1.2, this.y, { baseline: "top" });
        this.text(value, s, 4.5);
    }

    /** Texto à esquerda + texto colado na margem direita, na mesma linha. */
    row(left: string, right: string, s: TextStyle) {
        if (!this.room(this.lh(s.size))) return;
        this.use(s);
        const rightW = right ? this.doc.getTextWidth(right) + 3 : 0;
        if (right) this.doc.text(right, this.x + this.w, this.y, { align: "right", baseline: "top" });
        const lines = this.doc.splitTextToSize(left, this.w - rightW) as string[];
        this.doc.text(lines[0] ?? "", this.x, this.y, { baseline: "top" });
        this.y += this.lh(s.size);
        if (lines.length > 1) this.text(lines.slice(1).join(" "), s);
    }

    rule(color: RGB, width: number) {
        if (!this.room(1)) return;
        this.doc.setDrawColor(...color);
        this.doc.setLineWidth(width);
        this.doc.line(this.x, this.y, this.x + this.w, this.y);
    }
}

function renderHarvard(doc: jsPDF, resume: Resume, scale: number): boolean {
    const r = readResume(resume);
    const c = new Column(doc, "times", scale, MARGIN, CONTENT_W);
    const body: TextStyle = { size: 10.2, color: BLACK };

    const heading = (title: string) => {
        c.gap(3.2);
        c.text(title.toUpperCase(), { size: 11.5, color: BLACK, bold: true });
        c.gap(0.2);
        c.rule(BLACK, 0.3);
        c.gap(1.8);
    };

    c.text(r.name, { size: 22, color: BLACK, bold: true, align: "center" });
    c.gap(0.6);
    if (r.jobTitle) c.text(r.jobTitle, { size: 11, color: BLACK, align: "center" });
    const contacts = [r.location, r.phone, r.email, ...r.links.map((l) => l.value)].filter(Boolean).join("  |  ");
    c.text(contacts, { size: 9.2, color: BLACK, align: "center" });

    if (r.summary) {
        heading(r.t.summary);
        c.text(r.summary, { ...body, align: "justify" });
    }

    if (r.experience.length) {
        heading(r.t.experience);
        r.experience.forEach((e, i) => {
            if (i) c.gap(2);
            c.row([e.role, e.company].filter(Boolean).join(" | "), e.when, { size: 10.5, color: BLACK, bold: true });
            c.gap(0.6);
            for (const line of e.lines) c.bullet(line.text, body);
        });
    }

    if (r.education.length) {
        heading(r.t.education);
        r.education.forEach((ed, i) => {
            if (i) c.gap(1);
            c.row([ed.course, ed.institution].filter(Boolean).join(" | "), ed.when, { size: 10.5, color: BLACK, bold: true });
        });
    }

    if (r.skills.length) {
        heading(r.t.skills);
        c.text(r.skills.join(", "), body);
    }

    if (r.idioms.length) {
        heading(r.t.languages);
        c.text(r.idioms.map((i) => (i.level ? `${i.language} (${i.level})` : i.language)).join(", "), body);
    }

    if (r.certifications.length) {
        heading(r.t.certifications);
        for (const cert of r.certifications) c.bullet(cert, body);
    }

    return c.overflow;
}

function renderTwoColumn(doc: jsPDF, resume: Resume, scale: number): boolean {
    const r = readResume(resume);
    const GAP = 7;
    const leftW = CONTENT_W * 0.64;
    const left = new Column(doc, "helvetica", scale, MARGIN, leftW);
    const right = new Column(doc, "helvetica", scale, MARGIN + leftW + GAP, CONTENT_W - leftW - GAP);
    const body: TextStyle = { size: 9.4, color: BODY };
    const side: TextStyle = { size: 8.8, color: BODY };

    const heading = (c: Column, title: string) => {
        c.gap(3.4);
        c.text(title.toUpperCase(), { size: 11, color: BLUE, bold: true });
        c.gap(1);
    };

    // ---- Coluna esquerda
    left.text(r.name, { size: 26, color: INK, bold: true, font: "times" });
    left.gap(0.8);
    if (r.jobTitle) left.text(r.jobTitle, { size: 12.5, color: INK, bold: true });
    if (r.summary) {
        left.gap(1.6);
        left.text(r.summary, { ...body, align: "justify" });
    }
    if (r.experience.length) {
        heading(left, r.t.experience);
        r.experience.forEach((e, i) => {
            if (i) left.gap(2.6);
            left.text([e.company, e.role].filter(Boolean).join(" — "), { size: 9.8, color: INK, bold: true });
            if (e.when) left.text(e.when, { size: 8.8, color: MUTED });
            left.gap(0.6);
            for (const line of e.lines) {
                if (line.bullet) left.bullet(line.text, body);
                else left.text(line.text, { ...body, align: "justify" });
            }
        });
    }

    // ---- Coluna direita
    const contacts = [
        ...r.links,
        { label: r.t.phone, value: r.phone },
        { label: "E-mail", value: r.email },
        { label: r.t.location, value: r.location },
    ].filter((l) => l.value);
    if (contacts.length) {
        heading(right, r.t.contact);
        for (const link of contacts) {
            right.text(`${link.label}:`, { ...side, color: INK, bold: true });
            right.text(link.value, { ...side, color: BLUE });
            right.gap(0.8);
        }
    }
    if (r.skills.length) {
        heading(right, r.t.skills);
        right.text(r.skills.join(" · "), side);
    }
    if (r.education.length) {
        heading(right, r.t.education);
        r.education.forEach((ed, i) => {
            if (i) right.gap(1.4);
            if (ed.institution) right.text(ed.institution, { ...side, color: INK, bold: true });
            right.text([ed.course, ed.when && `(${ed.when})`].filter(Boolean).join(" "), side);
        });
    }
    if (r.idioms.length) {
        heading(right, r.t.languages);
        for (const i of r.idioms) right.text(i.level ? `${i.language}: ${i.level}` : i.language, { ...side, color: INK, bold: true });
    }
    if (r.certifications.length) {
        heading(right, r.t.certifications);
        for (const cert of r.certifications) right.bullet(cert, side);
    }

    return left.overflow || right.overflow;
}

/** PDF de uma página + se o conteúdo precisou ser cortado mesmo na menor escala. */
export function renderResumePdf(resume: Resume): { doc: jsPDF; truncated: boolean } {
    const render = resume.template === "two-column" ? renderTwoColumn : renderHarvard;
    let doc!: jsPDF;
    for (const scale of FONT_SCALES) {
        doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
        if (!render(doc, resume, scale)) return { doc, truncated: false };
    }
    return { doc, truncated: true };
}

export function resumeFileName(resume: Resume): string {
    const raw = pick(resume.personalInfo?.name, resume.title, "curriculo");
    return `${raw.replace(/[^\w\-À-ÿ ]/g, "").trim() || "curriculo"}.pdf`;
}

/** Bytes do PDF — usado pela API que serve o arquivo para o runner. */
export function buildResumePdf(resume: Resume): Uint8Array {
    return new Uint8Array(renderResumePdf(resume).doc.output("arraybuffer"));
}

/** Baixa direto no navegador, sem abrir janela nem diálogo de impressão. */
export function downloadResumePdf(resume: Resume): void {
    renderResumePdf(resume).doc.save(resumeFileName(resume));
}
