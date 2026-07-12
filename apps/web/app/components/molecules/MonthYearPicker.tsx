"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearPickerProps {
    value: string;
    onChange: (value: string) => void;
    onOpen?: () => void;
    placeholder?: string;
    readOnly?: boolean;
    disabled?: boolean;
    minYear?: number;
    maxYear?: number;
}

const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function parseValue(value: string): { year: number; month: number } | null {
    const match = /^(\d{4})-(\d{2})$/.exec(value);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (month < 1 || month > 12) return null;
    return { year, month };
}

function formatDisplay(value: string): string {
    const parsed = parseValue(value);
    if (!parsed) return "";
    return `${MONTHS_PT[parsed.month - 1]} ${parsed.year}`;
}

export function MonthYearPicker({
    value,
    onChange,
    onOpen,
    placeholder = "Selecione mês e ano",
    readOnly = false,
    disabled = false,
    minYear = 1960,
    maxYear,
}: MonthYearPickerProps) {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<"month" | "year">("month");
    const today = new Date();
    const currentYear = today.getFullYear();
    const upperYear = maxYear ?? currentYear + 5;

    const parsed = parseValue(value);
    const [viewYear, setViewYear] = useState<number>(parsed?.year ?? currentYear);
    const [yearPageStart, setYearPageStart] = useState<number>(() => {
        const base = parsed?.year ?? currentYear;
        return base - (base % 12);
    });

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function onClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    useEffect(() => {
        if (open && parsed) {
            setViewYear(parsed.year);
            setYearPageStart(parsed.year - (parsed.year % 12));
        }
    }, [open, parsed]);

    function handleTriggerClick() {
        if (readOnly || disabled) return;
        onOpen?.();
        setOpen((v) => !v);
        setView("month");
    }

    function selectMonth(monthIndex: number) {
        const mm = String(monthIndex + 1).padStart(2, "0");
        onChange(`${viewYear}-${mm}`);
        setOpen(false);
    }

    const yearGrid = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => yearPageStart + i);
    }, [yearPageStart]);

    const display = formatDisplay(value);

    return (
        <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
            <button
                type="button"
                onClick={handleTriggerClick}
                disabled={disabled}
                style={{
                    width: "100%",
                    height: 44,
                    padding: "0 14px",
                    borderRadius: 12,
                    border: "1px solid #263149",
                    background: readOnly || disabled ? "#0E1623" : "#101826",
                    color: display ? "#fff" : "#64748b",
                    fontSize: 14,
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: readOnly || disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                    transition: "border-color 0.15s ease",
                    outline: "none",
                }}
                onFocus={(e) => {
                    if (!readOnly && !disabled) e.currentTarget.style.borderColor = "#3B82F6";
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#263149";
                }}
            >
                <span>{display || placeholder}</span>
                <Calendar size={16} color="#64748b" />
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        zIndex: 50,
                        width: 280,
                        background: "#131B2A",
                        border: "1px solid #263149",
                        borderRadius: 12,
                        padding: 12,
                        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <button
                            type="button"
                            onClick={() => {
                                if (view === "month") setViewYear((y) => Math.max(minYear, y - 1));
                                else setYearPageStart((s) => Math.max(minYear, s - 12));
                            }}
                            style={iconBtnStyle}
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setView((v) => (v === "month" ? "year" : "month"))}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                                padding: "4px 10px",
                                borderRadius: 6,
                            }}
                        >
                            {view === "month" ? viewYear : `${yearPageStart} – ${yearPageStart + 11}`}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (view === "month") setViewYear((y) => Math.min(upperYear, y + 1));
                                else setYearPageStart((s) => Math.min(upperYear - 11, s + 12));
                            }}
                            style={iconBtnStyle}
                            aria-label="Próximo"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {view === "month" ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                            {MONTHS_PT.map((label, idx) => {
                                const selected = parsed?.year === viewYear && parsed.month === idx + 1;
                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => selectMonth(idx)}
                                        style={cellStyle(selected)}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                            {yearGrid.map((y) => {
                                const disabledYear = y < minYear || y > upperYear;
                                const selected = parsed?.year === y;
                                return (
                                    <button
                                        key={y}
                                        type="button"
                                        disabled={disabledYear}
                                        onClick={() => {
                                            setViewYear(y);
                                            setView("month");
                                        }}
                                        style={cellStyle(selected, disabledYear)}
                                    >
                                        {y}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #263149" }}>
                        <button
                            type="button"
                            onClick={() => {
                                onChange("");
                                setOpen(false);
                            }}
                            style={textBtnStyle}
                        >
                            Limpar
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const mm = String(today.getMonth() + 1).padStart(2, "0");
                                onChange(`${today.getFullYear()}-${mm}`);
                                setOpen(false);
                            }}
                            style={textBtnStyle}
                        >
                            Hoje
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const iconBtnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    width: 28,
    borderRadius: 6,
    border: "1px solid #263149",
    background: "#101826",
    color: "#cbd5e1",
    cursor: "pointer",
};

function cellStyle(selected: boolean, disabled = false): React.CSSProperties {
    return {
        height: 36,
        borderRadius: 8,
        border: selected ? "1px solid #2563EB" : "1px solid transparent",
        background: selected ? "#1d4ed8" : "transparent",
        color: disabled ? "#475569" : selected ? "#fff" : "#cbd5e1",
        fontSize: 13,
        fontWeight: selected ? 600 : 500,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.15s ease, border-color 0.15s ease",
    };
}

const textBtnStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    padding: "4px 6px",
    borderRadius: 4,
};
