"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = prisma;
// Make sure to include this in your application shutdown logic
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit();
});
//# sourceMappingURL=connection.js.map