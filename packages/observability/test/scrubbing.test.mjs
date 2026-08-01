// Roda contra o `dist/` (o script `test` builda antes). `.mjs` puro de propósito:
// evita depender de type-stripping experimental do Node só para rodar 6 asserts.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { test } from "node:test";

import { scrubEvent, scrubBreadcrumb, AUTOMATION_STEPS, SURFACES, PLATFORMS } from "../dist/index.js";

const taxonomy = JSON.parse(
    readFileSync(fileURLToPath(new URL("../src/taxonomy.json", import.meta.url)), "utf8"),
);

test("taxonomia TS bate com taxonomy.json", () => {
    assert.deepEqual([...AUTOMATION_STEPS], taxonomy.automationStep);
    assert.deepEqual([...SURFACES], taxonomy.surface);
    assert.deepEqual([...PLATFORMS], taxonomy.platform);
});

test("scrubEvent redige chaves sensíveis em qualquer profundidade", () => {
    const event = scrubEvent({
        extra: {
            campaignId: "abc",
            resume: { personalInfo: { email: "a@b.com" } },
            nested: { list: [{ authorization: "Bearer x", safe: 1 }] },
        },
    });

    assert.equal(event.extra.campaignId, "abc", "chave inócua preservada");
    assert.equal(event.extra.resume, "[Filtered]");
    assert.equal(event.extra.nested.list[0].authorization, "[Filtered]");
    assert.equal(event.extra.nested.list[0].safe, 1, "redação não vaza para irmãos");
});

test("scrubEvent nunca deixa passar anexo, request ou user além do id", () => {
    const event = scrubEvent({
        attachments: [{ filename: "screenshot.png", data: "..." }],
        request: {
            url: "https://x/y",
            cookies: { li_at: "segredo" },
            headers: { Authorization: "Bearer x" },
            data: { curriculo: "..." },
            query_string: "token=x",
        },
        user: { id: "uuid-1", email: "a@b.com", ip_address: "1.2.3.4" },
    });

    assert.equal(event.attachments, undefined);
    assert.deepEqual(event.user, { id: "uuid-1" });
    assert.equal(event.request.cookies, undefined);
    assert.equal(event.request.headers, undefined);
    assert.equal(event.request.data, undefined);
    assert.equal(event.request.query_string, undefined);
    assert.equal(event.request.url, "https://x/y", "a URL em si continua útil e não é PII");
});

test("scrubEvent sobrevive a evento vazio e a valores não-objeto", () => {
    assert.deepEqual(scrubEvent({}), {});
    assert.deepEqual(scrubEvent({ extra: { n: null, s: "x", arr: [1, 2] } }).extra, {
        n: null,
        s: "x",
        arr: [1, 2],
    });
});

test("scrubEvent não estoura a pilha com objeto cíclico", () => {
    const cyclic = { safe: 1 };
    cyclic.self = cyclic;
    assert.doesNotThrow(() => scrubEvent({ extra: { cyclic } }));
});

test("scrubBreadcrumb descarta console e corta query string", () => {
    assert.equal(scrubBreadcrumb({ category: "console", message: "dump do currículo" }), null);

    const crumb = scrubBreadcrumb({
        category: "fetch",
        data: { url: "https://www.linkedin.com/jobs/view/123?trk=sessao" },
    });
    assert.equal(crumb.data.url, "https://www.linkedin.com/jobs/view/123");
});
