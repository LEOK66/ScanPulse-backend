import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a dummy user
  const dummyUser = await prisma.user.upsert({
    where: { email: "dummy@example.com" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000000",
      email: "dummy@example.com",
      password: "dummy_password",
    },
  });

  // Update existing polls to use the dummy user
  const updatedPolls = await prisma.poll.updateMany({
    where: { userId: null },
    data: { userId: dummyUser.id },
  });

  console.log(`Updated ${updatedPolls.count} polls.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
