# Rebuild the permanent GitHub Pages bundle against a live cloud origin.
#
#   powershell -File deploy/rebuild-pages.ps1 -Origin https://careershelf.duckdns.org
#
# The shared link never changes (https://omkar12o.github.io/CareerShelf/); only the
# API/gateway URL baked into the bundle does. Run this once after deploy/install.sh.
param(
    [Parameter(Mandatory = $true)]
    [string]$Origin,

    [string]$Repo = 'https://github.com/Omkar12o/CareerShelf.git',
    [string]$Branch = 'gh-pages',
    [string]$Base = '/CareerShelf/'
)

$ErrorActionPreference = 'Stop'
$Origin = $Origin.TrimEnd('/')
if ($Origin -notmatch '^https://') {
    throw "Origin must start with https:// (got '$Origin')"
}

$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root 'pages-dist'
if (Test-Path $out) { Remove-Item $out -Recurse -Force }

$env:VITE_API_BASE_URL = $Origin
$env:VITE_YOUPI_GATEWAY_URL = $Origin
$env:VITE_YOUPI_API_URL = $Origin

Push-Location $root
try {
    node node_modules/vite/bin/vite.js build --base=$Base --outDir $out --emptyOutDir
    if ($LASTEXITCODE -ne 0) { throw 'vite build failed' }
} finally {
    Pop-Location
}

# SPA deep links: GitHub Pages serves 404.html for unknown paths.
Copy-Item (Join-Path $out 'index.html') (Join-Path $out '404.html') -Force
Set-Content (Join-Path $out '.nojekyll') '' -NoNewline

Push-Location $out
try {
    if (Test-Path (Join-Path $out '.git')) { Remove-Item (Join-Path $out '.git') -Recurse -Force }
    git init --quiet
    git checkout -b $Branch --quiet 2>$null
    git add -A
    git -c user.name='careershelf-deploy' -c user.email='deploy@careershelf.local' commit --quiet -m "deploy: storefront against $Origin"
    git remote add origin $Repo
    git push -f origin "${Branch}:${Branch}"
    if ($LASTEXITCODE -ne 0) { throw 'git push failed' }
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "Published. Wait ~1-2 min, then check:" -ForegroundColor Green
Write-Host "  https://omkar12o.github.io$Base"
Write-Host "  API origin baked into the bundle: $Origin"
