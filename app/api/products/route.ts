import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { available: true },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, icon: true } },
      },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}