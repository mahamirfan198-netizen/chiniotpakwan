import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Name, phone, and message required" }, { status: 400 });
    }

    const contact = await prisma.contactMessage.create({
      data: { name, phone, email: email || null, message },
    });

    return NextResponse.json({ ok: true, id: contact.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}