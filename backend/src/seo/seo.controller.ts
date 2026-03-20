import { 
  Controller, 
  Get, 
  Patch, 
  Body, 
  UseGuards
} from '@nestjs/common';
import { SEOService } from './seo.service';
import { SEOSettings } from '../seo.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('seo')
export class SEOController {
  constructor(private readonly seoService: SEOService) {}

  @Get()
  async getSEO() {
    return this.seoService.getSEO();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateSEO(@Body() data: Partial<SEOSettings>) {
    return this.seoService.updateSEO(data);
  }
}
