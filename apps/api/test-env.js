// Simulate what the running server does with tsx + types
const path = require("path");
// Simulate DATABASE_URL reading from .env
const fs = require("fs");
const envPath = "C:/Users/ilqar/cehizlik-pos/apps/api/.env";
const envContent = fs.readFileSync(envPath, "utf8");
const lines = envContent.split("\n");
lines.forEach(line => {
  const [key, ...vals] = line.trim().split("=");
  if (key && !key.startsWith("#")) {
    process.env[key.trim()] = vals.join("=").trim().replace(/^["'"'"']|["'"'"']$/g, "");
  }
});
console.log("DATABASE_URL:", process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) : "NOT SET");
console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET ? "SET" : "NOT SET");
console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET ? "SET" : "NOT SET");
console.log("PORT:", process.env.PORT);
