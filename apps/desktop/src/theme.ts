// Tema = data-theme no <html> (cores em styles/tokens.css). Importado antes do render para não piscar.
export type Theme = "light" | "dark";

const KEY = "theme";

export const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function setTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem(KEY, theme);
    } catch {
        // storage indisponível: vale só nesta sessão
    }
}

try {
    if (localStorage.getItem(KEY) === "dark") document.documentElement.dataset.theme = "dark";
} catch {
    // segue no claro
}
