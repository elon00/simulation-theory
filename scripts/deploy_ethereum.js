/**
 * Simulation Theory ($SIM) Master Ethereum Deployer
 * Powered by Ethers.js v6
 * Zero-stress, automatic wallet generation, Sepolia testnet deployment, and verification.
 */

const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const ENV_PATH = path.join(__dirname, '..', '.env');
const ARTIFACT_PATH = path.join(__dirname, '..', 'contracts', 'artifacts', 'SimulationTheoryToken.json');
const DEPLOYED_PATH = path.join(__dirname, '..', 'deployed_address.json');

// Free Reliable Sepolia Public RPC endpoints with auto-failover
const SEPOLIA_RPCS = [
    'https://ethereum-sepolia-rpc.publicnode.com',
    'https://rpc.sepolia.org',
    'https://1rpc.io/sepolia',
    'https://rpc2.sepolia.org'
];

function loadOrCreateEnv() {
    let env = {};
    if (fs.existsSync(ENV_PATH)) {
        const lines = fs.readFileSync(ENV_PATH, 'utf8').split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                const [key, ...vals] = trimmed.split('=');
                env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
            }
        }
    }

    if (!env.PRIVATE_KEY) {
        console.log("🔑 No existing wallet found in .env. Generating a fresh Ethereum wallet for you...");
        const newWallet = ethers.Wallet.createRandom();
        env.PRIVATE_KEY = newWallet.privateKey;
        env.WALLET_ADDRESS = newWallet.address;
        env.SEPOLIA_RPC = env.SEPOLIA_RPC || SEPOLIA_RPCS[0];

        const envContent = [
            "# Auto-generated Ethereum Wallet for Simulation Theory",
            "# KEEP THIS SECRET! Never share your private key.",
            `PRIVATE_KEY="${newWallet.privateKey}"`,
            `WALLET_ADDRESS="${newWallet.address}"`,
            `SEPOLIA_RPC="${env.SEPOLIA_RPC}"`,
            ""
        ].join('\n');

        fs.writeFileSync(ENV_PATH, envContent);
        console.log(`✅ New Wallet Generated and saved to .env:`);
        console.log(`   Address: ${newWallet.address}`);
    }

    return env;
}

async function getWorkingProvider(customRpc) {
    const rpcs = customRpc ? [customRpc, ...SEPOLIA_RPCS] : SEPOLIA_RPCS;
    for (const rpc of rpcs) {
        try {
            const provider = new ethers.JsonRpcProvider(rpc);
            const net = await provider.getNetwork();
            if (net) return { provider, rpcUrl: rpc, chainId: Number(net.chainId) };
        } catch (e) {
            // Try next RPC
        }
    }
    throw new Error("Could not connect to any Sepolia Ethereum RPC. Please check your internet connection.");
}

async function main() {
    console.log("=======================================================================");
    console.log(" ⚛️  SIMULATION THEORY ($SIM) — ONE-CLICK ETHEREUM MASTER DEPLOYER");
    console.log("=======================================================================");

    const env = loadOrCreateEnv();

    if (!fs.existsSync(ARTIFACT_PATH)) {
        throw new Error(`Compiled artifact not found at ${ARTIFACT_PATH}. Run compilation first.`);
    }

    const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, 'utf8'));

    console.log("\n[1/4] Connecting to Ethereum Sepolia Network...");
    const { provider, rpcUrl, chainId } = await getWorkingProvider(env.SEPOLIA_RPC);
    console.log(`   Connected to RPC: ${rpcUrl}`);
    console.log(`   Network Chain ID: ${chainId} (Ethereum Sepolia Testnet)`);

    const wallet = new ethers.Wallet(env.PRIVATE_KEY, provider);
    console.log(`   Deployer Wallet:  ${wallet.address}`);

    console.log("\n[2/4] Checking Deployer Gas Balance...");
    const balance = await provider.getBalance(wallet.address);
    const ethBalance = Number(ethers.formatEther(balance));
    console.log(`   Balance: ${ethBalance.toFixed(6)} Sepolia ETH`);

    // Minimum required gas (around 0.002 - 0.005 ETH for contract deployment)
    const MIN_REQUIRED_ETH = 0.003;

    if (ethBalance < MIN_REQUIRED_ETH) {
        console.log("\n" + "=".repeat(71));
        console.log(" ⚠️  WALLET HAS INSUFFICIENT SEPOLIA ETH TO BROADCAST TRANSACTION");
        console.log("=".repeat(71));
        console.log(`Your deployer address is:`);
        console.log(`👉  ${wallet.address}\n`);
        console.log(`You need ~0.005 free Sepolia ETH for gas. Grab it in 1 click from any of these free faucets:`);
        console.log(`  1. Google Cloud Web3 Faucet: https://cloud.google.com/application/faucets/ethereum/sepolia`);
        console.log(`  2. PoW Sepolia Faucet:        https://sepolia-faucet.pk910.de/`);
        console.log(`  3. QuickNode Faucet:         https://faucet.quicknode.com/ethereum/sepolia`);
        console.log(`  4. Alchemy Sepolia Faucet:   https://www.alchemy.com/faucets/ethereum-sepolia`);
        console.log(`\n💡 Once you claim free faucet ETH for ${wallet.address}, run this command again:`);
        console.log(`   .\\deploy_ethereum.ps1`);
        console.log("=".repeat(71) + "\n");
        process.exit(2);
    }

    console.log("\n[3/4] Creating Contract Factory & Estimating Gas...");
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

    console.log("   Deploying SimulationTheoryToken ($SIM)...");
    const contract = await factory.deploy();

    console.log(`   Transaction broadcasted! Hash: ${contract.deploymentTransaction().hash}`);
    console.log("   Waiting for block confirmation on Ethereum...");

    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log("\n[4/4] Verification & Record Keeping...");
    console.log("=".repeat(71));
    console.log(" 🎉 SMART CONTRACT DEPLOYED SUCCESSFULLY ON ETHEREUM!");
    console.log("=".repeat(71));
    console.log(` 📍 Contract Address: ${contractAddress}`);
    console.log(` 🪙 Token Symbol:     $SIM (Simulation Theory)`);
    console.log(` 💎 Total Supply:     100,000,000 SIM`);
    console.log(` 🔗 Etherscan Link:   https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log("=".repeat(71));

    // Save deployed record
    const deployRecord = {
        network: "Ethereum Sepolia Testnet",
        chainId,
        contractName: "SimulationTheoryToken",
        symbol: "SIM",
        contractAddress,
        deployerAddress: wallet.address,
        transactionHash: contract.deploymentTransaction().hash,
        etherscanUrl: `https://sepolia.etherscan.io/address/${contractAddress}`,
        deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(DEPLOYED_PATH, JSON.stringify(deployRecord, null, 2));
    console.log(`\nRecord saved to: deployed_address.json`);
    console.log(`View live token on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}\n`);
}

if (require.main === module) {
    main().catch(err => {
        console.error("\n❌ Deployment Error:", err.message || err);
        process.exit(1);
    });
}

module.exports = main;
