import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScannerService } from './scanner.service';

import { PaymentRequest } from '../payment-request.entity';
import { ForwarderModule } from '../forwarder/forwarder.module';
import { WebhookModule } from '../webhook/webhook.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentRequest]),
    ForwarderModule,
    WebhookModule,
  ],
  providers: [ScannerService],
})
export class ScannerModule {}
