$node = "C:\Users\ilqar\AppData\Local\Temp\node-portable\node-v20.18.1-win-x64\node.exe"
$script = @"
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({ datasources: { db: { url: 'file:./prisma/dev.db' } } });
p.$queryRaw`PRAGMA table_info(tailor_orders)`.then(r => { console.log(JSON.stringify(r, null, 2)); p.$disconnect(); });
"@
Set-Location C:\Users\ilqar\cehizlik-pos\apps\api
& $node -e $script
