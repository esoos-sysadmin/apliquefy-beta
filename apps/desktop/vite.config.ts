import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import pkg from './package.json'

// Só sobe source map quando há credencial: build local e PR de fork não têm, e
// sem esta guarda o plugin falharia um build por uma etapa que é de release.
const uploadSourcemaps = Boolean(process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG)

export default defineConfig({
  plugins: [
    react(),
    ...(uploadSourcemaps
      ? [
          sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: 'apliquefy-runner',
            authToken: process.env.SENTRY_AUTH_TOKEN,
            release: { name: `apliquefy-runner@${pkg.version}` },
            // O .map não entra no instalador: sobe pro Sentry e some.
            sourcemaps: { filesToDeleteAfterUpload: ['**/*.map'] },
          }),
        ]
      : []),
  ],
  base: './',
  build: {
    outDir: 'dist-react',
    emptyOutDir: true,
    // 'hidden': gera o .map mas não deixa o comentário sourceMappingURL no bundle
    // distribuído. Sem isto o stack trace do renderer chega minificado — e o SDK
    // não avisa, você descobre olhando um issue ilegível (SDD §10.2).
    sourcemap: 'hidden',
  },
  server: {
    port: 5173, // Porta padrão do Vite
    strictPort: true,
  }
})
