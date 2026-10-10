import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
function load(path, hooks) {
    const exports = {};
    const compiled = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    new Function("exports", "require", compiled)(exports, name => {
        if (name === "react") return hooks || React;
        if (name === "next/link") return { default: ({ children, ...props }) => React.createElement("a", props, children) };
        if (name.startsWith("@/components/")) return load(`src/${name.slice(2)}.tsx`, hooks);
        if (name.startsWith("@/lib/") || name.startsWith("@/data/")) return load(`src/${name.slice(2)}.ts`);
        return require(name);
    });
    return exports;
}
const pages = ["not-found", "page", "about/page", "treatments/page", "treatments/[slug]/page", "pricing/page", "patient-stories/page", "faq/page", "contact/page", "book/page", "treatments/[slug]/loading"];

test("shared skip link targets a focusable main on every public page and loading state", () => {
    const layout = readFileSync("src/app/layout.tsx", "utf8");
    assert.match(layout, /href="#main-content">Skip to main content/);
    assert.match(layout, /<html lang="en"/);
    for (const page of pages) {
        const source = readFileSync(`src/app/${page}.tsx`, "utf8");
        assert.equal((source.match(/<main /g) || []).length, 1, page);
        assert.match(source, /<main id="main-content" tabIndex=\{-1\}/, page);
    }
});

test("rendered form controls have visible labels, required status, hint relationships and live regions", () => {
    for (const [path, props] of [["ContactForm", {}], ["BookingForm", { minimumDate: "2026-10-11" }]]) {
        const Component = load(`src/components/${path}.tsx`).default;
        const html = renderToStaticMarkup(React.createElement(Component, props));
        for (const control of html.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
            const id = /id="([^"]+)"/.exec(control[2])?.[1];
            assert(id, path);
            assert(html.includes(`for="${id}"`), `${path}: ${id} visible label`);
            assert.match(control[2], /aria-invalid="false"/);
            for (const ref of (/aria-describedby="([^"]+)"/.exec(control[2])?.[1] || "").split(" ").filter(Boolean)) assert(html.includes(`id="${ref}"`));
        }
        assert.match(html, /Fields marked \* are required/);
        assert.match(html, /autoComplete="name"/i);
        assert.match(html, /autoComplete="email"/i);
        assert.match(html, /autoComplete="tel"/i);
        assert.match(html, /role="status"/);
        assert.match(html, /aria-busy="false"/);
    }
});

test("invalid form render associates field errors and announces a plain-language summary", () => {
    for (const path of ["ContactForm", "BookingForm"]) {
        let state = 0;
        const hooks = { ...React, useState: initial => [state++ === 0 ? { email: "Enter a valid email address." } : initial, () => {}] };
        const Component = load(`src/components/${path}.tsx`, hooks).default;
        const html = renderToStaticMarkup(React.createElement(Component, { minimumDate: "2026-10-11" }));
        const prefix = path === "ContactForm" ? "contact" : "booking";
        assert.match(html, /aria-invalid="true"/);
        assert(html.includes(`aria-describedby="${prefix}-email-error"`));
        assert(html.includes(`id="${prefix}-email-error"`));
        assert.match(html, /role="alert">Please correct the fields with an error message/);
    }
});

test("native FAQ and pricing relationship semantics are preserved and treatment links are descriptive", () => {
    const FAQItem = load("src/components/FAQItem.tsx").default;
    assert.match(renderToStaticMarkup(React.createElement(FAQItem, { faq: { question: "Example question?", answer: "Example answer." } })), /<details[^>]*><summary>Example question\?<\/summary>/);
    const PricingList = load("src/components/PricingList.tsx").default;
    const pricing = renderToStaticMarkup(React.createElement(PricingList, { items: [{ name: "Example care", price: "From £75", description: "Assessment." }] }));
    assert.match(pricing, /<dl/); assert.match(pricing, /<dt>Example care<\/dt><dd[^>]*>From £75/);
    const TreatmentCard = load("src/components/TreatmentCard.tsx").default;
    assert.match(renderToStaticMarkup(React.createElement(TreatmentCard, { treatment: { name: "Dental Implants", slug: "dental-implants", price: "From £2,900", description: "Example." } })), /aria-label="Learn more about Dental Implants"/);
});

