import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: baseUrl + "/menu", lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: baseUrl + "/catering", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/locations", lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: baseUrl + "/contact", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  return routes;
}
