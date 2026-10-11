const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.admin.deleteMany({});
  console.log("Cleared existing admins\n");

  await prisma.admin.create({
    data: {
      email: "mahamirfan198@gmail.com",
      passwordHash: await bcrypt.hash("Maham@2026", 10),
      name: "Maham",
    },
  });
  console.log("✅ Admin 1: mahamirfan198@gmail.com / Maham@2026\n");

  await prisma.admin.create({
    data: {
      email: "support@chiniotpakwan.pk",
      passwordHash: await bcrypt.hash("Support@2026", 10),
      name: "Support",
    },
  });
  console.log("✅ Admin 2: support@chiniotpakwan.pk / Support@2026\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("SAVE THESE CREDENTIALS:");
  console.log("Admin 1: mahamirfan198@gmail.com / Maham@2026");
  console.log("Admin 2: support@chiniotpakwan.pk / Support@2026");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => { console.error("❌", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());