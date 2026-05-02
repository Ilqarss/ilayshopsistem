const bcryptPath = "C:/Users/ilqar/cehizlik-pos/node_modules/.pnpm/bcryptjs@2.4.3/node_modules/bcryptjs/dist/bcrypt.js";
const bcrypt = require(bcryptPath);
const hash = "$2a$12$EhBf4l4pN6aKnU3/F39HHeaZenn0.Q.X0X3qwH1333YbW0CTYKs6a";
bcrypt.compare("Admin123!", hash).then(function(ok) { console.log("Compare result:", ok); }).catch(function(e) { console.error("ERR:", e.message); });
