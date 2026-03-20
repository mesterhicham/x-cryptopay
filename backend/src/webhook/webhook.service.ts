import { Injectable, Logger } from '@nestjs/common';
import { PaymentRequest } from '../payment-request.entity';
import * as crypto from 'crypto';
import { decrypt } from '../common/crypto.util';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  async dispatch(payment: PaymentRequest) {
    // Basic verification to ensure merchant exists and has a callback URL
    if (!payment.merchant || !payment.merchant.callbackUrl) {
      this.logger.debug(`No callback URL for payment ${payment.id}. Skipping webhook.`);
      return;
    }

    const payload = JSON.stringify({
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      network: payment.network,
      txHash: payment.txHash,
      depositAddress: payment.depositAddress,
    });

    // Decrypt the API Secret from the database, then use it for HMAC
    const decryptedSecret = decrypt(payment.merchant.apiSecret);
    const signature = crypto
      .createHmac('sha256', decryptedSecret)
      .update(payload)
      .digest('hex');

    this.logger.log(`Dispatching Webhook for Payment ${payment.id} to ${payment.merchant.callbackUrl}`);

    try {
      const response = await fetch(payment.merchant.callbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Cryptopay-Signature': signature,
        },
        body: payload,
      });

      if (!response.ok) {
        this.logger.warn(`Webhook failed with status ${response.status} for Payment ${payment.id}`);
      } else {
        this.logger.log(`Webhook successfully delivered for Payment ${payment.id}`);
      }
    } catch (err) {
      this.logger.error(`Failed to send webhook for Payment ${payment.id}: ${err.message}`);
    }
  }
}
