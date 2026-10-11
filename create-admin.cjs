const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "mahamirfan198@gmail.com";
  const password = "Maham@2026";
  const name = "Maham";

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists:", email);
    return;
  }

  const admin = await prisma.admin.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      name,
    },
  });

  console.log("✅ Admin created:", admin.email);
  console.log("Password:", password);
}

main()
  .catch((e) => { console.error("❌", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
