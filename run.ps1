# =======================================================================
# ⚛️ SIMULATION THEORY: 2022 NOBEL PRIZE IN PHYSICS
# One-Click Master Launch & Orchestration Script (PowerShell)
# =======================================================================

[CmdletBinding()]
param(
    [switch]$NoBrowser,
    [switch]$SyncGit,
    [int]$Port = 3000
)

$ErrorActionPreference = "Stop"

# Automatically resolve the project directory
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $projectDir) { $projectDir = Get-Location }
Set-Location $projectDir

Clear-Host
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host " ⚛️  SIMULATION THEORY — 2022 NOBEL PRIZE IN PHYSICS ENGINE" -ForegroundColor Cyan
Write-Host "     Empirical Quantum Mechanics • Alain Aspect • John Clauser • Anton Zeilinger" -ForegroundColor DarkCyan
Write-Host "     Repository: https://github.com/elon00/simulation-theory" -ForegroundColor DarkCyan
Write-Host "=======================================================================" -ForegroundColor Cyan

# Step 1: Pre-flight Verification
Write-Host "`n[1/3] Running Scientific Verification Tests (Zero Mocks)..." -ForegroundColor Yellow
node test.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Scientific verification tests failed! Please inspect logs above." -ForegroundColor Red
    exit 1
}

# Step 2: Git Auto-Sync (optional flag)
if ($SyncGit) {
    Write-Host "`n[Git Sync] Synchronizing with https://github.com/elon00/simulation-theory..." -ForegroundColor Yellow
    git add .
    git commit -m "feat(physics): 2022 Nobel Prize in Physics full scientific synchronization"
    git push -u origin master
    Write-Host "✅ Git repository synchronized successfully!" -ForegroundColor Green
}

# Step 3: Launch Browser
if (-not $NoBrowser) {
    Write-Host "`n[2/3] Launching Interactive Laboratory UI in default browser..." -ForegroundColor Green
    Start-Process "http://localhost:$Port"
}

# Step 4: Start Scientific Server
Write-Host "`n[3/3] Starting Simulation Theory Scientific HTTP Server on port $Port..." -ForegroundColor Green
Write-Host "🌐 UI Dashboard: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "🛑 Press Ctrl + C to stop the server anytime.`n" -ForegroundColor DarkGray

node server.js
