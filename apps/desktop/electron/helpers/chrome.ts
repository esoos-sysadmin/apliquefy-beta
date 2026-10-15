import fs from "node:fs";
import path from "node:path";

// O Chrome é obrigatório: a captura de sessão e o engine RPA abrem o Google Chrome
// instalado (`channel: "chrome"`), não o Chromium do Playwright, que é mais fácil de
// detectar como bot. Os caminhos espelham os que o Playwright procura para esse
// channel; se o Chrome não estiver em um deles, o launch falharia do mesmo jeito.
function chromeCandidates(): string[] {
    if (process.platform === "win32") {
        const { LOCALAPPDATA, PROGRAMFILES, HOMEDRIVE } = process.env;
        return [
            LOCALAPPDATA,
            PROGRAMFILES,
            process.env["PROGRAMFILES(X86)"],
            HOMEDRIVE && `${HOMEDRIVE}\\Program Files`,
            HOMEDRIVE && `${HOMEDRIVE}\\Program Files (x86)`,
        ]
            .filter((dir): dir is string => Boolean(dir))
            .map((dir) => path.join(dir, "Google", "Chrome", "Application", "chrome.exe"));
    }
    if (process.platform === "darwin") {
        return ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];
    }
    return ["/opt/google/chrome/chrome"];
}

export function isChromeInstalled(): boolean {
    return chromeCandidates().some((candidate) => fs.existsSync(candidate));
}

export const CHROME_REQUIRED_MESSAGE = "O Apliquefy precisa do Google Chrome instalado para funcionar.";
