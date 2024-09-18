import express from "express";
import dotenv from "dotenv";
import prisma from "./db/connection";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/test-db", async (req, res) => {
  try {
    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW()`;
    res.json({
      message: "Database connected successfully",
      time: result[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res
      .status(500)
      .json({
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
