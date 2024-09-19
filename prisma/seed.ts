import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const poll = await prisma.poll.create({
    data: {
      question: "How are you today?",
      qrCodeUrl: "https://example.com/qr/test-poll",
    },
  });

  console.log({ poll });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
