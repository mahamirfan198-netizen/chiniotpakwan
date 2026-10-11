import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, phone, email, eventType, eventDate, guestCount, location, preferredDish, notes } = data;

    if (!name || !phone || !eventType) {
      return NextResponse.json({ error: "Name, phone, and event type required" }, { status: 400 });
    }

    const enquiry = await prisma.cateringEnquiry.create({
      data: {
        name,
        phone,
        email: email || null,
        eventType,
        eventDate: eventDate ? new Date(eventDate) : null,
        guestCount: guestCount ? Number(guestCount) : null,
        location: location || null,
        preferredDish: preferredDish || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}