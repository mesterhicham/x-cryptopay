import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { User } from '../user.entity';
import { Merchant } from '../merchant.entity';
import { PaymentRequest } from '../payment-request.entity';
import { WalletAddress } from '../wallet-address.entity';
import { PayoutRequest } from '../payout-request.entity';
import { PayoutWallet } from '../payout-wallet.entity';
import { Role } from '../auth/role.enum';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Merchant)
    private merchantRepo: Repository<Merchant>,
    @InjectRepository(PaymentRequest)
    private paymentRepo: Repository<PaymentRequest>,
    @InjectRepository(WalletAddress)
    private walletRepo: Repository<WalletAddress>,
    @InjectRepository(PayoutRequest)
    private payoutRequestRepo: Repository<PayoutRequest>,
    @InjectRepository(PayoutWallet)
    private payoutWalletRepo: Repository<PayoutWallet>,
  ) {}

  async cleanupProduction() {
    this.logger.log('🚀 Starting Production Cleanup...');

    try {
      // 1. Delete all non-admin users
      // Note: This will also cascade delete merchants if we set up relations correctly, 
      // but we'll do it manually to be safe.
      
      this.logger.log('Clearing transactions and wallets...');
      await this.paymentRepo.delete({});
      await this.payoutRequestRepo.delete({});
      await this.payoutWalletRepo.delete({});
      await this.walletRepo.delete({});

      this.logger.log('Clearing merchants...');
      await this.merchantRepo.delete({});

      this.logger.log('Clearing non-admin users...');
      await this.userRepo.delete({
        role: Not(Role.ADMIN)
      });

      this.logger.log('✅ Cleanup complete! Only Admin users remain.');
      return { success: true, message: 'All test data cleared. Admin accounts preserved.' };
    } catch (error) {
      this.logger.error('❌ Cleanup failed:', error.message);
      throw new Error('Database cleanup failed: ' + error.message);
    }
  }
}
