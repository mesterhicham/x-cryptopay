import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayoutWallet } from '../payout-wallet.entity';
import { PayoutRequest } from '../payout-request.entity';
import { Merchant } from '../merchant.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PayoutService {
  constructor(
    @InjectRepository(PayoutWallet) private payoutWalletRepo: Repository<PayoutWallet>,
    @InjectRepository(PayoutRequest) private payoutRequestRepo: Repository<PayoutRequest>,
    @InjectRepository(Merchant) private merchantRepo: Repository<Merchant>,
    private walletService: WalletService,
  ) {}

  // =========================================
  // Merchant Dashboard (JWT Authenticated)
  // =========================================

  async getPayoutDashboard(userId: string) {
    const merchant = await this.merchantRepo.findOne({ where: { user: { id: userId } } });
    if (!merchant) throw new NotFoundException('Merchant not found');

    const pendingPayouts = await this.payoutRequestRepo.find({
      where: { merchant: { id: merchant.id }, status: 'PENDING' },
      order: { createdAt: 'DESC' },
    });

    const completedPayouts = await this.payoutRequestRepo.find({
      where: { merchant: { id: merchant.id }, status: 'COMPLETED' },
      order: { createdAt: 'DESC' },
      take: 20,
    });

    return { pendingPayouts, completedPayouts, merchantId: merchant.id };
  }

  async markPayoutCompleted(userId: string, payoutId: string, txHash: string) {
    const merchant = await this.merchantRepo.findOne({ where: { user: { id: userId } } });
    if (!merchant) throw new NotFoundException('Merchant not found');

    const payout = await this.payoutRequestRepo.findOne({ 
      where: { id: payoutId, merchant: { id: merchant.id } } 
    });
    if (!payout) throw new NotFoundException('Payout request not found');

    payout.status = 'COMPLETED';
    payout.txHash = txHash;
    await this.payoutRequestRepo.save(payout);
    return { success: true, message: 'Payout marked as completed' };
  }

  async rejectPayout(userId: string, payoutId: string) {
    const merchant = await this.merchantRepo.findOne({ where: { user: { id: userId } } });
    if (!merchant) throw new NotFoundException('Merchant not found');
    
    const payout = await this.payoutRequestRepo.findOne({ 
      where: { id: payoutId, merchant: { id: merchant.id } } 
    });
    if (!payout) throw new NotFoundException('Payout request not found');

    payout.status = 'REJECTED';
    await this.payoutRequestRepo.save(payout);
    return { success: true, message: 'Payout rejected' };
  }

  // =========================================
  // External API (API Key Authenticated)
  // =========================================

  async createPayoutRequest(merchant: Merchant, data: { amount: number; currency: string; network: string; toAddress: string }) {
    if (data.currency !== 'USDT') throw new BadRequestException('Only USDT payouts are supported');
    if (!['BSC', 'TRON'].includes(data.network)) throw new BadRequestException('Unsupported network');
    if (!data.toAddress) throw new BadRequestException('Destination address is required');
    if (data.amount <= 0) throw new BadRequestException('Amount must be greater than 0');

    const payout = this.payoutRequestRepo.create({
      merchant,
      amount: data.amount,
      currency: data.currency,
      network: data.network,
      toAddress: data.toAddress,
      status: 'PENDING',
    });

    await this.payoutRequestRepo.save(payout);

    return {
      id: payout.id,
      status: 'PENDING',
      message: 'Payout request queued. Merchant must approve via dashboard.',
    };
  }
}
