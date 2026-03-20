import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRequest } from '../payment-request.entity';
import { PayoutRequest } from '../payout-request.entity';
import { Merchant } from '../merchant.entity';
import { WalletAddress } from '../wallet-address.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentRequest) private paymentRepo: Repository<PaymentRequest>,
    @InjectRepository(PayoutRequest) private payoutRepo: Repository<PayoutRequest>,
    @InjectRepository(Merchant) private merchantRepo: Repository<Merchant>,
    @InjectRepository(WalletAddress) private walletRepo: Repository<WalletAddress>,
    private walletService: WalletService,
  ) {}

  async createPayment(merchantId: string, amount: number, currency: string, network: string) {
    if (currency !== 'USDT') throw new BadRequestException('Only USDT is supported for MVPs');
    if (!['BSC', 'TRON'].includes(network)) throw new BadRequestException('Unsupported network');

    const merchant = await this.merchantRepo.findOneBy({ id: merchantId });
    if (!merchant) throw new NotFoundException('Merchant not found');

    // Get next index for wallet derivation
    const count = await this.walletRepo.count({ where: { network } });
    const nextIndex = count + 1;

    // Generate address
    const { address } = this.walletService.generateAddress(network as 'BSC'|'TRON', nextIndex);

    // Save Wallet
    const newWallet = this.walletRepo.create({
      address,
      pathIndex: nextIndex,
      network,
      inUse: true,
    });
    await this.walletRepo.save(newWallet);

    // Save Payment Request
    const payment = this.paymentRepo.create({
      merchant,
      amount,
      currency,
      network,
      status: 'PENDING',
      depositAddress: address,
    });
    await this.paymentRepo.save(payment);

    return {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      network: payment.network,
      depositAddress: payment.depositAddress,
      status: payment.status,
    };
  }

  async getPaymentStatus(id: string) {
    const payment = await this.paymentRepo.findOneBy({ id });
    if (!payment) throw new NotFoundException('Payment not found');
    return {
      id: payment.id,
      status: payment.status,
      depositAddress: payment.depositAddress,
      txHash: payment.txHash,
    };
  }

  /**
   * Returns unified deposit + withdrawal transactions for a merchant's dashboard.
   */
  async getMerchantTransactions(userId: string) {
    const merchant = await this.merchantRepo.findOne({ where: { user: { id: userId } } });
    if (!merchant) throw new NotFoundException('Merchant not found');

    // Fetch all deposits (PaymentRequests)
    const deposits = await this.paymentRepo.find({
      where: { merchant: { id: merchant.id } },
      order: { createdAt: 'DESC' },
    });

    // Fetch all withdrawals (PayoutRequests)
    const payouts = await this.payoutRepo.find({
      where: { merchant: { id: merchant.id } },
      order: { createdAt: 'DESC' },
    });

    // Unify into a single list
    const transactions = [
      ...deposits.map(d => ({
        id: d.id,
        type: 'DEPOSIT' as const,
        amount: d.amount,
        currency: d.currency,
        network: d.network,
        status: d.status,
        from: 'Customer',
        to: d.depositAddress || '-',
        invoiceId: d.id.slice(0, 8).toUpperCase(),
        txHash: d.txHash || null,
        createdAt: d.createdAt,
      })),
      ...payouts.map(p => ({
        id: p.id,
        type: 'WITHDRAWAL' as const,
        amount: p.amount,
        currency: p.currency,
        network: p.network,
        status: p.status,
        from: merchant.name,
        to: p.toAddress,
        invoiceId: p.id.slice(0, 8).toUpperCase(),
        txHash: p.txHash || null,
        createdAt: p.createdAt,
      })),
    ];

    // Sort by date descending
    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      transactions,
      summary: {
        totalDeposits: deposits.length,
        totalWithdrawals: payouts.length,
        pendingWithdrawals: payouts.filter(p => p.status === 'PENDING').length,
      }
    };
  }
}
