const path = require("path");
process.env.DATABASE_URL = "file:C:/Users/ilqar/cehizlik-pos/apps/api/prisma/dev.db";
process.env.JWT_ACCESS_SECRET = "test_access_secret_key_32_chars!!";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret_key_32_chars!";

const jwtPath = "C:/Users/ilqar/cehizlik-pos/apps/api/src/utils/jwt.ts";
// Try loading compiled or check if ts-node is available
const prismaPath = "C:/Users/ilqar/cehizlik-pos/node_modules/.pnpm/@prisma+client@6.6.0_prisma_66ad65b8aa48c66bbd9b3e64cfcf114a/node_modules/@prisma/client";
const { PrismaClient } = require(prismaPath);
const prisma = new PrismaClient();
const crypto = require("crypto");
const bcrypt = require("C:/Users/ilqar/cehizlik-pos/node_modules/.pnpm/bcryptjs@2.4.3/node_modules/bcryptjs/dist/bcrypt.js");

async function test() {
  try {
    const user = await prisma.user.findFirst({ where: { isActive: true, username: "admin" } });
    console.log("Found user:", user ? user.username : "null");
    if (!user) { console.log("User not found!"); return; }
    const ok = await bcrypt.compare("Admin123!", user.passwordHash);
    console.log("Password ok:", ok);
    // Now try signAccessToken
    const jwt = require("C:/Users/ilqar/cehizlik-pos/node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js");
    const token = jwt.sign({ sub: user.id, role: user.role, username: user.username }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
    console.log("Token generated:", token ? "YES" : "NO");
    // try session create
    const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await prisma.session.create({ data: { userId: user.id, refreshTokenHash, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
    console.log("Session created:", session.id);
  } catch(e) { console.error("ERROR:", e.message, "\nStack:", e.stack); } 
  finally { await prisma.$disconnect(); }
}
test();
