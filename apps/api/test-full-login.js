const path = require("path");
const fs = require("fs");
const envPath = "C:/Users/ilqar/cehizlik-pos/apps/api/.env";
const envContent = fs.readFileSync(envPath, "utf8");
const lines = envContent.split("\n");
lines.forEach(line => {
  const trimmed = line.trim();
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx > 0 && !trimmed.startsWith("#")) {
    const key = trimmed.substring(0, eqIdx).trim();
    const val = trimmed.substring(eqIdx+1).trim().replace(/^["'"'"']|["'"'"']$/g, "");
    process.env[key] = val;
  }
});

// Now use the actual prisma client path that the app uses (via node_modules symlinks)
const apiBase = "C:/Users/ilqar/cehizlik-pos/apps/api";
process.chdir(apiBase);

// Resolve DATABASE_URL relative path
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("file:./")) {
  const absPath = path.join(apiBase, "prisma", "dev.db");
  process.env.DATABASE_URL = "file:" + absPath.replace(/\\/g, "/");
  console.log("Fixed DATABASE_URL:", process.env.DATABASE_URL);
}

const prismaPath = "C:/Users/ilqar/cehizlik-pos/node_modules/.pnpm/@prisma+client@6.6.0_prisma_66ad65b8aa48c66bbd9b3e64cfcf114a/node_modules/@prisma/client";
const { PrismaClient } = require(prismaPath);
const bcrypt = require("C:/Users/ilqar/cehizlik-pos/node_modules/.pnpm/bcryptjs@2.4.3/node_modules/bcryptjs/dist/bcrypt.js");
const jwt = require("C:/Users/ilqar/cehizlik-pos/node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js");
const crypto = require("crypto");

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Checking DATABASE_URL:", process.env.DATABASE_URL);
    const user = await prisma.user.findFirst({ where: { isActive: true, username: "admin" } });
    console.log("User found:", user ? "YES" : "NO");
    if (!user) return;
    const ok = await bcrypt.compare("Admin123!", user.passwordHash);
    console.log("Password match:", ok);
    const accessToken = jwt.sign({ sub: user.id, role: user.role, username: user.username }, process.env.JWT_ACCESS_SECRET, { expiresIn: "8h" });
    console.log("Access token:", accessToken ? "YES" : "NO");
    const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await prisma.session.create({ data: { userId: user.id, refreshTokenHash, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
    console.log("Session created:", session.id);
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    console.log("ALL OK - login would succeed");
  } catch(e) {
    console.error("ERROR in login flow:", e.message);
    console.error("Stack:", e.stack);
  } finally {
    await prisma.$disconnect();
  }
}
test();