function luminance(hex) {
    const rgb = hex.match(/\w\w/g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a, b) { const values = [luminance(a), luminance(b)].sort((a,b) => b-a); return (values[0]+.05)/(values[1]+.05); }
test("shared text, form errors and focus colors meet their contrast thresholds", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    const muted = /--color-text-muted: #([a-f0-9]+)/.exec(css)[1];
    for (const background of ["ffffff", "f7f6f2", "d9e7df"]) assert(contrast(muted, background) >= 4.5);
    assert(contrast("96392f", "fff0ed") >= 4.5);
    assert(contrast("ffffff", "173f35") >= 4.5);
    assert.match(css, /prefers-reduced-motion: reduce/);
    assert.match(css, /html \{ scroll-behavior: auto; \}/);
});

test("pending and failure form states preserve announcements; booking success is a focusable stored result", () => {
    for (const path of ["ContactForm", "BookingForm"]) {
        for (const status of ["pending", "failure"]) {
            let state = 0;
            const hooks = { ...React, useState: initial => [state++ === 1 ? status : state === 3 ? "Example outcome message." : initial, () => {}] };
            const Component = load(`src/components/${path}.tsx`, hooks).default;
            const html = renderToStaticMarkup(React.createElement(Component, { minimumDate: "2026-10-11" }));
            if (status === "pending") { assert.match(html, /aria-busy="true"/); assert.match(html, /<fieldset[^>]*disabled/); assert.match(html, /Please wait/); }
            else { assert.match(html, /role="alert">Example outcome message/); assert(!html.includes("<fieldset disabled")); }
        }
    }
    let state = 0;
    const values = [{}, "success", "Request stored.", { treatment: "general-dentistry", preferredDate: "2026-10-11", preferredTime: "Morning" }];
    const hooks = { ...React, useState: () => [values[state++], () => {}] };
    const Component = load("src/components/BookingForm.tsx", hooks).default;
    const html = renderToStaticMarkup(React.createElement(Component, { minimumDate: "2026-10-11" }));
    assert.match(html, /<form[^>]*hidden/);
    assert.match(html, /tabindex="-1" role="region" aria-labelledby="booking-confirmation-heading"/);
    assert.match(html, /Your request has been saved/);
    assert.match(html, /not an appointment confirmation/);
});

test("mobile navigation identifies its disclosure, closes with Escape and restores focus on desktop resize", () => {
    const refs = [], changes = []; let effect, resize, focused = "";
    const hooks = { ...React, useState: () => [true, value => changes.push(value)], useRef: () => { const ref = { current: null }; refs.push(ref); return ref; }, useEffect: callback => { effect = callback; } };
    const Header = load("src/components/Header.tsx", hooks).default;
    const tree = Header();
    const children = React.Children.toArray(tree.props.children);
    const trigger = React.Children.toArray(children[0].props.children).find(child => child.props.className === "mobile-menu-button");
    assert.equal(trigger.type, "button");
    assert.equal(trigger.props["aria-expanded"], true);
    assert.equal(trigger.props["aria-controls"], children[1].props.id);
    assert.equal(children[1].props.hidden, false);
    const bookingAction = React.Children.toArray(children[0].props.children).find(child => child.props.className === "header-action").props.children;
    const bookingLink = bookingAction.type(bookingAction.props);
    assert.equal(bookingLink.props.href, "/book");
    bookingLink.props.onClick();
    assert.equal(changes.at(-1), false, "header booking navigation closes the expanded mobile menu");
    refs[0].current = { focus: () => { focused = "trigger"; } };
    let prevented = false;
    tree.props.onKeyDown({ key: "Escape", preventDefault: () => { prevented = true; } });
    assert(prevented); assert.equal(focused, "trigger"); assert.equal(changes.at(-1), false);
    const originalWindow = globalThis.window, originalDocument = globalThis.document;
    globalThis.document = { activeElement: refs[0].current };
    refs[1].current = { contains: () => false };
    refs[2].current = { querySelector: () => ({ focus: () => { focused = "desktop"; } }) };
    let removed = false;
    globalThis.window = { matchMedia: () => ({ matches: true, addEventListener: (name, callback) => { assert.equal(name, "change"); resize = callback; }, removeEventListener: () => { removed = true; } }) };
    try { const cleanup = effect(); resize(); assert.equal(focused, "desktop"); assert.equal(changes.at(-1), false); cleanup(); assert(removed); }
    finally { globalThis.window = originalWindow; globalThis.document = originalDocument; }
});
