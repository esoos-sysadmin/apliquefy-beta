/**
 * Sobe os source maps do PROCESSO MAIN para o Sentry (SDD §10.2).
 *
 * O renderer é coberto pelo sentryVitePlugin no vite.config.ts. O main não passa
 * pelo Vite — é `tsc` puro para dist-electron/ — então o plugin nunca vê esses
 * arquivos e sem este script o stack trace do main chega minificado.
 *
 * Script em vez de uma linha no package.json porque o release roda numa matriz
 * ubuntu/windows/macos e condicional de shell não é portável entre bash e cmd.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const { SENTRY_AUTH_TOKEN, SENTRY_ORG } = process.env;

if (!SENTRY_AUTH_TOKEN || !SENTRY_ORG) {
    console.log("[sentry] sem SENTRY_AUTH_TOKEN/SENTRY_ORG — pulando upload de source map");
    process.exit(0);
}

const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const release = `apliquefy-runner@${version}`;
const args = ["--org", SENTRY_ORG, "--project", "apliquefy-runner"];

const cli = (...rest) =>
    execFileSync("sentry-cli", rest, { stdio: "inherit", env: process.env, shell: true });

// `inject` grava o debug id no .js e no .map; sem ele o Sentry não casa os dois.
cli("sourcemaps", "inject", "dist-electron");
cli("sourcemaps", "upload", ...args, "--release", release, "dist-electron");

console.log(`[sentry] source maps do main enviados para ${release}`);
