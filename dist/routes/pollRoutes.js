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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pollController = __importStar(require("../controllers/pollController"));
const authController = __importStar(require("../controllers/authController"));
const auth_1 = require("../middleware/auth");
require("../types/express");
const router = express_1.default.Router();
// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/poll/:pollId", pollController.getPoll); // Public, includes results
router.post("/poll/:pollId/vote", pollController.vote); // Public
// Protected routes (for host users)
router.post("/poll", auth_1.authenticateToken, pollController.createPoll);
router.get("/user/polls", auth_1.authenticateToken, pollController.getUserPolls);
router.delete("/poll/:pollId", auth_1.authenticateToken, pollController.deletePoll);
router.get("/polls", auth_1.authenticateToken, pollController.getAllPolls);
router.get("/poll/:pollId/qr", auth_1.authenticateToken, pollController.generateQRCode);
exports.default = router;
//# sourceMappingURL=pollRoutes.js.map