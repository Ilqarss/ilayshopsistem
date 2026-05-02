const path = require("path");
const fs = require("fs");
const envPath = "C:/Users/ilqar/cehizlik-pos/apps/api/.env";
const content = fs.readFileSync(envPath, "utf8");
const lines = content.split(/\r?\n/);
lines.forEach(line => {
  const eq = line.indexOf("=");
  if (eq > 0 && !line.trim().startsWith("#")) {
    const key = line.substring(0, eq).trim();
    const val = line.substring(eq+1).trim().replace(/^"|"$/g, "");
    console.log(key + "=" + val);
  }
});
