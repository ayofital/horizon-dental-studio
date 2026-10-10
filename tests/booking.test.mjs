import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const modules = new Map();
let saved;
let persistenceError;
class SupabaseConfigurationError extends Error {}
function load(path) {
    if (modules.has(path)) return modules.get(path);
    const exports = {};
    const compiled = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    new Function("exports", "require", compiled)(exports, (name) => {
        if (name === "@/lib/booking-store") return { saveBooking: async (data) => { if (persistenceError) throw persistenceError; saved = data; } };
        if (name === "@/lib/supabase/server") return { SupabaseConfigurationError };
        return name.startsWith("@/") ? load(`src/${name.slice(2)}.ts`) : require(name);
    });
    modules.set(path, exports);
    return exports;
}
const { validateBooking, bookingTreatments, earliestBookingDate, londonDate } = load("src/lib/booking.ts");
const { treatments } = load("src/data/treatments.ts");
const { POST } = load("src/app/api/bookings/route.ts");
const example = { fullName: " Alex Example ", email: "alex@example.com", phone: "020 7946 0124", treatment: treatments[0].slug, preferredDate: earliestBookingDate(), preferredTime: "Morning", consent: true };
const request = (body) => new Request("http://localhost/api/bookings", { method: "POST", body });

test("valid requests trim input, accept optional message and reuse all treatment slugs", () => {
    const result = validateBooking(example);
    assert.deepEqual(result.errors, {});
    assert.equal(result.data.fullName, "Alex Example");
    assert.equal(result.data.message, "");
    assert.deepEqual(bookingTreatments.slice(0, -1).map(t => t.slug), treatments.map(t => t.slug));
    for (const treatment of bookingTreatments) assert(validateBooking({ ...example, treatment: treatment.slug }).data);
});

test("missing required fields expose useful field errors", () => {
    const result = validateBooking({});
    for (const field of ["fullName", "email", "phone", "treatment", "preferredDate", "preferredTime", "consent"]) assert(result.errors[field]);
    assert(!result.data);
});

test("invalid formats, choices, dates, consent and long messages are rejected", () => {
    for (const [field, value] of [["fullName", " "], ["email", "bad"], ["phone", "123"], ["phone", "1234567890123456"], ["treatment", "unknown"], ["preferredDate", "2000-01-01"], ["preferredDate", londonDate()], ["preferredDate", "2099-02-30"], ["preferredTime", "3pm"], ["consent", false], ["consent", "true"], ["message", "a".repeat(2001)]]) {
        assert(validateBooking({ ...example, [field]: value }).errors[field], `${field}: ${value}`);
    }
    assert(validateBooking({ ...example, message: "a".repeat(2000) }).data);
});

test("London date follows clinic timezone across midnight and summer time", () => {
    assert.equal(londonDate(new Date("2026-06-01T23:30:00Z")), "2026-06-02");
    assert.equal(londonDate(new Date("2026-12-01T23:30:00Z")), "2026-12-01");
});

test("route passes only validated data to persistence and returns a safe stored summary", async () => {
    const success = await POST(request(JSON.stringify({ ...example, status: "confirmed", id: "untrusted" })));
    assert.equal(success.status, 201);
    const result = await success.json();
    assert.equal(result.ok, true);
    assert.equal(result.stored, true);
    assert.match(result.message, /not confirmed appointments/);
    assert.deepEqual(saved, validateBooking(example).data);
    assert(!Object.hasOwn(saved, "status"));
    assert.deepEqual(result.summary, { treatment: example.treatment, preferredDate: example.preferredDate, preferredTime: "Morning" });
    assert(!Object.hasOwn(result, "email"));
    saved = undefined;
    const invalid = await POST(request(JSON.stringify({ ...example, consent: false })));
    assert.equal(invalid.status, 422);
    assert((await invalid.json()).errors.consent);
    for (const body of ["null", "[]", "{}", '"text"']) assert.equal((await POST(request(body))).status, 422);
    assert.equal((await POST(request("bad json"))).status, 400);
    assert.equal((await POST(request("a".repeat(16001)))).status, 413);
    assert.equal(saved, undefined);
    assert.equal((await POST({ text: async () => { throw new Error("read failed"); } })).status, 500);
});

test("configuration and insert failures return safe errors and log no payload or database details", async () => {
    const logs = [];
    const original = console.error;
    console.error = (...args) => logs.push(args.join(" "));
    try {
        for (const [error, status] of [[new SupabaseConfigurationError("private configuration"), 503], [new Error("SQL private database detail"), 500]]) {
            persistenceError = error;
            const response = await POST(request(JSON.stringify(example)));
            assert.equal(response.status, status);
            const body = await response.json();
            assert.equal(body.ok, false);
            assert(!JSON.stringify(body).includes("private"));
            assert(!Object.hasOwn(body, "stored"));
        }
        assert.equal(logs.length, 2);
        assert(!logs.join(" ").includes("private"));
        assert(!logs.join(" ").includes(example.email));
    } finally { persistenceError = undefined; console.error = original; }
});


test("SQL choices stay aligned with shared booking data and public access stays closed", () => {
    const sql = readFileSync("supabase/bookings.sql", "utf8");
    for (const { slug } of bookingTreatments) assert(sql.includes(`'${slug}'`));
    for (const time of load("src/lib/booking.ts").bookingTimes) assert(sql.includes(`'${time}'`));
    assert.match(sql, /enable row level security/i);
    assert.match(sql, /revoke all on table public.bookings from public, anon, authenticated, service_role/i);
    assert.match(sql, /grant insert on table public.bookings to service_role/i);
    assert(!/create policy|grant select|drop table/i.test(sql));
});
