const { execSync } = require("child_process");

console.log("Node version:", process.version);
console.log("NPM version:", execSync("npm --version").toString().trim());

try {
  console.log("Running Prisma generate...");
  execSync("npx prisma generate", { stdio: "inherit" });

  console.log("Running Prisma migrate deploy...");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });

  console.log("Running TypeScript compilation...");
  execSync("npx tsc --verbose", { stdio: "inherit" });

  console.log("Build completed successfully");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
