"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoll = getPoll;
exports.updateVote = updateVote;
exports.getPollResults = getPollResults;
exports.createPoll = createPoll;
exports.getUserPolls = getUserPolls;
exports.deletePoll = deletePoll;
exports.getAllPolls = getAllPolls;
const connection_1 = __importDefault(require("./connection"));
const emojiToEnum = {
    "😊": "HAPPY",
    "😐": "NEUTRAL",
    "😢": "SAD",
};
async function getPoll(id) {
    return connection_1.default.poll.findUnique({
        where: { id },
        include: { votes: true },
    });
}
async function updateVote(pollId, emoji) {
    return connection_1.default.vote.create({
        data: {
            pollId,
            emoji: emojiToEnum[emoji],
        },
    });
}
async function getPollResults(pollId) {
    const votes = await connection_1.default.vote.groupBy({
        by: ["emoji"],
        where: { pollId },
        _count: true,
    });
    return votes.reduce((acc, vote) => {
        acc[vote.emoji] = vote._count;
        return acc;
    }, {});
}
async function createPoll(question, userId) {
    return connection_1.default.poll.create({
        data: {
            question,
            userId,
        },
    });
}
async function getUserPolls(userId) {
    return connection_1.default.poll.findMany({
        where: { userId },
    });
}
async function deletePoll(pollId, userId) {
    return connection_1.default.poll.deleteMany({
        where: {
            id: pollId,
            userId: userId,
        },
    });
}
async function getAllPolls(userId) {
    return connection_1.default.poll.findMany({
        where: { userId },
        include: { votes: true },
        orderBy: { createdAt: "desc" },
    });
}
//# sourceMappingURL=queries.js.map