import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://chiniotpakwan.pk";
  const now = new Date();

  const staticRoutes = [
    "", "/menu", "/catering", "/locations", "/contact", "/terms", "/privacy",
    "/daig-service/lahore", "/daig-service/islamabad", "/daig-service/karachi", "/daig-service/faisalabad"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const products = await prisma.product.findMany({ where: { available: true }, select: { id: true, updatedAt: true } });
  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/menu/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

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

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
