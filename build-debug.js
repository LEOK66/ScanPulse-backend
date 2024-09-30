Copyconsole.log("DATABASE_URL is set:", !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  const maskedURL = process.env.DATABASE_URL.replace(
    /:\/\/.*@/,
    "://****:****@"
  );
  console.log("Masked DATABASE_URL:", maskedURL);
} else {
  console.error(
    "DATABASE_URL is not set. Please set this environment variable in Railway."
  );
  process.exit(1);
}
