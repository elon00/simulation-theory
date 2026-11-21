# =======================================================================
# ⚛️ SIMULATION THEORY ($SIM) — MASTER ETHEREUM DEPLOYER (POWERSHELL)
# One-Click Automated Deployment Script for Novice Vibe Coders
# =======================================================================

[CmdletBinding()]
param(
    [switch]$OpenFaucet,
    [string]$CustomRpc = ""
)

$ErrorActionPreference = "Stop"

# Automatically resolve the project directory
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $projectDir) { $projectDir = Get-Location }
Set-Location $projectDir

Clear-Host
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host " ⚛️  SIMULATION THEORY ($SIM) — 1-CLICK ETHEREUM MASTER DEPLOYER" -ForegroundColor Cyan
Write-Host "     Automated Contract Compilation • Wallet Generation • Sepolia Deploy" -ForegroundColor DarkCyan
Write-Host "=======================================================================" -ForegroundColor Cyan

# Step 1: Check compiled artifact
$artifactPath = Join-Path $projectDir "contracts\artifacts\SimulationTheoryToken.json"
if (-not (Test-Path $artifactPath)) {
    Write-Host "`n[1/3] Compiling Solidity Smart Contract with solc..." -ForegroundColor Yellow
    node -e "
    const fs = require('fs');
    const path = require('path');
    const solc = require('solc');
    const source = fs.readFileSync(path.join(process.cwd(), 'contracts', 'SimulationTheoryToken.sol'), 'utf8');
    const input = {
        language: 'Solidity',
        sources: { 'SimulationTheoryToken.sol': { content: source } },
        settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
    };
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const contract = output.contracts['SimulationTheoryToken.sol']['SimulationTheoryToken'];
    const artifact = {
        contractName: 'SimulationTheoryToken',
        abi: contract.abi,
        bytecode: '0x' + contract.evm.bytecode.object
    };
    const artifactDir = path.join(process.cwd(), 'contracts', 'artifacts');
    if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
    fs.writeFileSync(path.join(artifactDir, 'SimulationTheoryToken.json'), JSON.stringify(artifact, null, 2));
    "
    Write-Host "   ✅ Compilation Successful!" -ForegroundColor Green
} else {
    Write-Host "`n[1/3] Verified Compiled Contract Artifact (SimulationTheoryToken.json)" -ForegroundColor Green
}

# Step 2: Execute Master Deployer
Write-Host "`n[2/3] Launching Master Ethereum Deployer..." -ForegroundColor Yellow
if ($CustomRpc) {
    $env:SEPOLIA_RPC = $CustomRpc
}

node scripts/deploy_ethereum.js
$deployExitCode = $LASTEXITCODE

# Step 3: Handle Result
if ($deployExitCode -eq 0) {
    Write-Host "`n[3/3] Deployment Confirmed on Ethereum!" -ForegroundColor Green
    $recordPath = Join-Path $projectDir "deployed_address.json"
    if (Test-Path $recordPath) {
        $record = Get-Content $recordPath | ConvertFrom-Json
        Write-Host "Opening live contract on Etherscan in browser..." -ForegroundColor Cyan
        Start-Process $record.etherscanUrl
    }
} elseif ($deployExitCode -eq 2) {
    Write-Host "`n💡 FAUCET ACTION REQUIRED:" -ForegroundColor Yellow
    Write-Host "Would you like to open the free Sepolia ETH faucet in your browser? (Press Enter to open, or Ctrl+C to cancel)" -ForegroundColor Cyan
    $null = Read-Host
    Start-Process "https://cloud.google.com/application/faucets/ethereum/sepolia"
} else {
    Write-Host "`n❌ Deployment halted. Check error details above." -ForegroundColor Red
}
