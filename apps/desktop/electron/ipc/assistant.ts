import { ipcMain } from "electron";
import type { AssistantMessage } from "../../shared/runner-types";
import { runAssistant, transcribeAudio } from "../services/assistant-service";

let isAssistantIpcRegistered = false;

export function registerAssistantIpc() {
    if (isAssistantIpcRegistered) {
        return;
    }
    isAssistantIpcRegistered = true;

    ipcMain.handle("assistant:transcribe", async (_event, audioBase64: string) => {
        return transcribeAudio(audioBase64);
    });

    ipcMain.handle("assistant:chat", async (_event, messages: AssistantMessage[]) => {
        return runAssistant(messages);
    });
}
