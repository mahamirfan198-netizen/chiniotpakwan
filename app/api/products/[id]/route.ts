import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let product = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true, icon: true } } },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
        include: { category: { select: { id: true, name: true, icon: true } } },
      });
    }

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}