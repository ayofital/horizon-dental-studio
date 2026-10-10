import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
function load(path, hooks = React) {
    const exports = {};
    const compiled = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    new Function("exports", "require", compiled)(exports, name => {
        if (name === "react") return hooks;
        if (name.endsWith(".css")) return {};
        if (name.startsWith("@/")) return load(`src/${name.slice(2)}.${name.startsWith("@/components/") ? "tsx" : "ts"}`, hooks);
        return require(name);
    });
    return exports;
}

function find(element, type) {
    if (!element || typeof element !== "object") return;
    if (element.type === type) return element;
    for (const child of React.Children.toArray(element.props?.children)) {
        const result = find(child, type);
        if (result) return result;
    }
}

test("page and global recovery screens hide exception details and expose accessible retry", () => {
    const hooks = { ...React, useEffect: () => {} };
    for (const path of ["error", "global-error"]) {
        const Component = load(`src/app/${path}.tsx`, hooks).default;
        const html = renderToStaticMarkup(React.createElement(Component, { error: new Error("private provider details"), retry: () => {} }));
        assert.equal((html.match(/<h1 /g) || []).length, 1);
        assert.match(html, /id="page-error-heading" tabindex="-1"/);
        assert.match(html, /<button[^>]*>Try again<\/button>/);
        assert.match(html, /href="\/"/);
        assert(!html.includes("private"));
        if (path === "global-error") { assert.match(html, /<html lang="en"/); assert.match(html, /<body/); }
    }
    let retries = 0, focuses = 0;
    const PageError = load("src/components/PageError.tsx", { ...React, useRef: () => ({ current: { focus: () => focuses++ } }), useEffect: callback => callback() }).default;
    find(PageError({ retry: () => retries++ }), "button").props.onClick();
    assert.equal(retries, 1);
    assert.equal(focuses, 1);
});

// Run the actual submit handlers with controlled hooks and browser request primitives.
// This exercises failure/retry state transitions without a live insert or notification.
test("both forms preserve entries, release pending state and retry after unsafe responses or network failures", async () => {
    const original = { fetch: globalThis.fetch, FormData: globalThis.FormData, requestAnimationFrame: globalThis.requestAnimationFrame, HTMLElement: globalThis.HTMLElement };
    globalThis.FormData = class extends Map { constructor(form) { super(form.values); } };
    globalThis.requestAnimationFrame = callback => { callback(); return 0; };
    globalThis.HTMLElement = class {};
    try {
        for (const name of ["BookingForm", "ContactForm"]) {
            const booking = name === "BookingForm";
            const values = new Map(Object.entries(booking
                ? { fullName: "Example", email: "example@example.com", phone: "020 7946 0124", treatment: "not-sure", preferredDate: "2099-01-01", preferredTime: "Morning", message: "Example only", consent: "on" }
                : { fullName: "Example", email: "example@example.com", phone: "", subject: "General enquiry", message: "Example only" }));
            const success = booking
                ? { ok: true, stored: true, message: "Stored example request.", summary: { treatment: "not-sure", preferredDate: "2099-01-01", preferredTime: "Morning" } }
                : { demo: true, message: "Demo complete. Nothing was sent or saved." };
            const failures = [
                () => Promise.reject(new TypeError("private network details")),
                () => Promise.reject(new DOMException("private abort details", "AbortError")),
                () => Promise.resolve(new Response("<html>Unavailable</html>", { status: 503 })),
                () => Promise.resolve(new Response("broken json", { status: 200 })),
                ...[null, "unexpected", {}, { message: "private server details" }, { errors: { email: {} } }, { errors: {} }, booking ? { ...success, summary: { ...success.summary, preferredDate: "bad-date" } } : { demo: true, message: {} }]
                    .map(body => () => Promise.resolve(Response.json(body, { status: body?.errors ? 422 : 200 }))),
                () => Promise.resolve(Response.json(success, { status: 500 })),
            ];
            for (const failure of failures) {
                const states = [], refs = [];
                let stateIndex, refIndex, resets = 0;
                const hooks = { ...React, useState: initial => { const i = stateIndex++; if (!(i in states)) states[i] = initial; return [states[i], value => { states[i] = value; }]; }, useRef: initial => { const i = refIndex++; return refs[i] ??= { current: initial }; } };
                const Component = load(`src/components/${name}.tsx`, hooks).default;
                const render = () => { stateIndex = refIndex = 0; return find(Component({ minimumDate: "2099-01-01" }), "form"); };
                const form = { values, elements: { namedItem: () => null }, reset: () => resets++ };
                const event = { preventDefault() {}, currentTarget: form };
                globalThis.fetch = failure;
                await render().props.onSubmit(event);
                assert.equal(states[1], "failure", name);
                assert.match(states[2], /entries are still here/);
                assert(!states[2].includes("private"));
                assert.equal(resets, 0);
                assert.equal(values.get("message"), "Example only");
                assert.equal(find(render(), "fieldset").props.disabled, false);
                globalThis.fetch = async () => Response.json(success, { status: booking ? 201 : 200 });
                await render().props.onSubmit(event);
                assert.equal(states[1], "success", `${name} retry`);
            }

            {
                const states = [], refs = [];
                let stateIndex, refIndex;
                const hooks = { ...React, useState: initial => { const i = stateIndex++; if (!(i in states)) states[i] = initial; return [states[i], value => { states[i] = value; }]; }, useRef: initial => refs[refIndex++] ??= { current: initial } };
                const Component = load(`src/components/${name}.tsx`, hooks).default;
                const render = () => { stateIndex = refIndex = 0; return find(Component({ minimumDate: "2099-01-01" }), "form"); };
                const event = { preventDefault() {}, currentTarget: { values, elements: { namedItem: () => null } } };
                globalThis.fetch = async () => Response.json({ ...(booking ? { ok: false, message: "Check your details." } : {}), errors: { email: "Check this email address." } }, { status: 422 });
                await render().props.onSubmit(event);
                assert.deepEqual(states[0], { email: "Check this email address." });
                assert.equal(states[1], "idle");
                assert.equal(find(render(), "fieldset").props.disabled, false);
                globalThis.fetch = async () => Response.json(success, { status: booking ? 201 : 200 });
                await render().props.onSubmit(event);
                assert.equal(states[1], "success");
                assert.deepEqual(states[0], {});
            }

            const states = [], refs = [];
            let stateIndex, refIndex, calls = 0, finish;
            const hooks = { ...React, useState: initial => { const i = stateIndex++; if (!(i in states)) states[i] = initial; return [states[i], value => { states[i] = value; }]; }, useRef: initial => refs[refIndex++] ??= { current: initial } };
            const Component = load(`src/components/${name}.tsx`, hooks).default;
            const render = () => { stateIndex = refIndex = 0; return find(Component({ minimumDate: "2099-01-01" }), "form"); };
            const form = { values, elements: { namedItem: () => null } };
            const event = { preventDefault() {}, currentTarget: form };
            globalThis.fetch = () => { calls++; return new Promise(resolve => { finish = resolve; }); };
            const submit = render().props.onSubmit;
            const pending = submit(event);
            await submit(event);
            assert.equal(calls, 1, `${name} duplicate click`);
            assert.equal(find(render(), "fieldset").props.disabled, true);
            finish(Response.json(success, { status: booking ? 201 : 200 }));
            await pending;
            await render().props.onSubmit(event);
            assert.equal(calls, 1, `${name} stable success`);
        }
    } finally { Object.assign(globalThis, original); }
});
