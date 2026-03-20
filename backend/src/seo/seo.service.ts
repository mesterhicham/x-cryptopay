import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SEOSettings } from '../seo.entity';

@Injectable()
export class SEOService implements OnModuleInit {
  private readonly logger = new Logger(SEOService.name);

  constructor(
    @InjectRepository(SEOSettings)
    private seoRepo: Repository<SEOSettings>,
  ) {}

  async onModuleInit() {
    const count = await this.seoRepo.count();
    if (count === 0) {
      const defaultSEO = this.seoRepo.create({
        id: 1,
        title: 'x-cryptopay | The Premium Payment Gateway',
        description: 'Internal crypto payment gateway sweeping TRX, BNB and USDT automatically.',
        keywords: 'crypto, payment, gateway, blockchain, trx, bnb, usdt',
      });
      await this.seoRepo.save(defaultSEO);
      this.logger.log('Initialized default SEO settings');
    }
  }

  async getSEO(): Promise<SEOSettings | null> {
    return this.seoRepo.findOne({ where: { id: 1 } });
  }

  async updateSEO(data: Partial<SEOSettings>): Promise<SEOSettings> {
    let seo = await this.getSEO();
    if (!seo) {
      seo = this.seoRepo.create({ id: 1 });
    }
    Object.assign(seo, data);
    return this.seoRepo.save(seo);
  }
}
