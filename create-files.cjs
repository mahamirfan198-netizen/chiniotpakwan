const fs = require("fs");
const path = require("path");

const files = {
  "app/admin/enquiries/page.tsx": `"use client";

export default function EnquiriesPage() {
  return (
    <div className="min-h-screen bg-ivory p-8">
      <h1 className="font-display text-3xl font-bold text-emerald-deep">Enquiries</h1>
      <p className="text-charcoal-soft">Enquiries will appear here.</p>
    </div>
  );
}`,

  "app/admin/messages/page.tsx": `"use client";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-ivory p-8">
      <h1 className="font-display text-3xl font-bold text-emerald-deep">Messages</h1>
      <p className="text-charcoal-soft">Messages will appear here.</p>
    </div>
  );
}`,

  "app/api/admin/enquiries/route.ts": `import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const enquiries = await prisma.cateringEnquiry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ enquiries });
}`,

  "app/api/admin/messages/route.ts": `import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ messages });
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("Created: " + filePath);
}
console.log("\nAll files created successfully!");
