import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailSettings } from '../email-settings.entity';
import { EmailTemplate, EmailTemplateType } from '../email-template.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(EmailSettings)
    private readonly settingsRepo: Repository<EmailSettings>,
    @InjectRepository(EmailTemplate)
    private readonly templateRepo: Repository<EmailTemplate>,
  ) {}

  async onModuleInit() {
    await this.initTransporter();
    await this.initDefaultTemplates();
  }

  private readonly baseTemplate = (content: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background-color: #050505; color: #e2e8f0; }
        .wrapper { width: 100%; padding: 40px 0; background-color: #050505; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #14161b, #0d0f14); border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .header { padding: 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .content { padding: 40px; line-height: 1.6; }
        .footer { padding: 24px; text-align: center; font-size: 12px; color: #64748b; background: rgba(0,0,0,0.1); }
        .button { display: inline-block; padding: 14px 28px; background-color: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 24px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); }
        h1 { color: #ffffff; font-size: 24px; margin-bottom: 16px; }
        p { margin-bottom: 16px; color: #94a3b8; }
        .accent { color: #8b5cf6; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1 style="margin:0; color:#8b5cf6; letter-spacing: -0.5px;">{{merchantName}}</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            &copy; 2026 {{merchantName}}. All rights reserved.<br>
            Powered by x-cryptopay Secure Gateway
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  async initDefaultTemplates() {
    const templates = [
      {
        name: 'Welcome Email',
        subject: 'Welcome to the Future of Payments!',
        type: EmailTemplateType.WELCOME,
        htmlBody: this.baseTemplate(`
          <h1>Welcome, <span class="accent">{{firstName}}</span>!</h1>
          <p>We're thrilled to have you on board. Your account at {{merchantName}} is now active and ready for business.</p>
          <p>Start accepting crypto payments globally with lightning speed and ultimate security.</p>
          <a href="http://localhost:3001/login" class="button">Access Dashboard</a>
        `),
        isActive: true,
      },
      {
        name: 'Payment Confirmation',
        subject: 'Payment Successful - Invoice #{{invoiceId}}',
        type: EmailTemplateType.PAYMENT_CONFIRMATION,
        htmlBody: this.baseTemplate(`
          <div style="text-align:center; margin-bottom: 24px;">
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #10b981; padding: 8px 16px; border-radius: 100px; display: inline-block; font-size: 12px; font-weight: bold;">
              PAYMENT RECEIVED
            </div>
          </div>
          <h1>Transaction Successful</h1>
          <p>We have successfully received your payment of <span class="accent">{{amount}} {{currency}}</span> via the <span class="accent">{{network}}</span> network.</p>
          <div style="background: rgba(255,255,255,0.03); border-radius: 16px; padding: 20px; margin: 24px 0;">
            <table width="100%" style="font-size: 14px;">
              <tr><td style="color:#64748b; padding: 4px 0;">Invoice ID</td><td style="text-align:right; color:#fff;">#{{invoiceId}}</td></tr>
              <tr><td style="color:#64748b; padding: 4px 0;">Amount</td><td style="text-align:right; color:#fff;">{{amount}} {{currency}}</td></tr>
              <tr><td style="color:#64748b; padding: 4px 0;">Network</td><td style="text-align:right; color:#fff;">{{network}}</td></tr>
            </table>
          </div>
          <p>Your transaction has been finalized on the blockchain.</p>
        `),
        isActive: true,
      },
      {
        name: 'Payment Failed',
        subject: 'Payment Session Expired - Invoice #{{invoiceId}}',
        type: EmailTemplateType.PAYMENT_FAILED,
        htmlBody: this.baseTemplate(`
          <div style="text-align:center; margin-bottom: 24px;">
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; padding: 8px 16px; border-radius: 100px; display: inline-block; font-size: 12px; font-weight: bold;">
              EXPIRED
            </div>
          </div>
          <h1>Invoice Expired</h1>
          <p>The payment session for invoice <span class="accent">#{{invoiceId}}</span> has expired before completion.</p>
          <p>If you have already sent funds, please contact our support team with your transaction ID.</p>
          <a href="http://localhost:3001/support" class="button">Contact Support</a>
        `),
        isActive: true,
      },
      {
        name: 'Payout Approved',
        subject: 'Your Funds are on the way! - {{amount}} {{currency}}',
        type: EmailTemplateType.PAYOUT_APPROVED,
        htmlBody: this.baseTemplate(`
          <div style="text-align:center; margin-bottom: 24px;">
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: #3b82f6; padding: 8px 16px; border-radius: 100px; display: inline-block; font-size: 12px; font-weight: bold;">
              WITHDRAWAL APPROVED
            </div>
          </div>
          <h1>Payout Processed</h1>
          <p>Great news! Your payout request for <span class="accent">{{amount}} {{currency}}</span> has been approved and broadcast to the blockchain.</p>
          <div style="background: rgba(255,255,255,0.03); border-radius: 16px; padding: 20px; margin: 24px 0;">
            <p style="font-size: 12px; color: #64748b; margin-bottom: 8px;">Destination Wallet</p>
            <p style="color:#fff; font-family: monospace; font-size: 13px; margin: 0; word-break: break-all;">{{toAddress}}</p>
          </div>
          <p>Funds should arrive in your wallet shortly depending on network confirmations.</p>
        `),
        isActive: true,
      }
    ];

    for (const t of templates) {
      const exists = await this.templateRepo.findOne({ where: { type: t.type } });
      if (!exists) {
        await this.templateRepo.save(this.templateRepo.create(t));
        this.logger.log(`Initialized default template: ${t.type}`);
      } else {
        // Optional: Update existing if user hasn't modified? No, better let user manage.
        // But for this task, I'll force update to show the new design if it's the old simple one.
        if (exists.htmlBody.startsWith('<h1>Welcome')) {
           await this.templateRepo.update(exists.id, { htmlBody: t.htmlBody });
           this.logger.log(`Updated existing template to premium design: ${t.type}`);
        }
      }
    }
  }

  async initTransporter() {
    const settings = await this.getSettings();
    if (settings && settings.host && settings.user && settings.pass) {
      this.transporter = nodemailer.createTransport({
        host: settings.host,
        port: settings.port,
        secure: settings.secure,
        auth: {
          user: settings.user,
          pass: settings.pass,
        },
      });
      this.logger.log('Email Transporter initialized');
    } else {
      this.logger.warn('Email Transporter NOT initialized: missing SMTP settings');
    }
  }

  async getSettings(): Promise<EmailSettings> {
    let settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = this.settingsRepo.create({ id: 1 });
      await this.settingsRepo.save(settings);
    }
    return settings;
  }

  async updateSettings(data: Partial<EmailSettings>): Promise<EmailSettings> {
    const settings = await this.getSettings();
    Object.assign(settings, data);
    const saved = await this.settingsRepo.save(settings);
    await this.initTransporter(); // Re-init on update
    return saved;
  }

  async sendEmail(to: string, type: EmailTemplateType, variables: Record<string, any>) {
    const template = await this.templateRepo.findOne({ where: { type, isActive: true } });
    if (!template) {
      this.logger.error(`Email template not found or inactive: ${type}`);
      return;
    }

    if (!this.transporter) {
      this.logger.error('Cannot send email: Transporter not initialized');
      return;
    }

    const variablesWithBranding = { 
      merchantName: 'x-cryptopay', // Default
      ...variables 
    };

    const subject = this.replaceVariables(template.subject, variablesWithBranding);
    const html = this.replaceVariables(template.htmlBody, variablesWithBranding);
    const settings = await this.getSettings();

    try {
      await this.transporter.sendMail({
        from: `"${settings.fromName}" <${settings.fromEmail || settings.user}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${type}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
  }

  private replaceVariables(text: string, variables: Record<string, any>): string {
    return text.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      return variables[key.trim()] || match;
    });
  }

  // Template CRUD
  async getTemplates() {
    return this.templateRepo.find();
  }

  async saveTemplate(id: string | null, data: Partial<EmailTemplate>) {
    if (id) {
      await this.templateRepo.update(id, data);
      return this.templateRepo.findOne({ where: { id } });
    }
    const template = this.templateRepo.create(data);
    return this.templateRepo.save(template);
  }

  async deleteTemplate(id: string) {
    return this.templateRepo.delete(id);
  }
}
