const fs = require("fs");

let schema = fs.readFileSync("prisma/schema.prisma", "utf8");

// Add Order + Payment models if missing
if (!schema.includes("model Order")) {
  schema += `

model Order {
  id            String   @id @default(cuid())
  orderNumber   String   @unique
  customerName  String
  customerPhone String
  customerEmail String?
  address       String   @db.Text
  city          String?
  totalAmount   Int
  paymentMethod String   @default("COD")
  transactionId String?
  paymentStatus String   @default("PENDING")
  status        String   @default("NEW")
  notes         String?  @db.Text
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  items OrderItem[]

  @@index([customerPhone])
  @@index([createdAt])
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String?
  name      String
  price     Int
  quantity  Int
  image     String?
  createdAt DateTime @default(now())

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
}
`;
  fs.writeFileSync("prisma/schema.prisma", schema);
  console.log("Added Order + OrderItem models");
} else {
  // Add payment fields to existing Order model
  schema = schema.replace(
    /model Order \{([^}]*)\}/,
    (match, body) => {
      let updated = body;
      if (!updated.includes("paymentMethod")) {
        updated = updated.replace(
          /createdAt\s+DateTime\s+@default\(now\(\)\)/,
          "paymentMethod String   @default(\"COD\")\n  transactionId String?\n  paymentStatus String   @default(\"PENDING\")\n  createdAt      DateTime @default(now())"
        );
      }
      return "model Order {" + updated + "}";
    }
  );
  fs.writeFileSync("prisma/schema.prisma", schema);
  console.log("Updated existing Order model");
}
