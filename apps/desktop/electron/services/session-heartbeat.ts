import fs from "node:fs";
import path from "node:path";
import type { RunnerPlatform } from "../../shared/runner-types";
import { getSessionController } from "../controllers/session-controller";
import { fetchCampaigns, updateCampaignStatus } from "./campaign-service";
import { getRunnerState, updateRunnerState } from "../store";
import { getSessionsRoot, hasStoredSession } from "./session-service";

const HEARTBEAT_INTERVAL_MS = 10 * 60_000;
const PLATFORMS: RunnerPlatform[] = ["linkedin", "infojobs"];

let intervalHandle: NodeJS.Timeout | null = null;
let watcher: fs.FSWatcher | null = null;

async function pauseCampaignsForPlatform(platform: RunnerPlatform) {
    const campaigns = getRunnerState().campaigns.filter(
        (campaign) => campaign.platform === platform && campaign.status === "active"
    );

    for (const campaign of campaigns) {
        try {
            await updateCampaignStatus(`/api/campaigns/${campaign.id}/pause`);
        } catch (error) {
            console.error(`Failed to pause campaign ${campaign.id} after session loss:`, error);
        }
    }

    if (campaigns.length === 0) {
        return;
    }

    try {
        const refreshed = await fetchCampaigns();
        updateRunnerState((state) => ({ ...state, campaigns: refreshed }));
    } catch (error) {
        console.error("Failed to refresh campaigns after session loss:", error);
    }
}

async function runHeartbeat() {
    const controller = getSessionController();

    for (const platform of PLATFORMS) {
        if (!hasStoredSession(platform)) {
            continue;
        }

        const result = await controller.check(platform);
        if (result?.status !== "active") {
            await pauseCampaignsForPlatform(platform);
        }
    }
}

function startWatcher() {
    const root = getSessionsRoot();
    fs.mkdirSync(root, { recursive: true });

    try {
        watcher = fs.watch(root, { recursive: true }, (_eventType, filename) => {
            if (!filename) {
                return;
            }

            const relative = filename.toString();
            const segment = relative.split(path.sep)[0];
            if (segment !== "linkedin" && segment !== "infojobs") {
                return;
            }

            const platform = segment as RunnerPlatform;
            const exists = hasStoredSession(platform);

            if (!exists) {
                const controller = getSessionController();
                const current = getRunnerState().sessions[platform];
                if (current) {
                    controller.invalidate(platform, "invalid");
                    void pauseCampaignsForPlatform(platform);
                }
            }
        });
    } catch (error) {
        console.error("Failed to start sessions watcher:", error);
    }
}

export function startSessionHeartbeat() {
    if (intervalHandle) {
        return;
    }

    startWatcher();

    void runHeartbeat();
    intervalHandle = setInterval(() => {
        void runHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);
}

export function stopSessionHeartbeat() {
    if (intervalHandle) {
        clearInterval(intervalHandle);
        intervalHandle = null;
    }
    if (watcher) {
        watcher.close();
        watcher = null;
    }
}
