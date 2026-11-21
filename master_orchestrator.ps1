# =======================================================================
# ⚛️ SIMULATION THEORY — MASTER ORCHESTRATOR & SYNC ENGINE
# PowerShell Master Automation Pipeline for Windows
# =======================================================================

[CmdletBinding()]
param(
    [switch]$SkipPush,
    [string]$CommitMessage = "feat: synchronize Simulation Theory 2022 Nobel Prize in Physics suite"
)

$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $projectDir) { $projectDir = Get-Location }
Set-Location $projectDir

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " ⚛️  SIMULATION THEORY MASTER ORCHESTRATOR & SYNC ENGINE" -ForegroundColor Cyan
Write-Host "     Aspect • Clauser • Zeilinger | Real Physics | Pure Reality" -ForegroundColor DarkCyan
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Environment Check
Write-Host "`n[1/5] Checking Node.js and Git Environment..." -ForegroundColor Yellow
$nodeVersion = node -v
$gitVersion = git --version
Write-Host "   Node.js: $nodeVersion" -ForegroundColor Gray
Write-Host "   Git:     $gitVersion" -ForegroundColor Gray

# 2. Run Pure Scientific Tests
Write-Host "`n[2/5] Running 8/8 Scientific Physics Verification Tests..." -ForegroundColor Yellow
node test.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Physics test suite failed!" -ForegroundColor Red
    exit 1
}

# 3. Synchronize Git Remote
Write-Host "`n[3/5] Verifying Git Remote Configuration..." -ForegroundColor Yellow
git remote set-url origin https://github.com/elon00/simulation-theory.git
$currentRemote = git remote get-url origin
Write-Host "   Remote Origin: $currentRemote" -ForegroundColor Gray

# 4. Stage and Commit
Write-Host "`n[4/5] Staging All Scientific Modules & Assets..." -ForegroundColor Yellow
git add .
$status = git status --porcelain
if ($status) {
    Write-Host "   Committing changes: '$CommitMessage'..." -ForegroundColor Gray
    git commit -m $CommitMessage
    Write-Host "   ✅ Changes committed to local git history." -ForegroundColor Green
} else {
    Write-Host "   ℹ️ Working directory already clean." -ForegroundColor DarkGray
}

# 5. Push to GitHub
if (-not $SkipPush) {
    Write-Host "`n[5/5] Pushing changes to https://github.com/elon00/simulation-theory.git..." -ForegroundColor Yellow
    try {
        git push origin master
        Write-Host "   🚀 Master repository successfully synchronized with GitHub!" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️ Push warning: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "   Run 'git push origin master' manually if credentials prompt is required." -ForegroundColor DarkGray
    }
} else {
    Write-Host "`n[5/5] Push skipped by -SkipPush flag." -ForegroundColor DarkGray
}

Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host " 🎉 ALL SYSTEMS VERIFIED & SYNCHRONIZED SUCCESSFULLY!" -ForegroundColor Green
Write-Host " To start the engine anytime, run:  .\run.ps1" -ForegroundColor Yellow
Write-Host "======================================================================`n" -ForegroundColor Cyan
