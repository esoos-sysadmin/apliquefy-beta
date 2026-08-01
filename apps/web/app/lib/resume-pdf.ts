import { jsPDF } from "jspdf";
import type { Resume, ResumeEducation, ResumeExperience, ResumePersonalInfo } from "../types/resume";

// Gerador ÚNICO do PDF do currículo: alimenta tanto o botão de download do painel
// quanto o `GET /api/resumes/[id]/pdf` que o runner baixa para anexar na candidatura.
// O que o usuário vê é literalmente o arquivo que o empregador recebe.
//
// Coluna única de propósito: quem lê este PDF primeiro é o parser ATS do
// LinkedIn/InfoJobs, e layout de duas colunas embaralha a ordem do texto extraído.
// O visual fica na hierarquia tipográfica, no espaçamento e nas réguas.

type RGB = [number, number, number];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - MARGIN;

const INK: RGB = [18, 33, 46];
const ACCENT: RGB = [27, 79, 114];
const MUTED: RGB = [91, 107, 122];
const BODY: RGB = [44, 62, 80];
const RULE: RGB = [211, 218, 225];
const CHIP_BG: RGB = [238, 243, 248];

const PT_TO_MM = 0.3528;
const lineHeight = (size: number) => size * PT_TO_MM * 1.32;

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// "2025-06" -> "jun 2025". Formato desconhecido volta como veio.
function fmtDate(value?: string | null): string {
    if (!value) return "";
    const m = String(value).match(/^(\d{4})-(\d{2})/);
    if (!m) return String(value);
    const month = Number(m[2]);
    return month >= 1 && month <= 12 ? `${MONTHS[month - 1]} ${m[1]}` : String(value);
}

function period(start?: string | null, end?: string | null, current?: boolean): string {
    const from = fmtDate(start);
    const to = current ? "Atual" : fmtDate(end);
    if (from && to) return `${from} – ${to}`;
    return from || to || "";
}

// O JSONB de `resumes` grava os nomes do form (`companyName`, `jobArea`,
// `nameOfGraduation`…), mas o tipo aceita os curtos também. Ler a chave errada é
// silencioso — já custou um PDF sem empresa, sem cargo e sem datas —, então a
// tradução fica aqui, num lugar só.
const pick = (...values: Array<string | null | undefined>) => values.find((v) => v)?.trim() ?? "";

const expFields = (e: ResumeExperience) => ({
    // `jobArea` é o campo de cargo do form; `jobType` é vínculo (CLT/PJ) e não título.
    role: pick(e.jobArea, e.position),
    company: pick(e.companyName, e.company),
    jobType: pick(e.jobType),
    when: period(pick(e.jobStartDate, e.startDate), pick(e.jobEndDate, e.endDate), e.isActualJob ?? e.current),
    description: pick(e.description),
});

const eduFields = (ed: ResumeEducation) => ({
    course: pick(ed.nameOfGraduation, ed.degree),
    institution: pick(ed.nameOfInstitution, ed.institution),
    when: period(pick(ed.StartDateOfGraduation, ed.startDate), pick(ed.EndDateOfGraduation, ed.endDate)),
});

// "https://www.linkedin.com/in/fulano/" -> "linkedin.com/in/fulano": a linha de contato
// cabe numa linha só e o protocolo não acrescenta nada em papel.
const shortUrl = (value: string) => value.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

const contactLine = (p: ResumePersonalInfo) =>
    [
        pick(p.address, p.location),
        pick(p.contact, p.phone),
        pick(p.email),
        ...[pick(p.linkedinUrl, p.linkedin), pick(p.github), pick(p.portfolio)].map(shortUrl),
    ]
        .filter(Boolean)
        .join("   ·   ");

