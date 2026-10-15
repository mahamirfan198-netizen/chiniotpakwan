import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = SITE_URL;
  const now = new Date();

  const staticRoutes = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: baseUrl + "/menu", lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: baseUrl + "/catering", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/locations", lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: baseUrl + "/contact", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  let productRoutes: { url: string; lastModified: Date; changeFrequency: string; priority: number }[] = [];
  try {
    const products = await prisma.product.findMany({
      where: { available: true },
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
    productRoutes = products.map((p) => ({
      url: baseUrl + "/menu/" + p.id,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap: failed to fetch products", error);
  }

  const allRoutes = [...staticRoutes, ...productRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map((route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${new Date(route.lastModified).toISOString()}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
