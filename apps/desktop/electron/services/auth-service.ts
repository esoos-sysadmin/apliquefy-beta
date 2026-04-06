import { BrowserWindow, session as electronSession } from "electron";
import type { Session } from "electron";
import type { RunnerAuthState } from "../../shared/runner-types";
import { createAuthenticatedState, isAuthStateValid, type AuthSessionPayload } from "../helpers/auth-state";
import { createEmptyAuthState, getDesktopWebUrl, getRunnerState, setRunnerState } from "../store";

let authWindow: BrowserWindow | null = null;

function persistAuthState(nextAuthState: RunnerAuthState) {
    const currentState = getRunnerState();

    return setRunnerState({
        ...currentState,
        auth: nextAuthState,
    }).auth;
}

export async function fetchDesktopSessionWithCookies(sessionToUse: Session): Promise<RunnerAuthState | null> {
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

export async function clearDesktopAuthCookies() {
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

export async function resolveCurrentAuthState() {
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

export async function runDesktopSignInFlow(parentWindow: BrowserWindow | null) {
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

export async function signOutDesktopAuth() {
    await clearDesktopAuthCookies();
    return persistAuthState(createEmptyAuthState());
}
