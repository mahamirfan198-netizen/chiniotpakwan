import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status, paymentStatus } = await req.json();

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
    },
  });

  return NextResponse.json({ order });
}