// Simulate what tsx server does: cwd is where the server was launched from
// Check: does "file:./dev.db" resolve correctly when cwd is apps/api?
const path = require("path");
const fs = require("fs");
const cwd = "C:/Users/ilqar/cehizlik-pos/apps/api";
const dbRelative = "./dev.db";
const dbAbsolute = path.resolve(cwd, dbRelative);
console.log("DB would be at:", dbAbsolute);
console.log("Exists:", fs.existsSync(dbAbsolute));

const dbRelative2 = "./prisma/dev.db";
const dbAbsolute2 = path.resolve(cwd, dbRelative2);
console.log("DB with prisma/ would be at:", dbAbsolute2);
console.log("Exists:", fs.existsSync(dbAbsolute2));
