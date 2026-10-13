import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    products, categories, enquiries, messages,
    unreadEnquiries, unreadMessages, orders, newOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.cateringEnquiry.count(),
    prisma.contactMessage.count(),
    prisma.cateringEnquiry.count({ where: { read: false } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "NEW" } }),
  ]);

  return NextResponse.json({
    products, categories, enquiries, messages,
    unreadEnquiries, unreadMessages, orders, newOrders,
  });
}
