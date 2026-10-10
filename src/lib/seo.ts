import type { Metadata } from "next";

export const siteName = "Horizon Dental Studio";
export const siteTitle = `${siteName} | Dental Practice Concept`;
export const siteDescription = "Explore Horizon Dental Studio, a fictional London dental practice concept with thoughtful treatment information, indicative pricing and demonstration consultation requests.";

export function getSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL, environment = process.env.NODE_ENV) {
    // The reserved .example origin permits builds before a deployment URL exists.
    const fallback = environment === "production" ? "https://horizon-dental-studio.example" : "http://localhost:3000";
    try {
        const url = new URL(value?.trim() || fallback);
        const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash || (environment === "production" && (local || url.protocol !== "https:"))) throw new Error();
        return new URL(url.origin);
    } catch {
        throw new Error("NEXT_PUBLIC_SITE_URL must be a site origin without a path, credentials, query or fragment; production requires a public HTTPS origin.");
    }
}

export const socialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "Horizon Dental Studio — a fictional dental practice concept" };
export const sharedOpenGraph = { siteName, type: "website" as const, locale: "en_GB", images: [socialImage] };

export function createPageMetadata(title: string, description: string, path: string): Metadata {
    const fullTitle = path === "/" ? siteTitle : `${title} | ${siteName}`;
    return {
        title: path === "/" ? { absolute: siteTitle } : title,
        description,
        alternates: { canonical: path },
        openGraph: { ...sharedOpenGraph, title: fullTitle, description, url: path },
        twitter: { card: "summary_large_image", title: fullTitle, description, images: [socialImage] },
    };
}
