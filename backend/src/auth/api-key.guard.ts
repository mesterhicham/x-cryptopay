import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '../merchant.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepo: Repository<Merchant>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }

    const merchant = await this.merchantRepo.findOne({ where: { apiKey } });
    
    if (!merchant) {
      throw new UnauthorizedException('Invalid API Key');
    }

    // Attach merchant to request for the controller to use
    request.merchant = merchant;
    return true;
  }
}
