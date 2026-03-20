import { 
  Controller, 
  Get, 
  Patch, 
  Post, 
  Body, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandingService } from './branding.service';
import { Branding } from '../branding.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get()
  async getBranding() {
    return this.brandingService.getBranding();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateBranding(@Body() data: Partial<Branding>) {
    return this.brandingService.updateBranding(data);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    // Return the public URL
    const url = `/uploads/${file.filename}`;
    return { url };
  }
}
