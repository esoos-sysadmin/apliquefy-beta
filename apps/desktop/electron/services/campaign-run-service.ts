import type {
    RpaRunResponse,
    RunnerCampaign,
    RunnerCampaignApiModel,
} from "../../shared/runner-types";
import { apiRequest } from "./backend-api-service";
import { renderResumePdf } from "./resume-pdf-service";
import { getStorageStatePath } from "./session-service";
import { getRpaAuthToken, rpaApiRequest, startRpaProcess } from "./rpa-process-service";
import { subscribeRunEvents } from "./rpa-events-service";
import { resolveCurrentAuthState } from "./auth-service";

/**
 * Inicia um run do RPA para a campanha: garante o engine de pé, resolve a sessão
 * e o PDF do currículo, dispara POST /runs e assina os eventos do run.
 * Lançado a partir da ativação da campanha ("play").
 */
export async function startCampaignRun(campaign: RunnerCampaign): Promise<RpaRunResponse> {
    // O engine pode estar ligado (idempotente); garante antes de renderizar/rodar.
    await startRpaProcess();

    // O RunnerCampaign mapeado não carrega o resumeId; busca o modelo cru.
    const raw = await apiRequest<{ data?: RunnerCampaignApiModel }>(
        `/api/campaigns/${campaign.id}`
    );
    const resumeId = raw.data?.resume?.id;
    if (!resumeId) {
        throw new Error("Campanha sem currículo associado; não é possível iniciar o run.");
    }

    const storageStatePath = getStorageStatePath(campaign.platform);
    const { path: resumePdfPath } = await renderResumePdf(resumeId);

    // O APLIQUEFY_WEB_TOKEN do engine é congelado no spawn (pode estar vazio se o
    // engine subiu antes do login). Resolve/renova o token AGORA e passa por-run,
    // senão os callbacks à API web (protegida por Clerk) tomam 307/redirect.
    // ponytail: token do Clerk pode expirar em runs muito longos; refresh no
    // meio do run fica pra quando um run estourar o TTL na prática.
    const auth = await resolveCurrentAuthState();
    const webToken = auth.token;

    console.log(
        `[rpa] iniciando run da campanha ${campaign.id} (${campaign.platform}) ` +
            `storageState=${storageStatePath} resumePdf=${resumePdfPath}`
    );

    const response = await rpaApiRequest<RpaRunResponse>("/runs", {
        method: "POST",
        body: JSON.stringify({
            campaignId: campaign.id,
            storageStatePath,
            resumePdfPath,
            webToken,
        }),
    });

    const token = getRpaAuthToken();
    if (token) {
        try {
            subscribeRunEvents(response.runId, token);
        } catch (err) {
            console.error("[rpa] failed to subscribe events:", err);
        }
    }

    return response;
}
