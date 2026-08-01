import type { RunnerCreditBalance } from "../../shared/runner-types";
import { apiRequest } from "./backend-api-service";

export async function fetchCreditBalance(): Promise<RunnerCreditBalance> {
    try {
        const response = await apiRequest<{ data?: RunnerCreditBalance; success?: boolean }>(
            "/api/credits/balance"
        );
        return response.data ?? { balance: 0, canSend: false, plan: "free" };
    } catch {
        return { balance: 0, canSend: false, plan: "free" };
    }
}
