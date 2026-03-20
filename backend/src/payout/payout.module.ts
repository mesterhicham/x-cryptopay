import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';
import { PayoutWallet } from '../payout-wallet.entity';
import { PayoutRequest } from '../payout-request.entity';
import { Merchant } from '../merchant.entity';
import { WalletModule } from '../wallet/wallet.module';
import { ApiKeyGuard } from '../auth/api-key.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([PayoutWallet, PayoutRequest, Merchant]),
    WalletModule,
  ],
  controllers: [PayoutController],
  providers: [PayoutService, ApiKeyGuard],
  exports: [PayoutService],
})
export class PayoutModule {}
