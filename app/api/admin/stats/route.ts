import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [products, categories, enquiries, messages, unreadEnquiries, unreadMessages] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.cateringEnquiry.count(),
      prisma.contactMessage.count(),
      prisma.cateringEnquiry.count({ where: { read: false } }),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

  return NextResponse.json({
    products, categories, enquiries, messages, unreadEnquiries, unreadMessages,
  });
}
