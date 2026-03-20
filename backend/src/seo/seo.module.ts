import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SEOSettings } from '../seo.entity';
import { SEOService } from './seo.service';
import { SEOController } from './seo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SEOSettings])],
  providers: [SEOService],
  controllers: [SEOController],
  exports: [SEOService],
})
export class SEOModule {}
