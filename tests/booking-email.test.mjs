import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const example = { fullName: '<script>Example & "name"</script>', email: "example@example.com", phone: "020 7946 0124", treatment: "not-sure", preferredDate: "2099-01-01", preferredTime: "Morning", message: "<img src=x onerror='example'>\nA & B", consent: true };
const settings = { RESEND_API_KEY: "mock-only-placeholder", BOOKING_NOTIFICATION_EMAIL: "practice@example.com", BOOKING_FROM_EMAIL: "sender@example.com" };

function load(env, send) {
    const exports = {};
    const compiled = ts.transpileModule(readFileSync("src/lib/notifications/booking-email.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    new Function("exports", "require", "process", compiled)(exports, (name) => {
        if (name === "server-only") return {};
        if (name === "resend") return { Resend: class { emails = { send }; } };
        if (name === "@/lib/booking") return { bookingTreatments: [{ slug: "not-sure", name: "Not sure yet" }] };
        return require(name);
    }, { env });
    return exports;
}

test("one practice email has trusted addresses, escaped HTML and plain-text content", async () => {
    const sent = [];
    const subject = load(settings, async (payload) => { sent.push(payload); return { data: { id: "mock-email" }, error: null }; });
    assert.equal(await subject.notifyBooking(example), "sent");
    assert.equal(sent.length, 1);
    const email = sent[0];
    assert.deepEqual(email.to, [settings.BOOKING_NOTIFICATION_EMAIL]);
    assert.equal(email.from, `Horizon Dental Studio <${settings.BOOKING_FROM_EMAIL}>`);
    assert(!email.to.includes(example.email));
    assert(!email.html.includes("<script>"));
    assert(!email.html.includes("<img"));
    assert(email.html.includes("&lt;script&gt;Example &amp; &quot;name&quot;&lt;/script&gt;"));
    assert(email.html.includes("&#39;example&#39;"));
    assert(email.text.includes(example.message));
    assert(email.text.includes("Treatment: Not sure yet"));
    assert.match(email.text, /not confirmed appointments/);
    assert.match(email.text, /Fictional portfolio/);
    for (const value of [example.email, example.phone, example.preferredDate, example.preferredTime]) assert(email.text.includes(value));
    assert(!JSON.stringify(email).includes(settings.RESEND_API_KEY));
});

test("missing and invalid email configuration deliberately skips sending", async () => {
    const original = console.warn;
    const warnings = [];
    console.warn = (...args) => warnings.push(args.join(" "));
    try {
        for (const env of [{}, { ...settings, RESEND_API_KEY: "" }, { ...settings, BOOKING_FROM_EMAIL: "" }, { ...settings, BOOKING_NOTIFICATION_EMAIL: "" }, { ...settings, BOOKING_NOTIFICATION_EMAIL: "bad\r\nBcc: other@example.com" }, { ...settings, BOOKING_FROM_EMAIL: "invalid" }]) {
            const subject = load(env, () => assert.fail("Must not send"));
            assert.equal(await subject.notifyBooking(example), "skipped");
        }
        assert.equal(warnings.length, 6);
        assert(!warnings.join(" ").includes(example.email));
        assert(!warnings.join(" ").includes(settings.RESEND_API_KEY));
    } finally { console.warn = original; }
});

test("returned provider errors and thrown network errors are safely contained without retries", async () => {
    const original = console.warn;
    const warnings = [];
    console.warn = (...args) => warnings.push(args.join(" "));
    try {
        for (const throws of [false, true]) {
            let calls = 0;
            const subject = load(settings, async () => {
                calls++;
                if (throws) throw new Error(`private provider detail ${example.email}`);
                return { data: null, error: { message: `private provider detail ${settings.RESEND_API_KEY}` } };
            });
            assert.equal(await subject.notifyBooking(example), "failed");
            assert.equal(calls, 1);
        }
        assert.equal(warnings.length, 2);
        assert(!warnings.join(" ").includes("private"));
        assert(!warnings.join(" ").includes(example.email));
        assert(!warnings.join(" ").includes(settings.RESEND_API_KEY));
    } finally { console.warn = original; }
});

test("empty optional message has a clear fallback", async () => {
    const subject = load(settings, async (email) => { assert(email.text.includes("No message provided.")); return { error: null }; });
    assert.equal(await subject.notifyBooking({ ...example, message: "" }), "sent");
});
