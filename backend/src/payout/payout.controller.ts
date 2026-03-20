import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/payouts')
export class PayoutController {
  constructor(private payoutService: PayoutService) {}

  // ---- Merchant Dashboard Endpoints (JWT) ----

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    const userId = req.user.userId || req.user.sub;
    return this.payoutService.getPayoutDashboard(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  async markComplete(@Request() req: any, @Param('id') id: string, @Body() body: { txHash: string }) {
    const userId = req.user.userId || req.user.sub;
    return this.payoutService.markPayoutCompleted(userId, id, body.txHash);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  async rejectPayout(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.userId || req.user.sub;
    return this.payoutService.rejectPayout(userId, id);
  }

  // ---- External API Endpoint (API Key) ----

  @UseGuards(ApiKeyGuard)
  @Post('create')
  async createPayout(
    @Request() req: any,
    @Body() body: { amount: number; currency: string; network: string; toAddress: string }
  ) {
    return this.payoutService.createPayoutRequest(req.merchant, body);
  }
}
