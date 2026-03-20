import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailSettings } from '../email-settings.entity';
import { EmailTemplate } from '../email-template.entity';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmailSettings, EmailTemplate])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
