import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

async function getProduct(id: string) {
  try {
    const byId = await prisma.product.findUnique({ where: { id } });
    if (byId) return byId;
    return await prisma.product.findUnique({ where: { slug: id } });
  } catch {
    return null;
  }
}

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(id);

  if (!p) {
    return { title: "Dish not found", robots: { index: false, follow: false } };
  }

  const path = "/menu/" + p.id; // same URL the site links to and the sitemap lists
  const title = p.name + " – Order Online | Chiniot Pakwan";
  const description =
    clip((p.description || p.name).replace(/\s+/g, " "), 110) +
    " Order online from Rs. " + Number(p.priceFrom).toLocaleString("en-PK") + ".";
  const image = p.image?.startsWith("http") ? p.image : p.image ? SITE_URL + p.image : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: p.name + " | Chiniot Pakwan",
      description,
      images: image ? [{ url: image, alt: p.name }] : undefined,
    },
    twitter: { card: "summary_large_image", title: p.name, description, images: image ? [image] : undefined },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
