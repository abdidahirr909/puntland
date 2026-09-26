import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL is required");
  }

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is required");
  }

  if (adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Owner account
  await db.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Puntland Market Owner",
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      name: "Puntland Market Owner",
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  // Dubai agent
  const agentPassword = await bcrypt.hash(
    process.env.AGENT_PASSWORD || adminPassword,
    12
  );

  await db.user.upsert({
    where: { email: "agent@puntlandmarket.so" },
    update: {
      passwordHash: agentPassword,
      role: Role.AGENT,
    },
    create: {
      name: "Dubai Agent",
      email: "agent@puntlandmarket.so",
      passwordHash: agentPassword,
      role: Role.AGENT,
      city: "Dubai",
    },
  });

  // Demo customer
  await db.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@example.com",
      passwordHash,
      role: Role.CUSTOMER,
      phone: "+252000000000",
      city: "Bosaso",
      address: "Demo address",
    },
  });

  const products = [
    ["Wireless Earbuds Pro", "wireless-earbuds-pro", "Electronics", 28, 0.3, "🎧"],
    ["Smart Watch Series", "smart-watch-series", "Electronics", 35, 0.4, "⌚"],
    ["Running Shoes", "running-shoes", "Fashion", 32, 0.8, "👟"],
    ["LED Room Light", "led-room-light", "Home", 18, 1.1, "💡"],
    ["Travel Backpack", "travel-backpack", "Fashion", 29, 0.7, "🎒"],
    ["Phone Stand", "phone-stand", "Accessories", 12, 0.4, "📱"],
    ["Kitchen Organizer", "kitchen-organizer", "Home", 16, 1.0, "🧺"],
    ["Bluetooth Speaker", "bluetooth-speaker", "Electronics", 24, 0.9, "🔊"],
  ] as const;

  for (const [name, slug, category, price, weight, image] of products) {
    await db.product.upsert({
      where: { slug },
      update: {
        name,
        category,
        priceUsd: price,
        weightKg: weight,
        image,
        active: true,
      },
      create: {
        name,
        slug,
        category,
        priceUsd: price,
        weightKg: weight,
        image,
      },
    });
  }

  console.log(`Owner account ready: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
