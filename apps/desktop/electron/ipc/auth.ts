import { BrowserWindow, ipcMain, session as electronSession } from "electron";
import type { Session } from "electron";
import type { RunnerAuthState } from "../../shared/runner-types";
import { createEmptyAuthState, getDesktopWebUrl, getRunnerState, setRunnerState } from "../store";

type AuthSessionPayload = {
    authenticated: boolean;
    userId: string;
    email: string | null;
    displayName: string | null;
    token: string | null;
};

type AuthIpcOptions = {
    getMainWindow: () => BrowserWindow | null;
};

let isAuthIpcRegistered = false;
let authWindow: BrowserWindow | null = null;

function decodeJwtExpiration(token: string | null) {
    if (!token) {
        return null;
    }

    try {
        const [, payload] = token.split(".");

        if (!payload) {
            return null;
        }

        const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
        const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
        const decodedPayload = JSON.parse(Buffer.from(paddedPayload, "base64").toString("utf8")) as {
            exp?: number;
        };

        return decodedPayload.exp ? decodedPayload.exp * 1000 : null;
    } catch (error) {
        console.error("Failed to decode desktop JWT expiration:", error);
        return null;
    }
}

function isAuthStateValid(authState: RunnerAuthState) {
    if (!authState.isAuthenticated || !authState.token) {
        return false;
    }

    if (!authState.expiresAt) {
        return true;
    }

    return authState.expiresAt > Date.now() + 15_000;
}

function createAuthenticatedState(payload: AuthSessionPayload): RunnerAuthState {
    const expiresAt = decodeJwtExpiration(payload.token);

    return {
        isAuthenticated: payload.authenticated,
        userId: payload.userId,
        email: payload.email,
        displayName: payload.displayName,
        token: payload.token,
        expiresAt,
    };
}

function persistAuthState(nextAuthState: RunnerAuthState) {
    const currentState = getRunnerState();

    return setRunnerState({
        ...currentState,
        auth: nextAuthState,
    }).auth;
}

async function fetchDesktopSessionWithCookies(sessionToUse: Session): Promise<RunnerAuthState | null> {
    const webUrl = getDesktopWebUrl();
    const cookies = await sessionToUse.cookies.get({ url: webUrl });

    if (cookies.length === 0) {
        return null;
    }

    const cookieHeader = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

    const response = await fetch(`${webUrl}/api/desktop-auth/session`, {
        headers: {
            Cookie: cookieHeader,
        },
    });

    if (!response.ok) {
        return null;
    }

    const payload = (await response.json()) as AuthSessionPayload;

    if (!payload.authenticated || !payload.userId || !payload.token) {
        return null;
    }

    return createAuthenticatedState(payload);
}

async function clearDesktopAuthCookies() {
    const webUrl = getDesktopWebUrl();
    const defaultSession = electronSession.defaultSession;
    const cookies = await defaultSession.cookies.get({ url: webUrl });

    await Promise.all(
        cookies.map((cookie) => defaultSession.cookies.remove(webUrl, cookie.name))
    );

    await defaultSession.clearStorageData({
        origin: webUrl,
        storages: ["cookies", "localstorage"],
    });
}

async function resolveCurrentAuthState() {
    const persistedAuth = getRunnerState().auth;

    if (isAuthStateValid(persistedAuth)) {
        return persistedAuth;
    }

    try {
        const refreshedAuth = await fetchDesktopSessionWithCookies(electronSession.defaultSession);

        if (refreshedAuth) {
            return persistAuthState(refreshedAuth);
        }
    } catch (error) {
        console.error("Failed to refresh desktop auth from Clerk session:", error);
    }

    return persistAuthState(createEmptyAuthState());
}

async function runDesktopSignInFlow(parentWindow: BrowserWindow | null) {
    if (authWindow && !authWindow.isDestroyed()) {
        authWindow.focus();
        return resolveCurrentAuthState();
    }

    const webUrl = getDesktopWebUrl();
    const successUrl = `${webUrl}/desktop-auth/success`;
    const loginUrl = `${webUrl}/login?redirect_url=${encodeURIComponent(successUrl)}`;

    authWindow = new BrowserWindow({
        width: 440,
        height: 720,
        parent: parentWindow ?? undefined,
        modal: Boolean(parentWindow),
        autoHideMenuBar: true,
        backgroundColor: "#0D1117",
        title: "Apliquefy Sign In",
        webPreferences: {
            sandbox: false,
        },
    });

    return new Promise<RunnerAuthState>((resolve) => {
        let isResolved = false;

        const finish = (authState: RunnerAuthState) => {
            if (isResolved) {
                return;
            }

            isResolved = true;

            if (authWindow && !authWindow.isDestroyed()) {
                authWindow.close();
            }

            authWindow = null;
            resolve(authState);
        };

        const consumeSession = async () => {
            try {
                const authState = await fetchDesktopSessionWithCookies(electronSession.defaultSession);

                if (authState) {
                    finish(persistAuthState(authState));
                    return;
                }
            } catch (error) {
                console.error("Failed to consume desktop auth session:", error);
            }

            finish(persistAuthState(createEmptyAuthState()));
        };

        const handleNavigation = (url: string) => {
            if (url.startsWith(successUrl)) {
                void consumeSession();
            }
        };

        authWindow?.webContents.on("did-navigate", (_event, url) => {
            handleNavigation(url);
        });

        authWindow?.webContents.on("did-redirect-navigation", (_event, url) => {
            handleNavigation(url);
        });

        authWindow?.on("closed", () => {
            authWindow = null;
            void resolveCurrentAuthState().then(finish);
        });

        void authWindow?.loadURL(loginUrl);
    });
}

export function registerAuthIpc(options: AuthIpcOptions) {
    if (isAuthIpcRegistered) {
        return;
    }

    isAuthIpcRegistered = true;

    ipcMain.handle("auth:get-state", async () => {
        return resolveCurrentAuthState();
    });

    ipcMain.handle("auth:sign-in", async () => {
        return runDesktopSignInFlow(options.getMainWindow());
    });

    ipcMain.handle("auth:sign-out", async () => {
        await clearDesktopAuthCookies();
        return persistAuthState(createEmptyAuthState());
    });
}
