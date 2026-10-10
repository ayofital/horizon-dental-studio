import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
function loadProject(env = { NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://portfolio.example" }) {
    const cache = new Map();
    function load(path) {
        if (cache.has(path)) return cache.get(path);
        const exports = {};
        const compiled = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
        new Function("exports", "require", "process", compiled)(exports, (name) => {
            if (name === "next/navigation") return { notFound: () => { throw new Error("NOT_FOUND"); } };
            if (name === "next/server") return { NextResponse: { next: () => ({ next: true }), rewrite: (url, options) => ({ url, ...options }) } };
            if (name.startsWith("@/components/") || name === "next/link") return { default: () => null };
            if (name.startsWith("@/")) return load(`src/${name.slice(2)}.ts`);
            return require(name);
        }, { env });
        cache.set(path, exports);
        return exports;
    }
    return load;
}

test("site origins normalize safely and production never defaults to localhost", () => {
    const { getSiteUrl } = loadProject()("src/lib/seo.ts");
    assert.equal(getSiteUrl("https://portfolio.example/", "production").href, "https://portfolio.example/");
    assert.equal(getSiteUrl("", "production").href, "https://horizon-dental-studio.example/");
    assert.equal(getSiteUrl("", "development").href, "http://localhost:3000/");
    for (const value of ["bad", "ftp://portfolio.example", "https://portfolio.example/path", "https://user:password@portfolio.example", "https://portfolio.example/?query=1", "https://portfolio.example/#fragment", "http://portfolio.example", "https://localhost", "https://127.0.0.1", "https://[::1]"]) assert.throws(() => getSiteUrl(value, "production"), /NEXT_PUBLIC_SITE_URL/);
});

test("page metadata keeps unique titles, canonical paths and complete shared social fields", () => {
    const { createPageMetadata, getSiteUrl, siteName, siteTitle } = loadProject()("src/lib/seo.ts");
    const metadata = createPageMetadata("Pricing", "Fictional indicative fees.", "/pricing");
    assert.equal(metadata.title, "Pricing");
    assert.equal(new URL(metadata.alternates.canonical, getSiteUrl()).href, "https://portfolio.example/pricing");
    assert.equal(metadata.openGraph.title, `Pricing | ${siteName}`);
    assert.equal(metadata.openGraph.url, "/pricing");
    assert.equal(metadata.openGraph.siteName, siteName);
    assert.equal(metadata.openGraph.type, "website");
    assert.equal(metadata.openGraph.locale, "en_GB");
    assert.equal(metadata.openGraph.images[0].width, 1200);
    assert.equal(metadata.twitter.card, "summary_large_image");
    assert.equal(metadata.twitter.description, metadata.description);
    assert.deepEqual(createPageMetadata("Concept", "Fictional", "/").title, { absolute: siteTitle });
});

test("sitemap lists every public page and shared treatment exactly once, with no APIs", () => {
    const load = loadProject();
    const sitemap = load("src/app/sitemap.ts").default();
    const { treatments } = load("src/data/treatments.ts");
    const urls = sitemap.map(({ url }) => url);
    const expected = ["/", "/about", "/pricing", "/patient-stories", "/faq", "/contact", "/book", "/treatments", ...treatments.map(({ slug }) => `/treatments/${slug}`)].map(path => new URL(path, "https://portfolio.example").href);
    assert.deepEqual(urls.sort(), expected.sort());
    assert.equal(new Set(urls).size, urls.length);
    assert(urls.every(url => !url.includes("/api/")));
});

test("robots allows public pages, excludes API crawling and references the configured sitemap", () => {
    const robots = loadProject()("src/app/robots.ts").default();
    assert.deepEqual(robots.rules, { userAgent: "*", allow: "/", disallow: "/api/" });
    assert.equal(robots.sitemap, "https://portfolio.example/sitemap.xml");
});

test("treatment metadata derives unique canonical and social content from treatment data", async () => {
    const load = loadProject();
    const { generateMetadata, generateStaticParams } = load("src/app/treatments/[slug]/page.tsx");
    const { treatments } = load("src/data/treatments.ts");
    assert.deepEqual(generateStaticParams(), treatments.map(({ slug }) => ({ slug })));
    const titles = [];
    for (const treatment of treatments) {
        const metadata = await generateMetadata({ params: Promise.resolve({ slug: treatment.slug }) });
        titles.push(metadata.title);
        assert.equal(metadata.title, treatment.name);
        assert(metadata.description.startsWith(treatment.description));
        assert.match(metadata.description, /fictional practice concept/);
        assert.equal(metadata.alternates.canonical, `/treatments/${treatment.slug}`);
        assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
    }
    assert.equal(new Set(titles).size, treatments.length);
    await assert.rejects(generateMetadata({ params: Promise.resolve({ slug: "unknown-treatment" }) }), /NOT_FOUND/);
});

test("treatment route guard preserves known pages and returns unknown slugs through native 404 rendering", () => {
    const load = loadProject();
    const { proxy, config } = load("src/proxy.ts");
    const { treatments } = load("src/data/treatments.ts");
    assert.equal(config.matcher, "/treatments/:slug");
    const request = slug => ({ nextUrl: { pathname: `/treatments/${slug}` }, url: `https://portfolio.example/treatments/${slug}` });
    for (const { slug } of treatments) assert.deepEqual(proxy(request(slug)), { next: true });
    const result = proxy(request("unknown-treatment"));
    assert.equal(result.status, 404);
    assert.equal(result.url.href, "https://portfolio.example/404");
});
