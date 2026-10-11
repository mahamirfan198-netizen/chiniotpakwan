import { PrismaClient } from "@prisma/client";
import { MENU_ITEMS, CATEGORIES } from "../data/menu";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    if (cat.id === "all") continue;
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        slug: cat.id.toLowerCase(),
        icon: cat.icon,
      },
    });
    categoryMap[cat.id] = created.id;
    console.log("Category: " + cat.name);
  }

  let count = 0;
  for (const item of MENU_ITEMS) {
    const catId = categoryMap[item.category];
    if (!catId) continue;

    await prisma.product.upsert({
      where: { slug: item.id },
      update: {
        name: item.name,
        description: item.description,
        priceFrom: item.priceFrom,
        priceTo: item.priceTo,
        variantNote: item.variantNote,
        image: item.image,
        originalUrl: item.originalUrl,
        popular: item.popular || false,
        categoryId: catId,
      },
      create: {
        name: item.name,
        slug: item.id,
        description: item.description,
        priceFrom: item.priceFrom,
        priceTo: item.priceTo,
        variantNote: item.variantNote,
        image: item.image,
        originalUrl: item.originalUrl,
        popular: item.popular || false,
        categoryId: catId,
      },
    });
    count++;
    console.log("Product: " + item.name);
  }

  console.log("\n Seeded " + count + " products");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
