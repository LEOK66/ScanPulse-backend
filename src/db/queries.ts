import prisma from "./connection";

export async function getPoll(id: string) {
  return prisma.poll.findUnique({
    where: { id },
  });
}

export async function updateVote(
  pollId: string,
  voterId: string,
  emoji: string
) {
  return prisma.vote.upsert({
    where: {
      pollId_voterId: { pollId, voterId },
    },
    update: { emoji },
    create: { pollId, voterId, emoji },
  });
}

export async function getPollResults(pollId: string) {
  const votes = await prisma.vote.groupBy({
    by: ["emoji"],
    where: { pollId },
    _count: true,
  });

  return votes.reduce((acc, vote) => {
    acc[vote.emoji] = vote._count;
    return acc;
  }, {} as Record<string, number>);
}

export async function createPoll(question: string, qrCodeUrl: string) {
  return prisma.poll.create({
    data: { question, qrCodeUrl },
  });
}
