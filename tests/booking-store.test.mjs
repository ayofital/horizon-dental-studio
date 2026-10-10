import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

function load(path, mocks, env = {}) {
    const exports = {};
    const compiled = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    new Function("exports", "require", "process", compiled)(exports, (name) => {
        if (name === "server-only") return {};
        assert(Object.hasOwn(mocks, name), `Unexpected dependency: ${name}`);
        return mocks[name];
    }, { env });
    return exports;
}

test("server client initializes lazily, caches one client and disables browser auth state", () => {
    const calls = [];
    const client = {};
    const subject = load("src/lib/supabase/server.ts", { "@supabase/supabase-js": { createClient: (...args) => { calls.push(args); return client; } } }, { SUPABASE_URL: "https://example.com", SUPABASE_SERVICE_ROLE_KEY: "mock-only-placeholder" });
    assert.equal(calls.length, 0);
    assert.equal(subject.getSupabaseServerClient(), client);
    assert.equal(subject.getSupabaseServerClient(), client);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0][2], { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
});

test("missing or invalid configuration fails before any client or connection is created", () => {
    for (const env of [{}, { SUPABASE_URL: "https://example.com" }, { SUPABASE_URL: "invalid", SUPABASE_SERVICE_ROLE_KEY: "mock-only-placeholder" }, { SUPABASE_URL: "file:///private", SUPABASE_SERVICE_ROLE_KEY: "mock-only-placeholder" }]) {
        const subject = load("src/lib/supabase/server.ts", { "@supabase/supabase-js": { createClient: () => { assert.fail("Must not initialize"); } } }, env);
        assert.throws(subject.getSupabaseServerClient, subject.SupabaseConfigurationError);
    }
});

test("repository inserts only booking columns and does not select private records", async () => {
    let row;
    const subject = load("src/lib/booking-store.ts", { "@/lib/supabase/server": { getSupabaseServerClient: () => ({ from: (table) => { assert.equal(table, "bookings"); return { insert: async (data) => { row = data; return { error: null }; } }; } }) } });
    const data = { fullName: "Example", email: "example@example.com", phone: "020 7946 0124", treatment: "not-sure", preferredDate: "2099-01-01", preferredTime: "Morning", message: "<script>example only</script>", consent: true, status: "confirmed" };
    assert.equal(await subject.saveBooking(data), undefined);
    assert.deepEqual(row, { name: data.fullName, email: data.email, phone: data.phone, treatment: data.treatment, preferred_date: data.preferredDate, preferred_time: data.preferredTime, message: data.message, consent: true });
});

test("repository sanitizes Supabase insert failure", async () => {
    const subject = load("src/lib/booking-store.ts", { "@/lib/supabase/server": { getSupabaseServerClient: () => ({ from: () => ({ insert: async () => ({ error: { message: "private SQL and personal data" } }) }) }) } });
    await assert.rejects(subject.saveBooking({}), { message: "Booking persistence failed." });
});
