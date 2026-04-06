export function decodeJwtExpiration(token: string | null) {
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
