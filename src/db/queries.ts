import prisma from "./connection";

export async function createPoll(question: string, qrCodeUrl: string) {
  return prisma.poll.create({
    data: { question, qrCodeUrl },
  });
}

export async function getPoll(id: string) {
  return prisma.poll.findUnique({
    where: { id },
    include: { votes: true },
  });
}

export async function createVote(
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
  return prisma.vote.groupBy({
    by: ["emoji"],
    where: { pollId },
    _count: true,
  });
}
