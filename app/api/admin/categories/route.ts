import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, icon } = await req.json();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const category = await prisma.category.create({
    data: { name, slug, icon: icon || null },
  });

  return NextResponse.json({ category }, { status: 201 });
}