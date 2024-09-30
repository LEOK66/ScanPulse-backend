import { Request, Response, NextFunction } from "express";
import * as pollQueries from "../db/queries";
import { AppError } from "../middleware/errorHandler";
import logger from "../utils/logger";
import QRCode from "qrcode";

const ALLOWED_EMOJIS = ["😊", "😐", "😢"] as const;
type AllowedEmoji = (typeof ALLOWED_EMOJIS)[number];

export const getPoll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pollId = req.params.pollId;
    logger.info(`Fetching poll with id: ${pollId}`);
    const poll = await pollQueries.getPoll(pollId);
    if (!poll) {
      logger.warn(`Poll not found: ${pollId}`);
      throw new AppError("Poll not found", 404);
    }
    const results = await pollQueries.getPollResults(pollId);
    res.json({ ...poll, results });
  } catch (error) {
    logger.error("Error in getPoll:", error);
    next(error);
  }
};

export const vote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pollId = req.params.pollId;
    const { emoji } = req.body;
    if (!emoji) {
      throw new AppError("emoji is required", 400);
    }
    if (!ALLOWED_EMOJIS.includes(emoji as AllowedEmoji)) {
      throw new AppError(
        `Invalid emoji. Allowed emojis are: ${ALLOWED_EMOJIS.join(", ")}`,
        400
      );
    }
    logger.info(`Received vote for poll ${pollId}: ${emoji}`);
    await pollQueries.updateVote(pollId, emoji as AllowedEmoji);
    const results = await pollQueries.getPollResults(pollId);
    logger.info(`Vote recorded successfully for poll ${pollId}`);
    res.status(200).json({
      message: "Vote recorded successfully",
      results,
    });
  } catch (error) {
    logger.error("Error in vote:", error);
    next(error);
  }
};

export const createPoll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    if (!question) {
      throw new AppError("Question is required", 400);
    }
    logger.info(`Creating new poll for user ${userId}`);
    const poll = await pollQueries.createPoll(question, userId);
    logger.info(`Poll created successfully: ${poll.id}`);
    res.status(201).json(poll);
  } catch (error) {
    logger.error("Error in createPoll:", error);
    next(error);
  }
};

export const getUserPolls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId; // Assuming user is attached to req by auth middleware
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    logger.info(`Fetching polls for user ${userId}`);
    const polls = await pollQueries.getUserPolls(userId);
    res.json(polls);
  } catch (error) {
    logger.error("Error in getUserPolls:", error);
    next(error);
  }
};

export const deletePoll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pollId = req.params.pollId;
    const userId = (req.user as any).userId;
    logger.info(`Attempting to delete poll ${pollId} for user ${userId}`);
    const deletedPoll = await pollQueries.deletePoll(pollId, userId);
    if (!deletedPoll) {
      throw new AppError("Poll not found or user not authorized", 404);
    }
    logger.info(`Poll ${pollId} deleted successfully`);
    res.json({ message: "Poll deleted successfully" });
  } catch (error) {
    logger.error("Error in deletePoll:", error);
    next(error);
  }
};

export const getAllPolls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as any).userId;
    logger.info(`Fetching all polls for user ${userId}`);
    const polls = await pollQueries.getAllPolls(userId);
    res.json(polls);
  } catch (error) {
    logger.error("Error in getAllPolls:", error);
    next(error);
  }
};

export const generateQRCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pollId = req.params.pollId;
    const url = `${process.env.FRONTEND_URL}/vote/${pollId}`;
    const qrCode = await QRCode.toDataURL(url);
    res.json({ qrCode });
  } catch (error) {
    logger.error("Error in generateQRCode:", error);
    next(error);
  }
};

export const getUserAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const analytics = await pollQueries.getUserAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    logger.error("Error in getUserAnalytics:", error);
    next(error);
  }
};

export const getPollAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pollId } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const analytics = await pollQueries.getPollAnalytics(pollId, userId);
    res.json(analytics);
  } catch (error) {
    logger.error("Error in getPollAnalytics:", error);
    next(error);
  }
};
