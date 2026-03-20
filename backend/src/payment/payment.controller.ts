import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(
    @Body('merchantId') merchantId: string,
    @Body('amount') amount: number,
    @Body('currency') currency: string,
    @Body('network') network: string,
  ) {
    return this.paymentService.createPayment(merchantId, amount, currency, network);
  }

  // Must come BEFORE :id to avoid being caught by the parametric route
  @UseGuards(JwtAuthGuard)
  @Get('merchant/transactions')
  async getMerchantTransactions(@Request() req: any) {
    const userId = req.user.userId || req.user.sub || req.user.id;
    return this.paymentService.getMerchantTransactions(userId);
  }

  @Get(':id')
  async getPaymentStatus(@Param('id') id: string) {
    return this.paymentService.getPaymentStatus(id);
  }
}
