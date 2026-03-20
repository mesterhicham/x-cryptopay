import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForwarderService } from './forwarder.service';
import { WalletAddress } from '../wallet-address.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletAddress]),
    WalletModule
  ],
  providers: [ForwarderService],
  exports: [ForwarderService],
})
export class ForwarderModule {}
