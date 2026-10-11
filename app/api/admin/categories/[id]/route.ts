import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const force = searchParams.get("force") === "true";

  const productCount = await prisma.product.count({ where: { categoryId: id } });

  if (productCount > 0 && !force) {
    return NextResponse.json(
      { error: "Category has " + productCount + " products. Delete products first or use force delete." },
      { status: 400 }
    );
  }

  // Delete products first if force, then category
  if (force && productCount > 0) {
    await prisma.product.deleteMany({ where: { categoryId: id } });
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category });
}