function buildDoc(resume: Resume): jsPDF {
    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
    const p = resume.personalInfo ?? {};
    let y = MARGIN;

    const wrap = (value: string, size: number, width = CONTENT_W): string[] => {
        doc.setFontSize(size);
        return doc.splitTextToSize(value, width) as string[];
    };

    const newPage = () => {
        doc.addPage();
        y = MARGIN;
    };

    const write = (
        value: string,
        size: number,
        color: RGB,
        opts: { bold?: boolean; gap?: number; justify?: boolean; width?: number } = {},
    ) => {
        doc.setFont("helvetica", opts.bold ? "bold" : "normal");
        doc.setTextColor(...color);
        const lines = wrap(value, size, opts.width);
        for (const line of lines) {
            if (y + lineHeight(size) > BOTTOM) newPage();
            // justify na última linha esticaria as palavras até a margem.
            const align = opts.justify && line !== lines[lines.length - 1] ? "justify" : "left";
            doc.text(line, MARGIN, y, { align, maxWidth: opts.width ?? CONTENT_W });
            y += lineHeight(size);
        }
        y += opts.gap ?? 0;
    };

    const heading = (title: string) => {
        if (y + 14 > BOTTOM) newPage();
        y += 4.5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.4);
        doc.setTextColor(...ACCENT);
        doc.setCharSpace(0.35);
        doc.text(title.toUpperCase(), MARGIN, y);
        doc.setCharSpace(0);
        y += 1.8;
        doc.setDrawColor(...RULE);
        doc.setLineWidth(0.25);
        doc.line(MARGIN, y, PAGE_W - MARGIN, y);
        y += 4.2;
    };

    /** Título + período na mesma linha, período colado na margem direita. */
    const entry = (title: string, subtitle: string, when: string, description: string) => {
        const titleLines = wrap(title, 10.2, CONTENT_W * 0.72);
        // Cabeçalho e a primeira linha da descrição não se separam entre páginas.
        const needed = titleLines.length * lineHeight(10.2) + (subtitle ? lineHeight(9) : 0) + (description ? lineHeight(9.2) : 0);
        if (y + needed > BOTTOM) newPage();

        if (when) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(...MUTED);
            doc.text(when, PAGE_W - MARGIN, y, { align: "right" });
        }
        write(title, 10.2, INK, { bold: true, width: CONTENT_W * 0.72 });
        if (subtitle) write(subtitle, 9, MUTED, { gap: 0.6 });
        if (description) write(description, 9.2, BODY, { justify: true });
        y += 3;
    };

    /** Skills como chips: bloco denso e legível sem virar parede de vírgulas. */
    const chips = (labels: string[]) => {
        const H = 5.2;
        const PAD = 2.4;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.6);
        let x = MARGIN;
        for (const label of labels) {
            const w = doc.getTextWidth(label) + PAD * 2;
            if (x + w > PAGE_W - MARGIN) {
                x = MARGIN;
                y += H + 1.8;
            }
            if (y + H > BOTTOM) newPage();
            doc.setFillColor(...CHIP_BG);
            doc.roundedRect(x, y - H + 1.5, w, H, 1.2, 1.2, "F");
            doc.setTextColor(...ACCENT);
            doc.text(label, x + PAD, y);
            x += w + 1.8;
        }
        y += H;
    };

    // ---- Cabeçalho
    write(pick(p.name, resume.title), 21, INK, { bold: true, gap: 0.8 });
    const role = [pick(p.jobTitle), pick(p.seniority)].filter(Boolean).join(" · ");
    if (role) write(role, 11.5, ACCENT, { gap: 1.2 });
    const contacts = contactLine(p);
    if (contacts) write(contacts, 8.2, MUTED, { gap: 1.6 });
    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 2;

    // ---- Seções
    const summary = pick(p.professionalSummary, p.summary);
    if (summary) {
        heading("Resumo");
        write(summary, 9.2, BODY, { justify: true });
    }

    const experience = (resume.experience ?? []).map(expFields).filter((e) => e.role || e.company);
    if (experience.length) {
        heading("Experiência");
        for (const e of experience) {
            const subtitle = [e.company, e.jobType].filter(Boolean).join("  ·  ");
            entry(e.role || e.company, e.role ? subtitle : e.jobType, e.when, e.description);
        }
    }

    const education = (resume.education ?? []).map(eduFields).filter((ed) => ed.course || ed.institution);
    if (education.length) {
        heading("Formação");
        for (const ed of education) entry(ed.course || ed.institution, ed.course ? ed.institution : "", ed.when, "");
    }

    const skills = (resume.skills ?? []).filter(Boolean);
    if (skills.length) {
        heading("Competências");
        chips(skills);
    }

    const idioms = (resume.idioms ?? []).filter((i) => i.language);
    if (idioms.length) {
        heading("Idiomas");
        write(idioms.map((i) => (i.level ? `${i.language} — ${i.level}` : i.language)).join("   ·   "), 9.2, BODY);
    }

    const certifications = (resume.experience ?? []).flatMap((e) => e.certifications ?? []).map((c) => pick(c.titulo)).filter(Boolean);
    if (certifications.length) {
        heading("Certificações");
        write(certifications.join("   ·   "), 9.2, BODY);
    }

    // Numeração só faz sentido depois de saber quantas páginas saíram.
    const pages = doc.getNumberOfPages();
    if (pages > 1) {
        for (let i = 1; i <= pages; i++) {
            doc.setPage(i);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(...MUTED);
            doc.text(`${i}/${pages}`, PAGE_W - MARGIN, PAGE_H - 8, { align: "right" });
        }
    }

    return doc;
}

export function resumeFileName(resume: Resume): string {
    const raw = pick(resume.personalInfo?.name, resume.title, "curriculo");
    return `${raw.replace(/[^\w\-À-ÿ ]/g, "").trim() || "curriculo"}.pdf`;
}

/** Bytes do PDF — usado pela API que serve o arquivo para o runner. */
export function buildResumePdf(resume: Resume): Uint8Array {
    return new Uint8Array(buildDoc(resume).output("arraybuffer"));
}

/** Baixa direto no navegador, sem abrir janela nem diálogo de impressão. */
export function downloadResumePdf(resume: Resume): void {
    buildDoc(resume).save(resumeFileName(resume));
}
