import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

// Make sure to include this in your application shutdown logic
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
