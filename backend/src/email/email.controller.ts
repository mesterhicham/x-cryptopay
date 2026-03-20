import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { EmailTemplateType } from '../email-template.entity';

@Controller('api/email')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('settings')
  getSettings() {
    return this.emailService.getSettings();
  }

  @Post('settings')
  updateSettings(@Body() data: any) {
    return this.emailService.updateSettings(data);
  }

  @Get('templates')
  getTemplates() {
    return this.emailService.getTemplates();
  }

  @Post('templates')
  createTemplate(@Body() data: any) {
    return this.emailService.saveTemplate(null, data);
  }

  @Put('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() data: any) {
    return this.emailService.saveTemplate(id, data);
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.emailService.deleteTemplate(id);
  }

  @Post('test-send')
  async testSend(@Body() body: { to: string; type: EmailTemplateType; variables: any }) {
    await this.emailService.sendEmail(body.to, body.type, body.variables || {});
    return { message: 'Test email sent' };
  }
}
