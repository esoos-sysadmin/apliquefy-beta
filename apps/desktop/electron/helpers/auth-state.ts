import type { RunnerAuthState } from "../../shared/runner-types";
import { decodeJwtExpiration } from "./jwt";

export type AuthSessionPayload = {
    authenticated: boolean;
    userId: string;
    email: string | null;
    displayName: string | null;
    token: string | null;
};

export function isAuthStateValid(authState: RunnerAuthState) {
    if (!authState.isAuthenticated || !authState.token) {
        return false;
    }

    if (!authState.expiresAt) {
        return true;
    }

    return authState.expiresAt > Date.now() + 15_000;
}

export function createAuthenticatedState(payload: AuthSessionPayload): RunnerAuthState {
    return {
        isAuthenticated: payload.authenticated,
        userId: payload.userId,
        email: payload.email,
        displayName: payload.displayName,
        token: payload.token,
        expiresAt: decodeJwtExpiration(payload.token),
    };
}
