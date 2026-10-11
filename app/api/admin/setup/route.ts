import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "mahamirfan198@gmail.com";
    const existing = await prisma.admin.findUnique({ where: { email: adminEmail } });

    if (existing) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
    }

    const { password, name } = await req.json();

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be 8+ chars" }, { status: 400 });
    }

    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash: await bcrypt.hash(password, 10),
        name: name || "Admin",
      },
    });

    return NextResponse.json({ ok: true, email: admin.email }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "mahamirfan198@gmail.com";
    const existing = await prisma.admin.findUnique({ where: { email: adminEmail } });
    return NextResponse.json({ exists: !!existing });
  } catch {
    return NextResponse.json({ exists: false });
  }
}
