import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from './merchant.entity';
import { PaymentRequest } from './payment-request.entity';
import { WalletAddress } from './wallet-address.entity';
import { WalletModule } from './wallet/wallet.module';
import { PaymentModule } from './payment/payment.module';

import { ScheduleModule } from '@nestjs/schedule';
import { ScannerModule } from './scanner/scanner.module';
import { ForwarderModule } from './forwarder/forwarder.module';
import { WebhookModule } from './webhook/webhook.module';
import { AuthModule } from './auth/auth.module';
import { PayoutModule } from './payout/payout.module';
import { User } from './user.entity';
import { PayoutWallet } from './payout-wallet.entity';
import { PayoutRequest } from './payout-request.entity';
import { EmailModule } from './email/email.module';
import { EmailSettings } from './email-settings.entity';
import { EmailTemplate } from './email-template.entity';
import { BrandingModule } from './branding/branding.module';
import { Branding } from './branding.entity';
import { SEOModule } from './seo/seo.module';
import { SEOSettings } from './seo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 8889), // Updated for User's environment
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASS', 'root'),
        database: configService.get<string>('DB_NAME', 'x-cryptopay'),
        entities: [Merchant, PaymentRequest, WalletAddress, User, PayoutWallet, PayoutRequest, EmailSettings, EmailTemplate, Branding, SEOSettings],
        synchronize: true, // Auto-create tables (only for MVP/Dev)
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Merchant, PaymentRequest, WalletAddress, Branding, SEOSettings]),

    ScheduleModule.forRoot(),
    WalletModule,
    PaymentModule,
    ScannerModule,
    ForwarderModule,
    WebhookModule,
    AuthModule,
    PayoutModule,
    EmailModule,
    BrandingModule,
    SEOModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
