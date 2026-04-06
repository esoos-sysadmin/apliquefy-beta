"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

type ToastVariant = "success" | "error";

interface ToastItem {
    id: number;
    title: string;
    variant: ToastVariant;
}

type Listener = (toast: Omit<ToastItem, "id">) => void;

const listeners = new Set<Listener>();

function emit(toast: Omit<ToastItem, "id">) {
    listeners.forEach((listener) => listener(toast));
}

export const toast = {
    success(message: string) {
        emit({ title: message, variant: "success" });
    },
    error(message: string) {
        emit({ title: message, variant: "error" });
    },
};

const ToastContext = createContext<typeof toast>(toast);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);

    useEffect(() => {
        const listener: Listener = (item) => {
            const id = Date.now() + Math.random();
            setItems((current) => [...current, { ...item, id }]);

            window.setTimeout(() => {
                setItems((current) => current.filter((toastItem) => toastItem.id !== id));
            }, 4000);
        };

        listeners.add(listener);

        return () => {
            listeners.delete(listener);
        };
    }, []);

    const value = useMemo(() => toast, []);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_24px_60px_rgba(2,6,23,0.45)] ${
                            item.variant === "success"
                                ? "border-emerald-500/30 bg-[#0F1F1A] text-emerald-100"
                                : "border-rose-500/30 bg-[#261317] text-rose-100"
                        }`}
                    >
                        {item.variant === "success" ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                        ) : (
                            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
                        )}
                        <div className="min-w-0 flex-1 text-sm font-medium">{item.title}</div>
                        <button
                            type="button"
                            onClick={() => setItems((current) => current.filter((toastItem) => toastItem.id !== item.id))}
                            className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                            aria-label="Fechar notificação"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
