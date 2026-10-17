import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: slug + "-" + Date.now().toString(36),
      description: data.description,
      priceFrom: Number(data.priceFrom),
      priceTo: Number(data.priceTo),
      variantNote: data.variantNote || null,
      image: data.image,
      originalUrl: data.originalUrl || null,
      popular: Boolean(data.popular),
      available: data.available !== false,
      categoryId: data.categoryId,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
