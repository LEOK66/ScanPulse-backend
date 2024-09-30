import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export const validateVote = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { voterId, emoji } = req.body;

  if (!voterId && !emoji) {
    throw new AppError("voterId and emoji are required", 400);
  }

  if (
    !voterId ||
    (typeof voterId !== "string" && !emoji) ||
    typeof emoji !== "string"
  ) {
    throw new AppError("Invalid voterId and Invalid emoji", 400);
  }

  if (!voterId || typeof voterId !== "string") {
    throw new AppError("Invalid voterId", 400);
  }

  if (!emoji || typeof emoji !== "string") {
    throw new AppError("Invalid emoji", 400);
  }

  // You might want to add a check for allowed emojis here
  const ALLOWED_EMOJIS = ["😊", "😐", "😢"];
  if (!ALLOWED_EMOJIS.includes(emoji)) {
    throw new AppError(
      `Invalid emoji. Allowed emojis are: ${ALLOWED_EMOJIS.join(", ")}`,
      400
    );
  }

  next();
};
