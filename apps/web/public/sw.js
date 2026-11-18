// Service worker do PWA (§6.5): só push e clique. Nada de cache offline nesta entrega.
self.addEventListener("push", (event) => {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch {
        data = {};
    }
    event.waitUntil(
        self.registration.showNotification(data.title || "Apliquefy", {
            body: data.body || "",
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            data: { url: data.url || "/relatorios" },
        }),
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    // Só caminho do próprio site: o payload não decide para onde o usuário vai.
    const raw = (event.notification.data && event.notification.data.url) || "/relatorios";
    const url = typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/relatorios";
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
            for (const w of wins) {
                if ("focus" in w) {
                    w.navigate(url);
                    return w.focus();
                }
            }
            return self.clients.openWindow(url);
        }),
    );
});
