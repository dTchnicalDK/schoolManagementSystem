import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@school.com",
      name: "Test User",
    },
  });

  console.log("✅ Created user:", user);

  const allUsers = await prisma.user.findMany();
  console.log("📋 All users:", allUsers);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
