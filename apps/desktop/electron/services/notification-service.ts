import { maybeShowRunnerNotification } from "../notifications";

export function notifyCampaignPaused(name: string) {
    maybeShowRunnerNotification("Campaign paused", `${name} was paused in the runner.`);
}

export function notifyCampaignActivated(name: string) {
    maybeShowRunnerNotification("Campaign resumed", `${name} is active again.`);
}

export function notifyRunFailed(name: string, reason: string) {
    maybeShowRunnerNotification(`Não foi possível iniciar "${name}"`, reason);
}
