import * as Sentry from "@sentry/electron/renderer";

// Config vazia de propósito: o renderer herda DSN, release, enabled e o scrubbing
// do processo main via IPC (SDD §5.3). Duplicar as opções aqui só criaria duas
// fontes de verdade — e a chance de o consentimento valer num processo e no outro
// não. `sandbox: false` na BrowserWindow deixa o SDK injetar o IPC sozinho.
Sentry.init({});
Sentry.setTag("surface", "runner_renderer");
