import prisma from "./connection";

const emojiToEnum = {
  "😊": "HAPPY",
  "😐": "NEUTRAL",
  "😢": "SAD",
} as const;

export async function getPoll(id: string) {
  return prisma.poll.findUnique({
    where: { id },
    include: { votes: true },
  });
}

export async function updateVote(pollId: string, emoji: "😊" | "😐" | "😢") {
  return prisma.vote.create({
    data: {
      pollId,
      emoji: emojiToEnum[emoji],
    },
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

export async function createPoll(question: string, userId: string) {
  return prisma.poll.create({
    data: {
      question,
      userId,
    },
  });
}

export async function getUserPolls(userId: string) {
  return prisma.poll.findMany({
    where: { userId },
  });
}

export async function deletePoll(pollId: string, userId: string) {
  return prisma.poll.deleteMany({
    where: {
      id: pollId,
      userId: userId,
    },
  });
}

export async function getAllPolls(userId: string) {
  return prisma.poll.findMany({
    where: { userId },
    include: { votes: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserAnalytics(userId: string) {
  const totalPolls = await prisma.poll.count({ where: { userId } });
  const totalVotes = await prisma.vote.count({
    where: { poll: { userId } },
  });
  const pollsWithVotes = await prisma.poll.findMany({
    where: { userId },
    include: { _count: { select: { votes: true } } },
  });

  return {
    totalPolls,
    totalVotes,
    averageVotesPerPoll: totalPolls > 0 ? totalVotes / totalPolls : 0,
    pollsWithMostVotes: pollsWithVotes
      .sort((a, b) => b._count.votes - a._count.votes)
      .slice(0, 5)
      .map((poll) => ({
        id: poll.id,
        question: poll.question,
        voteCount: poll._count.votes,
      })),
  };
}

export async function getPollAnalytics(pollId: string, userId: string) {
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { votes: true },
  });

  if (!poll || poll.userId !== userId) {
    throw new Error("Poll not found or unauthorized");
  }

  const votesByEmoji = poll.votes.reduce((acc, vote) => {
    acc[vote.emoji] = (acc[vote.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalVotes: poll.votes.length,
    voteDistribution: votesByEmoji,
    createdAt: poll.createdAt,
  };
}
