/**
 * Taxonomia de tags do error tracking (SDD §4.1 / §8).
 *
 * `src/taxonomy.json` é o contrato neutro de linguagem: o lado Python duplica
 * estas mesmas listas em `rpa_engine/observability.py`. Os dois lados têm um
 * teste de paridade contra o JSON, então divergir quebra o build — é isso que
 * torna a duplicação segura (ADR-03).
 */

/**
 * Etapas da automação. Espelham as funções reais dos engines em `apps/robots`,
 * não o fluxograma idealizado: desde a migração para browser-use, "responder
 * pergunta", "chamar LLM", "preencher" e "enviar" acontecem todos dentro de um
 * único `agent.run()` e colapsaram em `apply_agent`.
 */
export const AUTOMATION_STEPS = [
    "session_check",
    "job_search",
    "job_filters",
    "job_iteration",
    "apply_open",
    "resume_attach",
    "apply_agent",
    "debit",
] as const;
export type AutomationStep = (typeof AUTOMATION_STEPS)[number];

/** Origem do evento. Os três `runner_*` compartilham o projeto `apliquefy-runner` (ADR-05). */
export const SURFACES = ["web", "runner_api", "runner_main", "runner_renderer", "runner_engine"] as const;
export type Surface = (typeof SURFACES)[number];

export const PLATFORMS = ["linkedin", "infojobs"] as const;
export type Platform = (typeof PLATFORMS)[number];
