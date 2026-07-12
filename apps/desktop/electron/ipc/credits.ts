import { ipcMain } from "electron";
import { fetchCreditBalance } from "../services/credit-service";

let isCreditIpcRegistered = false;

export function registerCreditIpc() {
    if (isCreditIpcRegistered) {
        return;
    }

    isCreditIpcRegistered = true;

    ipcMain.handle("credits:get-balance", async () => {
        return fetchCreditBalance();
    });
}
