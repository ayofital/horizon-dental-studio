import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

const compiled = ts.transpileModule(readFileSync("src/lib/request-body.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exports = {};
new Function("exports", compiled)(exports);
const { readFormBody, RequestBodyTooLargeError, FORM_BODY_LIMIT_BYTES } = exports;
const request = (body, headers) => new Request("http://localhost/api/contact", { method: "POST", body, headers });

test("accepts empty bodies and the exact byte boundary", async () => {
    assert.equal(await readFormBody(request(null)), "");
    const body = "a".repeat(FORM_BODY_LIMIT_BYTES);
    assert.equal(await readFormBody(request(body)), body);
});

test("rejects oversized ASCII and multibyte bodies, not just character counts", async () => {
    for (const body of ["a".repeat(FORM_BODY_LIMIT_BYTES + 1), "é".repeat(8001), "😀".repeat(4001)]) {
        await assert.rejects(readFormBody(request(body)), RequestBodyTooLargeError);
    }
});

test("does not trust a missing or understated Content-Length", async () => {
    for (const headers of [undefined, { "content-length": "1" }]) {
        await assert.rejects(readFormBody(request("a".repeat(16001), headers)), RequestBodyTooLargeError);
    }
});

test("rejects a declared oversized body before reading it", async () => {
    let accessed = false;
    await assert.rejects(readFormBody({ headers: new Headers({ "content-length": "16001" }), get body() { accessed = true; throw new Error("must not read"); } }), RequestBodyTooLargeError);
    assert.equal(accessed, false);
});

test("cancels an over-limit stream immediately and releases its reader", async () => {
    let cancelled = false;
    const body = new ReadableStream({
        start(controller) { controller.enqueue(new Uint8Array(16001)); },
        cancel() { cancelled = true; },
    });
    await assert.rejects(readFormBody({ headers: new Headers(), body }), RequestBodyTooLargeError);
    assert.equal(cancelled, true);
    assert.equal(body.locked, false);
});

test("preserves UTF-8 characters split across chunks and releases on stream errors", async () => {
    const bytes = new TextEncoder().encode("Hello 😀 café");
    const body = new ReadableStream({ start(controller) {
        for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
        controller.close();
    } });
    assert.equal(await readFormBody({ headers: new Headers(), body }), "Hello 😀 café");
    assert.equal(body.locked, false);
    const failed = new ReadableStream({ start(controller) { controller.error(new Error("read failed")); } });
    await assert.rejects(readFormBody({ headers: new Headers(), body: failed }), /read failed/);
    assert.equal(failed.locked, false);
});
