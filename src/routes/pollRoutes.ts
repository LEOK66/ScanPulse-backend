import express from "express";
import * as pollController from "../controllers/pollController";
import * as authController from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";
import rateLimit from "express-rate-limit";
const router = express.Router();

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 votes per windowMs
});

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/poll/:pollId", pollController.getPoll); // Public, includes results
router.post("/poll/:pollId/vote", pollController.vote); // Public

// Protected routes (for host users)
router.post("/poll", authenticateToken, pollController.createPoll);
router.get("/user/polls", authenticateToken, pollController.getUserPolls);
router.delete("/poll/:pollId", authenticateToken, pollController.deletePoll);
router.get("/polls", authenticateToken, pollController.getAllPolls);
router.get(
  "/poll/:pollId/qr",
  authenticateToken,
  pollController.generateQRCode
);

router.get(
  "/analytics/user",
  authenticateToken,
  pollController.getUserAnalytics
);
router.get(
  "/analytics/poll/:pollId",
  authenticateToken,
  pollController.getPollAnalytics
);
export default router;
