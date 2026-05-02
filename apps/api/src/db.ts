import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is set to an absolute path so Prisma can find the SQLite file
// regardless of the process working directory.
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:./")) {
  // Works in both CJS (__dirname) and ESM (import.meta.url) environments
  const dir = typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));
  const dbAbsPath = path.resolve(dir, "../prisma/dev.db").replace(/\\/g, "/");
  process.env.DATABASE_URL = `file:${dbAbsPath}`;
}

declare global {
  // allow global `var` declarations for hot-reload
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
