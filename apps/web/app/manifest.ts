import type { MetadataRoute } from "next"

// PWA (§6.5): instalar na tela inicial é o que libera o push no iOS (16.4+).
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Apliquefy",
        short_name: "Apliquefy",
        description: "Candidaturas automáticas a vagas de emprego",
        start_url: "/relatorios",
        display: "standalone",
        background_color: "#F6F4FA",
        theme_color: "#7A3BFF",
        lang: "pt-BR",
        icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
    }
}
