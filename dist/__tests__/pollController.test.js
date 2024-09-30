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
Object.defineProperty(exports, "__esModule", { value: true });
const pollController = __importStar(require("../controllers/pollController"));
const pollQueries = __importStar(require("../db/queries"));
const errorHandler_1 = require("../middleware/errorHandler");
// Mock the pollQueries module
jest.mock("../db/queries");
// Mock the logger
jest.mock("../utils/logger", () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));
describe("Poll Controller", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
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
            pollQueries.getPoll.mockResolvedValue(mockPoll);
            mockRequest.params = { pollId: "1" };
            await pollController.getPoll(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.json).toHaveBeenCalledWith(mockPoll);
        });
        it("should throw an error when poll does not exist", async () => {
            pollQueries.getPoll.mockResolvedValue(null);
            mockRequest.params = { pollId: "1" };
            await pollController.getPoll(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalledWith(expect.any(errorHandler_1.AppError));
        });
    });
    describe("vote", () => {
        it("should record a vote and return results", async () => {
            const mockResults = { "😊": 1 };
            pollQueries.updateVote.mockResolvedValue({});
            pollQueries.getPollResults.mockResolvedValue(mockResults);
            mockRequest.params = { pollId: "1" };
            mockRequest.body = { voterId: "voter1", emoji: "😊" };
            await pollController.vote(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Vote recorded successfully",
                results: mockResults,
            });
        });
        it("should throw an error when vote data is missing", async () => {
            mockRequest.params = { pollId: "1" };
            mockRequest.body = {};
            await pollController.vote(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalledWith(expect.any(errorHandler_1.AppError));
        });
    });
});
//# sourceMappingURL=pollController.test.js.map