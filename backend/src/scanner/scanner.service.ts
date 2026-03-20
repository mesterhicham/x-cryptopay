import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRequest } from '../payment-request.entity';
import { ethers } from 'ethers';
import { TronWeb } from 'tronweb';
import { ForwarderService } from '../forwarder/forwarder.service';
import { WebhookService } from '../webhook/webhook.service';

const minimalERC20Abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

@Injectable()
export class ScannerService {
  private readonly logger = new Logger(ScannerService.name);
  
  private readonly contratos = {
    BSC: '0x55d398326f99059fF775485246999027B3197955', // BSC Mainnet USDT
    TRON: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // TRON USDT (Mainnet)
  };

  private bscProvider: ethers.JsonRpcProvider;

  constructor(
    @InjectRepository(PaymentRequest) private paymentRepo: Repository<PaymentRequest>,
    private forwarderService: ForwarderService,
    private webhookService: WebhookService,
  ) {
    this.bscProvider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.debug('Polling for PENDING payments...');
    
    const payments = await this.paymentRepo.find({
      where: [
        { status: 'PENDING' },
        { status: 'CONFIRMING' }
      ],
      relations: ['merchant'],
      take: 50,
    });

    for (const payment of payments) {
      if (payment.network === 'BSC') {
        await this.scanBSC(payment);
      } else if (payment.network === 'TRON') {
        await this.scanTRON(payment);
      }
    }
  }

  private async scanBSC(payment: PaymentRequest) {
    this.logger.debug(`Scanning BSC for payment ${payment.id}`);
    try {
      const contract = new ethers.Contract(this.contratos.BSC, minimalERC20Abi, this.bscProvider);
      const currentBlock = await this.bscProvider.getBlockNumber();
      const fromBlock = currentBlock - 1000;
      const filter = contract.filters.Transfer(null, payment.depositAddress);
      // Wait for the query to ensure we don't spam
      const logs = await contract.queryFilter(filter, fromBlock, currentBlock);

      let totalReceived = BigInt(0);
      let targetTxHash: string | null = null;

      for (const log of logs) {
         const parsed = contract.interface.parseLog(log);
         if (parsed) {
            totalReceived += parsed.args[2];
            targetTxHash = log.transactionHash;
         }
      }

      const requiredAmountWei = ethers.parseUnits(payment.amount.toString(), 18);

      if (totalReceived >= requiredAmountWei && targetTxHash) {
         payment.status = 'COMPLETED';
         payment.txHash = targetTxHash;
         await this.paymentRepo.save(payment);
         this.logger.log(`Payment ${payment.id} COMPLETED (BSC)!`);
         await this.webhookService.dispatch(payment);
         await this.forwarderService.forwardPayment(payment);
         await this.paymentRepo.save(payment);
      }
    } catch (e) {
      this.logger.error(`Error scanning BSC: ${e.message}`);
    }
  }

  private async scanTRON(payment: PaymentRequest) {
    this.logger.debug(`Scanning TRON for payment ${payment.id}`);
    try {
       const url = `https://api.trongrid.io/v1/accounts/${payment.depositAddress}/transactions/trc20`;
       const response = await fetch(`${url}?contract_address=${this.contratos.TRON}`);
       const data = await response.json();

       if (data.success && data.data && data.data.length > 0) {
          let totalReceived = BigInt(0);
          let targetTxHash: string | null = null;

          for (const tx of data.data) {
             if (tx.to === payment.depositAddress) {
                totalReceived += BigInt(tx.value);
                targetTxHash = tx.transaction_id;
             }
          }

          const requiredAmountSmallest = BigInt(Math.floor(parseFloat(payment.amount.toString()) * 1_000_000));
          if (totalReceived >= requiredAmountSmallest && targetTxHash) {
             payment.status = 'COMPLETED';
             payment.txHash = targetTxHash;
             await this.paymentRepo.save(payment);
             this.logger.log(`Payment ${payment.id} COMPLETED (TRON)!`);
             await this.webhookService.dispatch(payment);
             await this.forwarderService.forwardPayment(payment);
             await this.paymentRepo.save(payment);
          }
       }
    } catch (e) {
      this.logger.error(`Error scanning TRON: ${e.message}`);
    }
  }
}
