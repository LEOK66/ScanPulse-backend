import { Request, Response } from "express";
import * as pollController from "../controllers/pollController";
import * as pollQueries from "../db/queries";
import { AppError } from "../middleware/errorHandler";

// Mock the pollQueries module
jest.mock("../db/queries");
// Mock the logger
jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe("Poll Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe("getPoll", () => {
    it("should return a poll when it exists", async () => {
      const mockPoll = { id: "1", question: "Test Question" };
      (pollQueries.getPoll as jest.Mock).mockResolvedValue(mockPoll);

      mockRequest.params = { pollId: "1" };

      await pollController.getPoll(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockPoll);
    });

    it("should throw an error when poll does not exist", async () => {
      (pollQueries.getPoll as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { pollId: "1" };

      await pollController.getPoll(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("vote", () => {
    it("should record a vote and return results", async () => {
      const mockResults = { "😊": 1 };
      (pollQueries.updateVote as jest.Mock).mockResolvedValue({});
      (pollQueries.getPollResults as jest.Mock).mockResolvedValue(mockResults);

      mockRequest.params = { pollId: "1" };
      mockRequest.body = { voterId: "voter1", emoji: "😊" };

      await pollController.vote(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Vote recorded successfully",
        results: mockResults,
      });
    });

    it("should throw an error when vote data is missing", async () => {
      mockRequest.params = { pollId: "1" };
      mockRequest.body = {};

      await pollController.vote(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});
