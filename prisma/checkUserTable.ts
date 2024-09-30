import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check User table
  const userCount = await prisma.user.count();
  console.log(`Total users in the database: ${userCount}`);

  // Fetch all users
  const users = await prisma.user.findMany();
  console.log("Users:");
  users.forEach((user) => {
    console.log(`User ID: ${user.id}, Email: ${user.email}`);
  });

  // Check Poll table
  const pollCount = await prisma.poll.count();
  console.log(`\nTotal polls in the database: ${pollCount}`);

  // Fetch all polls
  const polls = await prisma.poll.findMany();
  console.log("Polls:");
  polls.forEach((poll) => {
    console.log(
      `Poll ID: ${poll.id}, Question: ${poll.question}, User ID: ${poll.userId}`
    );
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
