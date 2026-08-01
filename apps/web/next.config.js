import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {};

// Sem credencial de upload (dev, PR de fork) o build sai sem source map em vez
// de falhar por uma etapa que só interessa em release.
const uploadSourcemaps = Boolean(process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG);

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: "apliquefy-web",
  silent: !process.env.CI,

  // Ad blockers bloqueiam request para *.sentry.io; sem o túnel o evento do
  // browser some para uma parte relevante dos usuários.
  tunnelRoute: "/monitoring",

  sourcemaps: {
    disable: !uploadSourcemaps,
    // Sobem para o Sentry e não vão para o bundle publicado.
    deleteSourcemapsAfterUpload: true,
  },

  // Tira os logs de debug do SDK do bundle do cliente (o antigo `disableLogger`).
  webpack: { treeshake: { removeDebugLogging: true } },
});
