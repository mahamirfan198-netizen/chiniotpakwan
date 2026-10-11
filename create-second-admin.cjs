const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "support@chiniotpakwan.pk";
  const password = "Support@2026";
  const name = "Support Team";

  // Check if admin already exists
  const existing = await prisma.admin.findUnique({ where: { email } });

  if (existing) {
    // Update password to ensure it matches
    await prisma.admin.update({
      where: { email },
      data: {
        passwordHash: await bcrypt.hash(password, 10),
        name,
      },
    });
    console.log("✅ Updated existing admin");
  } else {
    // Create new
    await prisma.admin.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 10),
        name,
      },
    });
    console.log("✅ Created new admin");
  }

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("SECOND ADMIN CREDENTIALS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Email:    " + email);
  console.log("Password: " + password);
  console.log("Name:     " + name);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Also list all admins
  const allAdmins = await prisma.admin.findMany({ select: { email: true, name: true } });
  console.log("");
  console.log("ALL ADMINS IN DATABASE:");
  for (const a of allAdmins) {
    console.log("  • " + a.email + " (" + a.name + ")");
  }
}

main()
  .catch((e) => { console.error("❌", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());