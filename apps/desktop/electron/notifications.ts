import { Notification } from "electron";
import { getRunnerState } from "./store";

export function maybeShowRunnerNotification(title: string, body: string) {
    const { settings } = getRunnerState();

    if (!settings.desktopNotifications || !Notification.isSupported()) {
        return;
    }

    new Notification({ title, body }).show();
}
