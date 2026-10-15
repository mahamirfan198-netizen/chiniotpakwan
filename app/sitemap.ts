import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const now = new Date();

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: baseUrl + "/menu", lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: baseUrl + "/catering", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/locations", lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: baseUrl + "/contact", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // Dynamic product pages
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { available: true },
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });

    productRoutes = products.map((p) => ({
      url: baseUrl + "/menu/" + p.id,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap: failed to fetch products", error);
  }

  return [...staticRoutes, ...productRoutes];
}
