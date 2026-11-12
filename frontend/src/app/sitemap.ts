import type { MetadataRoute } from "next";
import { SITE_URL, CATEGORIES_SEO } from "@/lib/seo";
import { api } from "@/lib/api";

export const revalidate = 86400; // revalidate at most once every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${SITE_URL}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/services`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ];

    // Collect category slugs with safe fallback
    const knownSlugs = Object.keys(CATEGORIES_SEO);
    let categorySlugs = new Set<string>(knownSlugs);

    try {
        const categories = await api.getCategories();
        if (Array.isArray(categories) && categories.length > 0) {
            categories.forEach((c) => {
                if (c.slug) categorySlugs.add(c.slug);
            });
        }
    } catch {
        // Backend API might be offline during build time; fallback to known standard categories
    }

    const categoryRoutes: MetadataRoute.Sitemap = Array.from(categorySlugs).map((slug) => ({
        url: `${SITE_URL}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes];
}
