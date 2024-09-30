"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVote = void 0;
const errorHandler_1 = require("./errorHandler");
const validateVote = (req, res, next) => {
    const { voterId, emoji } = req.body;
    if (!voterId && !emoji) {
        throw new errorHandler_1.AppError("voterId and emoji are required", 400);
    }
    if (!voterId ||
        (typeof voterId !== "string" && !emoji) ||
        typeof emoji !== "string") {
        throw new errorHandler_1.AppError("Invalid voterId and Invalid emoji", 400);
    }
    if (!voterId || typeof voterId !== "string") {
        throw new errorHandler_1.AppError("Invalid voterId", 400);
    }
    if (!emoji || typeof emoji !== "string") {
        throw new errorHandler_1.AppError("Invalid emoji", 400);
    }
    next();
};
exports.validateVote = validateVote;
//# sourceMappingURL=validate.js.map