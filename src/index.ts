import express from "express";
import dotenv from "dotenv";
import pollRoutes from "./routes/pollRoutes";
import { AppError } from "./middleware/errorHandler";
import logger from "./utils/logger";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", pollRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }

    res.status(500).json({ error: "Something went wrong!" });
  }
);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

process.on("SIGINT", async () => {
  logger.info("Shutting down server");
  process.exit();
});
