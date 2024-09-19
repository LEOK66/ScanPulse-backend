import express from "express";
import * as pollController from "../controllers/pollController";
import { validateVote } from "../middleware/validate";

const router = express.Router();

router.get("/poll/:pollId", pollController.getPoll);
router.post("/poll/:pollId/vote", validateVote, pollController.vote);
router.post("/poll", pollController.createPoll);

export default router;
