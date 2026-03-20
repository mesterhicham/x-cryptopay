import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRequest } from '../payment-request.entity';
import { PayoutRequest } from '../payout-request.entity';
import { Merchant } from '../merchant.entity';
import { WalletAddress } from '../wallet-address.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentRequest, PayoutRequest, Merchant, WalletAddress]),
    WalletModule
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
