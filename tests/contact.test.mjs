import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

function load(path, resolve = () => { throw new Error("Unexpected import"); }) {
    const exports = {};
    const compiled = ts.transpileModule(readFileSync(path, "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText;
    new Function("exports", "require", compiled)(exports, resolve);
    return exports;
}

const validation = load("src/lib/contact.ts");
const { POST } = load("src/app/api/contact/route.ts", (name) => {
    assert.equal(name, "@/lib/contact");
    return validation;
});
const example = { fullName: "Alex Example", email: "alex@example.com", phone: "", subject: "General enquiry", message: "An example question about opening hours." };
const request = (body) => new Request("http://localhost/api/contact", { method: "POST", body });

test("valid input is trimmed; phone is optional", () => {
    const result = validation.validateContact({ ...example, fullName: " Alex Example " });
    assert.deepEqual(result.errors, {});
    assert.equal(result.values.fullName, "Alex Example");
    assert.deepEqual(validation.validateContact({ ...example, phone: "+44 (20) 7946 0124" }).errors, {});
});

test("required fields, invalid types, formats, subjects and lengths are rejected", () => {
    for (const input of [null, [], {}, "text"]) assert.equal(Object.keys(validation.validateContact(input).errors).length, 4);
    for (const [field, value] of [["fullName", " "], ["email", "bad"], ["phone", "abc"], ["subject", "Unknown"], ["message", 123]]) {
        assert(validation.validateContact({ ...example, [field]: value }).errors[field]);
    }
    for (const [field, limit] of Object.entries(validation.contactLimits)) {
        assert(validation.validateContact({ ...example, [field]: "a".repeat(limit + 1) }).errors[field]);
    }
    assert(!validation.validateContact({ ...example, message: "a".repeat(2000) }).errors.message);
});

test("route returns explicit demo success and rejects invalid or oversized bodies", async () => {
    const success = await POST(request(JSON.stringify(example)));
    assert.equal(success.status, 200);
    const result = await success.json();
    assert.equal(result.demo, true);
    assert.match(result.message, /Nothing was sent or saved/);
    assert(!Object.hasOwn(result, "email"));
    const invalid = await POST(request("{}"));
    assert.equal(invalid.status, 422);
    assert((await invalid.json()).errors.email);
    assert.equal((await POST(request("bad json"))).status, 400);
    assert.equal((await POST(request("a".repeat(16001)))).status, 413);
});
