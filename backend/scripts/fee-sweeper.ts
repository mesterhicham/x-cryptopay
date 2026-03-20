import * as mysql from 'mysql2/promise';
import { ethers } from 'ethers';
import { TronWeb } from 'tronweb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from backend root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const BSC_RPC = 'https://bsc-dataseed.binance.org/';
const TRON_API = 'https://api.trongrid.io';

const USDT_CONTRACTS = {
  BSC: '0x55d398326f99059fF775485246999027B3197955',
  TRON: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
};

// Master Admin Seed Phrase
const _MNEMONIC = process.env.HD_WALLET_MNEMONIC;

// Provide your actual external Admin Cold Wallet Addresses here
const ADMIN_COLD_WALLET_BSC = process.env.ADMIN_COLD_WALLET_BSC || '0x000000000000000000000000000000000000dEaD'; 
const ADMIN_COLD_WALLET_TRON = process.env.ADMIN_COLD_WALLET_TRON || 'T00000000000000000000000000000000dEaD';

if (!_MNEMONIC) {
  console.error("❌ CRITICAL ERROR: Missing HD_WALLET_MNEMONIC in .env");
  process.exit(1);
}

// Re-assign after guard so TypeScript narrows the type to `string`
const MNEMONIC: string = _MNEMONIC;

const minimalERC20Abi = [
  "function balanceOf(address account) public view returns (uint256)",
  "function transfer(address to, uint256 value) public returns (bool)"
];

async function sweepFees() {
  console.log("==================================================");
  console.log("🚀 STARTING X-CRYPTOPAY PLATFORM FEE SWEEPER 🚀");
  console.log("==================================================\n");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'xcryptopay',
  });

  console.log("✅ Database connection established.");

  // Fetch all unique derived wallets from the database (skip index 0 which is the central gas station)
  const [rows]: any = await connection.execute('SELECT DISTINCT pathIndex, network, address FROM wallet_address WHERE pathIndex > 0');
  
  if (rows.length === 0) {
    console.log("➡️ No derived deposit wallets found in the database. Exiting...");
    process.exit(0);
  }

  console.log(`🔍 Discovered ${rows.length} generated deposit wallets to scan for residual USDT fees.\n`);

  const bscProvider = new ethers.JsonRpcProvider(BSC_RPC);
  const adminNodeBsc = ethers.HDNodeWallet.fromPhrase(MNEMONIC, "m/44'/60'/0'/0/0").connect(bscProvider);

  const adminNodeTronRaw = ethers.HDNodeWallet.fromPhrase(MNEMONIC, "m/44'/195'/0'/0/0");
  const tronWebAdmin = new TronWeb({ fullHost: TRON_API, privateKey: adminNodeTronRaw.privateKey.replace('0x', '') });

  let totalBscSwept = 0;
  let totalTronSwept = 0;

  for (const row of rows) {
    const { pathIndex, network, address } = row;

    try {
      if (network === 'BSC') {
        const childWallet = ethers.HDNodeWallet.fromPhrase(MNEMONIC, `m/44'/60'/0'/0/${pathIndex}`).connect(bscProvider);
        const usdtContract = new ethers.Contract(USDT_CONTRACTS.BSC, minimalERC20Abi, childWallet);
        
        const balance = await usdtContract.balanceOf(childWallet.address);
        if (balance > 0n) {
          const formattedUsdt = ethers.formatEther(balance);
          console.log(`[BSC] Found ${formattedUsdt} USDT accumulated fee in Wallet Path [${pathIndex}] (${address})`);
          
          const gasLimit = 60000n;
          const gasPrice = ethers.parseUnits('3', 'gwei'); // 3 Gwei assumption
          const bnbNeeded = gasLimit * gasPrice;

          console.log(`   -> ⛽ Injecting gas (${ethers.formatEther(bnbNeeded)} BNB) from Admin Gas Station...`);
          const fundTx = await adminNodeBsc.sendTransaction({ to: childWallet.address, value: bnbNeeded });
          await fundTx.wait();

          console.log(`   -> 🧹 Sweeping ${formattedUsdt} USDT to Admin Cold Wallet...`);
          const sweepTx = await usdtContract.transfer(ADMIN_COLD_WALLET_BSC, balance, { gasLimit, gasPrice });
          await sweepTx.wait();
          
          console.log(`   ✅ Success! TxHash: ${sweepTx.hash}`);
          totalBscSwept += Number(formattedUsdt);
        }
      } 
      else if (network === 'TRON') {
        const childRaw = ethers.HDNodeWallet.fromPhrase(MNEMONIC, `m/44'/195'/0'/0/${pathIndex}`);
        const tronWebChild = new TronWeb({ fullHost: TRON_API, privateKey: childRaw.privateKey.replace('0x', '') });
        
        const contractInfo = await tronWebChild.contract().at(USDT_CONTRACTS.TRON);
        const balanceStr = await contractInfo.balanceOf(address).call();
        const balance = parseInt(balanceStr.toString());
        
        if (balance > 0) {
          const usdtAmount = balance / 1_000_000;
          console.log(`[TRON] Found ${usdtAmount} USDT accumulated fee in Wallet Path [${pathIndex}] (${address})`);
          
          console.log(`   -> ⛽ Injecting gas (30 TRX) from Admin Gas Station...`);
          await tronWebAdmin.trx.sendTransaction(address, 30_000_000); // Send 30 TRX
          
          // Wait 5 seconds for TRX transaction insertion to be confirmed before sending TRC20 transfer
          await new Promise(resolve => setTimeout(resolve, 5000)); 

          console.log(`   -> 🧹 Sweeping ${usdtAmount} USDT to Admin Cold Wallet...`);
          const sweepTxId = await contractInfo.transfer(ADMIN_COLD_WALLET_TRON, balance).send({ feeLimit: 100_000_000 });
          
          console.log(`   ✅ Success! TxID: ${sweepTxId}`);
          totalTronSwept += usdtAmount;
        }
      }
    } catch (e) {
      console.error(`❌ Failed to sweep wallet ${address} (Path ${pathIndex}):`, e.message);
    }
  }

  console.log("\n==================================================");
  console.log("🎉 FEE CONSOLIDATION COMPLETE 🎉");
  console.log(`💰 Total BNB Chain Swept:  ${totalBscSwept.toFixed(2)} USDT`);
  console.log(`💰 Total TRON Chain Swept: ${totalTronSwept.toFixed(2)} USDT`);
  console.log("==================================================");

  await connection.end();
}

sweepFees().catch(err => {
  console.error("CRITICAL ERROR during sweep execution:", err);
  process.exit(1);
});
