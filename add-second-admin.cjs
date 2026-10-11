const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const emails = ["mahamirfan198@gmail.com", "support@chiniotpakwan.pk"];
  const defaultPassword = "chiniot12345"; // CHANGE THIS AFTER FIRST LOGIN!

  for (const email of emails) {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      console.log("Already exists: " + email);
      continue;
    }
    await prisma.admin.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(defaultPassword, 10),
        name: email.split("@")[0],
      },
    });
    console.log("Created admin: " + email);
  }
  console.log("\nDefault password: " + defaultPassword);
  console.log("Change password after first login!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
