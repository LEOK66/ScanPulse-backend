import { Request, Response, NextFunction } from "express";
import * as pollQueries from "../db/queries";
import { AppError } from "../middleware/errorHandler";
import logger from "../utils/logger";

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
    res.json(poll);
  } catch (error) {
    logger.error("Error in getPoll:", error);
    next(error);
  }
};

export const vote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pollId = req.params.pollId;
    const { voterId, emoji } = req.body;
    if (!voterId || !emoji) {
      throw new AppError("voterId and emoji are required", 400);
    }
    logger.info(`Received vote for poll ${pollId}: ${voterId} - ${emoji}`);
    await pollQueries.updateVote(pollId, voterId, emoji);
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

// Add this function if you want to keep the ability to create polls
export const createPoll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question, qrCodeUrl } = req.body;
    if (!question || !qrCodeUrl) {
      throw new AppError("Question and qrCodeUrl are required", 400);
    }
    const poll = await pollQueries.createPoll(question, qrCodeUrl);
    res.status(201).json(poll);
  } catch (error) {
    next(error);
  }
};
