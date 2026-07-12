import { Notification, shell } from "electron";
import { getRunnerState } from "./store";

export function maybeShowRunnerNotification(title: string, body: string, url?: string) {
    const { settings } = getRunnerState();

    if (!settings.desktopNotifications || !Notification.isSupported()) {
        return;
    }

    const notification = new Notification({ title, body });

    if (url) {
        notification.on("click", () => {
            void shell.openExternal(url);
        });
    }

    notification.show();
}
