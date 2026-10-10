import type { MetadataRoute } from "next";
import { treatments } from "@/data/treatments";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const paths = ["/", "/about", "/pricing", "/patient-stories", "/faq", "/contact", "/book", "/treatments", ...treatments.map(({ slug }) => `/treatments/${slug}`)];
    return paths.map((path) => ({ url: new URL(path, getSiteUrl()).href }));
}
