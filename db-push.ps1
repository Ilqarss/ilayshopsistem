# Stop backend first
$conns = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
foreach($c in $conns){ Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue }
Start-Sleep 3

Set-Location C:\Users\ilqar\cehizlik-pos\apps\api
$env:DATABASE_URL = "file:./prisma/dev.db"
$node = "C:\Users\ilqar\AppData\Local\Temp\node-portable\node-v20.18.1-win-x64\node.exe"

# Generate
Write-Host "Running prisma generate..."
& $node node_modules\prisma\build\index.js generate 2>&1
Write-Host ""

# Push
Write-Host "Running prisma db push..."
& $node node_modules\prisma\build\index.js db push --accept-data-loss 2>&1
Write-Host ""

# Restart backend
Start-Sleep 2
Start-Process -FilePath cmd -ArgumentList '/c cd /d C:\Users\ilqar\cehizlik-pos\apps\api & set DATABASE_URL=file:./prisma/dev.db & C:\Users\ilqar\AppData\Local\Temp\node-portable\node-v20.18.1-win-x64\node.exe node_modules\tsx\dist\cli.mjs src/server.ts' -WindowStyle Hidden
Write-Host "Backend restarted"
