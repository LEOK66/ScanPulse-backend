"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = exports.getAllPolls = exports.deletePoll = exports.getUserPolls = exports.createPoll = exports.vote = exports.getPoll = void 0;
const pollQueries = __importStar(require("../db/queries"));
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = __importDefault(require("../utils/logger"));
const qrcode_1 = __importDefault(require("qrcode"));
require("../types/express");
const ALLOWED_EMOJIS = ["😊", "😐", "😢"];
const getPoll = async (req, res, next) => {
    try {
        const pollId = req.params.pollId;
        logger_1.default.info(`Fetching poll with id: ${pollId}`);
        const poll = await pollQueries.getPoll(pollId);
        if (!poll) {
            logger_1.default.warn(`Poll not found: ${pollId}`);
            throw new errorHandler_1.AppError("Poll not found", 404);
        }
        const results = await pollQueries.getPollResults(pollId);
        res.json({ ...poll, results });
    }
    catch (error) {
        logger_1.default.error("Error in getPoll:", error);
        next(error);
    }
};
exports.getPoll = getPoll;
const vote = async (req, res, next) => {
    try {
        const pollId = req.params.pollId;
        const { emoji } = req.body;
        if (!emoji) {
            throw new errorHandler_1.AppError("emoji is required", 400);
        }
        if (!ALLOWED_EMOJIS.includes(emoji)) {
            throw new errorHandler_1.AppError(`Invalid emoji. Allowed emojis are: ${ALLOWED_EMOJIS.join(", ")}`, 400);
        }
        logger_1.default.info(`Received vote for poll ${pollId}: ${emoji}`);
        await pollQueries.updateVote(pollId, emoji);
        const results = await pollQueries.getPollResults(pollId);
        logger_1.default.info(`Vote recorded successfully for poll ${pollId}`);
        res.status(200).json({
            message: "Vote recorded successfully",
            results,
        });
    }
    catch (error) {
        logger_1.default.error("Error in vote:", error);
        next(error);
    }
};
exports.vote = vote;
const createPoll = async (req, res, next) => {
    try {
        const { question } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            throw new errorHandler_1.AppError("Unauthorized", 401);
        }
        if (!question) {
            throw new errorHandler_1.AppError("Question is required", 400);
        }
        logger_1.default.info(`Creating new poll for user ${userId}`);
        const poll = await pollQueries.createPoll(question, userId);
        logger_1.default.info(`Poll created successfully: ${poll.id}`);
        res.status(201).json(poll);
    }
    catch (error) {
        logger_1.default.error("Error in createPoll:", error);
        next(error);
    }
};
exports.createPoll = createPoll;
const getUserPolls = async (req, res, next) => {
    try {
        const userId = req.user?.userId; // Assuming user is attached to req by auth middleware
        if (!userId) {
            throw new errorHandler_1.AppError("Unauthorized", 401);
        }
        logger_1.default.info(`Fetching polls for user ${userId}`);
        const polls = await pollQueries.getUserPolls(userId);
        res.json(polls);
    }
    catch (error) {
        logger_1.default.error("Error in getUserPolls:", error);
        next(error);
    }
};
exports.getUserPolls = getUserPolls;
const deletePoll = async (req, res, next) => {
    try {
        const pollId = req.params.pollId;
        const userId = req.user.userId;
        logger_1.default.info(`Attempting to delete poll ${pollId} for user ${userId}`);
        const deletedPoll = await pollQueries.deletePoll(pollId, userId);
        if (!deletedPoll) {
            throw new errorHandler_1.AppError("Poll not found or user not authorized", 404);
        }
        logger_1.default.info(`Poll ${pollId} deleted successfully`);
        res.json({ message: "Poll deleted successfully" });
    }
    catch (error) {
        logger_1.default.error("Error in deletePoll:", error);
        next(error);
    }
};
exports.deletePoll = deletePoll;
const getAllPolls = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        logger_1.default.info(`Fetching all polls for user ${userId}`);
        const polls = await pollQueries.getAllPolls(userId);
        res.json(polls);
    }
    catch (error) {
        logger_1.default.error("Error in getAllPolls:", error);
        next(error);
    }
};
exports.getAllPolls = getAllPolls;
const generateQRCode = async (req, res, next) => {
    try {
        const pollId = req.params.pollId;
        const url = `${process.env.FRONTEND_URL}/vote/${pollId}`;
        const qrCode = await qrcode_1.default.toDataURL(url);
        res.json({ qrCode });
    }
    catch (error) {
        logger_1.default.error("Error in generateQRCode:", error);
        next(error);
    }
};
exports.generateQRCode = generateQRCode;
//# sourceMappingURL=pollController.js.map