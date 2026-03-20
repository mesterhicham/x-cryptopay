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
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('MYSQL_URL') || configService.get<string>('DATABASE_URL');
        return {
          type: 'mysql',
          url: url, // If url is provided, TypeORM uses it
          host: !url ? configService.get<string>('DB_HOST', 'localhost') : undefined,
          port: !url ? configService.get<number>('DB_PORT', 8889) : undefined,
          username: !url ? configService.get<string>('DB_USER', 'root') : undefined,
          password: !url ? configService.get<string>('DB_PASS', 'root') : undefined,
          database: !url ? configService.get<string>('DB_NAME', 'x-cryptopay') : undefined,
          entities: [Merchant, PaymentRequest, WalletAddress, User, PayoutWallet, PayoutRequest, EmailSettings, EmailTemplate, Branding, SEOSettings],
          synchronize: true, // Auto-create tables for MVP / Railway deployment
        };
      },
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
