// Tema claro/escuro da Apliquefy (docs/Apliquefy_Identidade_Visual/06_Tokens).
// Claro segue a identidade (base da /lp); escuro é derivado dela sobre o grafite #14121C.
// Toda cor vira variável CSS "R G B" para os modificadores de opacidade (bg-x/10) funcionarem.
// O tema ativo é `data-theme` no <html>; sem atributo vale o claro.
import colors from "tailwindcss/colors.js";

const SHADES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

// Neutro levemente arroxeado ancorado nos tons da marca (#F6F4FA, #D8D4E2, #625D6C, #14121C).
const NEUTRAL = {
  50: "#F6F4FA", 100: "#ECE9F1", 200: "#D8D4E2", 300: "#BDB7C9", 400: "#9E98AA", 500: "#7D7789",
  600: "#625D6C", 700: "#45404F", 800: "#2E2A3A", 900: "#1C1926", 950: "#14121C",
};
// Roxo da marca: 600 = ação, 700 = hover, 800 = pressionado.
const BRAND = {
  50: "#F7F3FF", 100: "#F0E9FF", 200: "#DCCAFF", 300: "#C9B0FF", 400: "#A57BFF", 500: "#8B55FF",
  600: "#7A3BFF", 700: "#6527DC", 800: "#5420BF", 900: "#3D1890", 950: "#26105A",
};

// O código foi escrito para fundo escuro (texto slate-300, badge text-rose-300 sobre rose-500/10).
// No claro: neutros invertem a escala inteira; cores só escurecem os tons claros (texto/ícone).
const invert = (s) => String(s === "50" ? 950 : s === "950" ? 50 : 1000 - Number(s));
const darkenLight = (s) => ({ 50: "900", 100: "800", 200: "800", 300: "700", 400: "700" })[s] ?? s;

const scales = {
  slate: [NEUTRAL, invert], gray: [NEUTRAL, invert], zinc: [NEUTRAL, invert],
  neutral: [NEUTRAL, invert], stone: [NEUTRAL, invert],
  blue: [BRAND, darkenLight], indigo: [BRAND, darkenLight], purple: [BRAND, darkenLight],
  ...Object.fromEntries(
    ["violet", "fuchsia", "pink", "rose", "red", "orange", "amber", "yellow", "lime", "green",
      "emerald", "teal", "cyan", "sky"].map((n) => [n, [colors[n], darkenLight]]),
  ),
};

// Papéis semânticos [claro, escuro].
const ROLES = {
  canvas: ["#F6F4FA", "#100E16"], // fundo da página
  sunken: ["#F3F1F7", "#0C0A11"], // inputs, trilhas de barra, áreas rebaixadas
  surface: ["#FFFFFF", "#1A1723"], // cards e modais
  raised: ["#F6F4FA", "#221E2D"], // hover/linha destacada sobre card
  overlay: ["#ECE9F1", "#2B2638"], // chips, tracks, hover forte
  line: ["#E4E0EB", "#2A2636"], // bordas de card
  "line-strong": ["#D8D4E2", "#3B3549"], // bordas de input/controle
  fg: ["#14121C", "#F6F4FA"], // texto principal (substitui text-white)
  muted: ["#625D6C", "#9E98AA"],
  accent: ["#7A3BFF", "#7A3BFF"],
  "accent-hover": ["#6527DC", "#8B55FF"],
  "accent-text": ["#6527DC", "#B28CFF"], // link/ícone em roxo (#7A3BFF não dá contraste no escuro)
  "accent-soft": ["#F0E9FF", "#261C40"], // item selecionado
};

const rgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
};
const ref = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

const light = {};
const dark = {};
const twColors = {};
for (const [name, [scale, toLight]] of Object.entries(scales)) {
  twColors[name] = {};
  for (const s of SHADES) {
    light[`--c-${name}-${s}`] = rgb(scale[toLight(s)]);
    dark[`--c-${name}-${s}`] = rgb(scale[s]);
    twColors[name][s] = ref(`${name}-${s}`);
  }
}
for (const [name, [l, d]] of Object.entries(ROLES)) {
  light[`--c-${name}`] = rgb(l);
  dark[`--c-${name}`] = rgb(d);
  twColors[name] = ref(name);
}

export const themeColors = twColors;
export const themeBase = {
  ":root": { ...light, colorScheme: "light" },
  '[data-theme="dark"]': { ...dark, colorScheme: "dark" },
};
