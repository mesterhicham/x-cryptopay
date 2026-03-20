import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branding } from '../branding.entity';

@Injectable()
export class BrandingService implements OnModuleInit {
  private readonly logger = new Logger(BrandingService.name);

  constructor(
    @InjectRepository(Branding)
    private brandingRepo: Repository<Branding>,
  ) {}

  async onModuleInit() {
    // Initialize default branding if not exists
    const count = await this.brandingRepo.count();
    if (count === 0) {
      const defaultBranding = this.brandingRepo.create({
        id: 1,
        siteName: 'x-cryptopay',
        primaryColor: '#8b5cf6',
      });
      await this.brandingRepo.save(defaultBranding);
      this.logger.log('Initialized default branding settings');
    }
  }

  async getBranding(): Promise<Branding | null> {
    return this.brandingRepo.findOne({ where: { id: 1 } });
  }

  async updateBranding(data: Partial<Branding>): Promise<Branding> {
    let branding = await this.getBranding();
    if (!branding) {
      branding = this.brandingRepo.create({ id: 1 });
    }
    Object.assign(branding, data);
    return this.brandingRepo.save(branding);
  }
}
