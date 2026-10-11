import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceFrom: Number(data.priceFrom),
      priceTo: Number(data.priceTo),
      variantNote: data.variantNote || null,
      image: data.image,
      popular: Boolean(data.popular),
      available: data.available !== false,
      categoryId: data.categoryId,
    },
  });
  return NextResponse.json({ product });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
