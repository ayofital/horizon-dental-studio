import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const modules = new Map();
function load(path) {
    if (modules.has(path)) return modules.get(path);
    const exports = {};
    const compiled = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    new Function("exports", "require", compiled)(exports, name => {
        if (name.endsWith(".css")) return {};
        if (name === "next/link") return { default: ({ children, ...props }) => React.createElement("a", props, children) };
        if (name === "next/image") return { default: ({ src, alt, sizes }) => React.createElement("img", { src, alt, sizes }) };
        if (name === "next/navigation") return { notFound: () => { throw new Error("not-found"); } };
        if (name.startsWith("@/")) return load(`src/${name.slice(2)}.${name.startsWith("@/components/") ? "tsx" : "ts"}`);
        return require(name);
    });
    modules.set(path, exports);
    return exports;
}
const html = path => renderToStaticMarkup(React.createElement(load(`src/app/${path}.tsx`).default));
const text = markup => markup.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

test("homepage clearly identifies fictional content without unsupported patient evidence", () => {
    const home = text(html("page"));
    assert.match(home, /fictional dental practice/i);
    assert.match(home, /fictional clinicians/i);
    assert.match(home, /Fictional examples/);
    assert.doesNotMatch(home, /4\.9\/5|2,000\+|15\+ years|Rated by our patients|Patients treated/);
});

test("treatment pages render their own complete data and correct links without another treatment's content", async () => {
    const { treatments } = load("src/data/treatments.ts");
    const index = html("treatments/page");
    const home = html("page");
    const pricing = html("pricing/page");
    const detail = load("src/app/treatments/[slug]/page.tsx").default;
    for (const treatment of treatments) {
        for (const markup of [index, home, pricing]) {
            assert(markup.includes(treatment.name));
            assert(markup.includes(treatment.price));
            assert(markup.includes(`href="/treatments/${treatment.slug}"`));
        }
        const rendered = renderToStaticMarkup(await detail({ params: Promise.resolve({ slug: treatment.slug }) }));
        const copy = text(rendered);
        for (const value of [treatment.name, treatment.price, treatment.description, treatment.longDescription, treatment.suitableFor, treatment.cta, ...treatment.benefits, ...treatment.process.flatMap(step => [step.title, step.description]), ...treatment.faqs.flatMap(faq => [faq.question, faq.answer])]) assert(copy.includes(value), `${treatment.slug}: missing ${value}`);
        for (const other of treatments.filter(item => item !== treatment)) assert(!copy.includes(other.longDescription), `${treatment.slug}: unrelated content`);
        assert(rendered.includes('href="/book"'));
    }
});

test("shared people, fees, stories and FAQ categories remain complete across their pages", () => {
    const { team } = load("src/data/team.ts");
    for (const page of ["page", "about/page"]) for (const member of team) {
        const markup = html(page);
        assert(text(markup).includes(member.name));
        assert(text(markup).includes(member.bio));
        assert(markup.includes(member.image));
    }
    const pricing = text(html("pricing/page"));
    const { consultationPrices, pricingCategories } = load("src/data/pricing.ts");
    for (const item of consultationPrices) { assert(pricing.includes(item.name)); assert(pricing.includes(item.price)); }
    for (const category of pricingCategories) assert(html("pricing/page").includes(`id="pricing-${category.id}"`));
    const stories = html("patient-stories/page");
    for (const story of load("src/data/testimonials.ts").testimonials) {
        for (const value of [story.name, story.quote, story.outcome]) assert(text(stories).includes(value));
        assert(stories.includes(`href="/treatments/${story.treatmentSlug}"`));
    }
    assert.match(text(stories), /fictional examples.*rather than real or independently verified reviews/);
    const faqPage = html("faq/page");
    const { faqs, faqCategories, faqPreview } = load("src/data/faqs.ts");
    for (const category of faqCategories) {
        assert(faqPage.includes(`href="#faq-${category.id}"`));
        assert(faqPage.includes(`id="faq-${category.id}"`));
    }
    for (const faq of faqs) assert(text(faqPage).includes(faq.question));
    for (const faq of faqPreview) assert(text(html("page")).includes(faq.question));
});
