import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return "CP" + y + m + d + rand;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      city,
      items,
      paymentMethod,
      transactionId,
      notes,
    } = data;

    if (!customerName || !customerPhone || !address || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate total on server — NEVER trust client
    let totalAmount = 0;
    const validatedItems = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;
      totalAmount += item.price * item.quantity;
      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: item.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    if (validatedItems.length === 0) {
      return NextResponse.json({ error: "No valid items" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        address,
        city: city || null,
        totalAmount,
        paymentMethod: paymentMethod || "COD",
        transactionId: transactionId || null,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "AWAITING_VERIFICATION",
        notes: notes || null,
        items: { create: validatedItems },
      },
      include: { items: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}