import { Injectable, Logger } from '@nestjs/common';
import { PaymentRequest } from '../payment-request.entity';
import { WalletAddress } from '../wallet-address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletService } from '../wallet/wallet.service';
import { ethers } from 'ethers';
import { TronWeb } from 'tronweb';

const minimalERC20Abi = [
  "function transfer(address to, uint256 value) public returns (bool)"
];

@Injectable()
export class ForwarderService {
  private readonly logger = new Logger(ForwarderService.name);
  private bscProvider: ethers.JsonRpcProvider;

  private readonly contratos = {
    BSC: '0x55d398326f99059fF775485246999027B3197955', // USDT BSC
    TRON: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT TRON
  };

  private readonly PLATFORM_FEE_PERCENT = 1; // 1% Fee

  constructor(
    @InjectRepository(WalletAddress) private walletRepo: Repository<WalletAddress>,
    private walletService: WalletService,
  ) {
    this.bscProvider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
  }

  async forwardPayment(payment: PaymentRequest) {
    this.logger.log(`Initiating Auto-Forwarding for Payment ${payment.id}`);
    try {
      if (payment.network === 'BSC') {
        await this.forwardBSC(payment);
      } else if (payment.network === 'TRON') {
        await this.forwardTRON(payment);
      }
      
      payment.status = 'FORWARDED';
    } catch (err) {
      this.logger.error(`Forwarding failed for Payment ${payment.id}: ${err.message}`);
    }
  }

  private async forwardBSC(payment: PaymentRequest) {
    const walletRecord = await this.walletRepo.findOneBy({ address: payment.depositAddress });
    if (!walletRecord) throw new Error('Wallet not found for deposit address');
    
    const depositNode = this.walletService.generateAddress('BSC', walletRecord.pathIndex);
    const depositWallet = new ethers.Wallet(depositNode.privateKey, this.bscProvider);

    const adminNode = this.walletService.generateAddress('BSC', 0);
    const adminWallet = new ethers.Wallet(adminNode.privateKey, this.bscProvider);

    const destination = payment.merchant.destinationAddress || adminNode.address; 
    
    const amountNum = Number(payment.amount);
    const feeAmount = (amountNum * this.PLATFORM_FEE_PERCENT) / 100;
    const forwardAmount = amountNum - feeAmount;

    const forwardAmountWei = ethers.parseUnits(forwardAmount.toString(), 18);

    // Hardcoded gas estimate 60,000 * 3 Gwei
    const gasLimit = 60000n;
    const gasPrice = ethers.parseUnits('3', 'gwei');
    const bnbNeeded = gasLimit * gasPrice;

    this.logger.debug(`Sending ${ethers.formatEther(bnbNeeded)} BNB for gas to ${depositNode.address}`);
    const fundTx = await adminWallet.sendTransaction({
      to: depositNode.address,
      value: bnbNeeded
    });
    await fundTx.wait();
    
    const usdtContract = new ethers.Contract(this.contratos.BSC, minimalERC20Abi, depositWallet);
    const forwardTx = await usdtContract.transfer(destination, forwardAmountWei, {
      gasLimit,
      gasPrice
    });
    await forwardTx.wait();
    this.logger.log(`Forwarded ${forwardAmount} USDT to ${destination}. Tx: ${forwardTx.hash}`);
  }

  private async forwardTRON(payment: PaymentRequest) {
    const walletRecord = await this.walletRepo.findOneBy({ address: payment.depositAddress });
    if (!walletRecord) throw new Error('Wallet not found for TRON deposit address');
    
    const depositNode = this.walletService.generateAddress('TRON', walletRecord.pathIndex);
    const depositPrivateKey = depositNode.privateKey.replace('0x', '');

    const adminNode = this.walletService.generateAddress('TRON', 0);
    const adminPrivateKey = adminNode.privateKey.replace('0x', '');

    const tronWebDeposit = new TronWeb({ fullHost: 'https://api.trongrid.io', privateKey: depositPrivateKey });
    const tronWebAdmin = new TronWeb({ fullHost: 'https://api.trongrid.io', privateKey: adminPrivateKey });

    const destination = payment.merchant.destinationAddress || adminNode.address; 
    
    const amountNum = Number(payment.amount);
    const feeAmount = (amountNum * this.PLATFORM_FEE_PERCENT) / 100;
    const forwardAmount = amountNum - feeAmount;
    const forwardAmountSun = Math.floor(forwardAmount * 1_000_000);

    const trxNeeded = 30_000_000; // 30 TRX
    this.logger.debug(`Sending 30 TRX for gas to ${depositNode.address}`);
    await tronWebAdmin.trx.sendTransaction(depositNode.address, trxNeeded);
    
    // Wait for TRX propagation
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const contract = await tronWebDeposit.contract().at(this.contratos.TRON);
    const forwardTx = await contract.transfer(destination, forwardAmountSun).send({
      feeLimit: 100_000_000
    });
    this.logger.log(`Forwarded ${forwardAmount} USDT (TRON) to ${destination}. Tx: ${forwardTx}`);
  }
}
