const path = require("path");
process.env.DATABASE_URL = "file:" + path.join("C:/Users/ilqar/cehizlik-pos/apps/api", "prisma/dev.db").replace(/\\/g,"/");
const prismaPath = "C:/Users/ilqar/cehizlik-pos/node_modules/.pnpm/@prisma+client@6.6.0_prisma_66ad65b8aa48c66bbd9b3e64cfcf114a/node_modules/@prisma/client";
const { PrismaClient } = require(prismaPath);
const prisma = new PrismaClient();
prisma.user.findFirst({ where: { username: "admin" } })
  .then(function(u) { console.log("User:", JSON.stringify(u)); return prisma.$disconnect(); })
  .catch(function(e) { console.error("ERR:", e.message, e.code); return prisma.$disconnect(); });
