import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Merchant } from '../merchant.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Role } from './role.enum';
import { encrypt, decrypt } from '../common/crypto.util';
import { EmailService } from '../email/email.service';
import { EmailTemplateType } from '../email-template.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Merchant)
    private merchantRepo: Repository<Merchant>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = 'admin@x-cryptopay.com';
    const adminPassword = 'AdminPassword123!';
    
    const existingAdmin = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      console.log('Seeding default admin...');
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(adminPassword, salt);
      
      const admin = this.userRepository.create({
        email: adminEmail,
        passwordHash: hash,
        role: Role.ADMIN,
        firstName: 'System',
        lastName: 'Admin',
      });
      await this.userRepository.save(admin);
      console.log('Admin seeded successfully.');
    }
  }

  async register(
    email: string, 
    passwordHash: string, 
    role: Role = Role.USER,
    profile?: { firstName?: string; lastName?: string; companyName?: string }
  ) {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(passwordHash, salt);

    const user = this.userRepository.create({ 
      email, 
      passwordHash: hash, 
      role,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      companyName: profile?.companyName,
    });
    await this.userRepository.save(user);

    const apiKey = 'pk_live_' + crypto.randomBytes(16).toString('hex');
    const rawApiSecret = 'sk_live_' + crypto.randomBytes(32).toString('hex');
    
    // Encrypt the API secret before storing in the database
    const encryptedApiSecret = encrypt(rawApiSecret);

    const merchantName = profile?.companyName || email.split('@')[0] + ' Store';
    const merchant = this.merchantRepo.create({
      name: merchantName,
      apiKey,
      apiSecret: encryptedApiSecret,
      user
    });
    await this.merchantRepo.save(merchant);

    // Send Welcome Email
    this.emailService.sendEmail(user.email, EmailTemplateType.WELCOME, {
      firstName: user.firstName || 'Merchant',
      email: user.email,
      apiKey: apiKey,
    });

    // Return raw secret ONLY at registration (user must save it)
    const tokenData = this.generateToken(user);
    return {
      ...tokenData,
      apiCredentials: {
        apiKey,
        apiSecret: rawApiSecret,
        warning: '⚠️ Save your API Secret now. It will never be shown again in full.',
      }
    };
  }

  async login(email: string, passwordHash: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOne({ 
      where: { id: userId }, 
      relations: ['merchants'] 
    });
    if (!user) throw new UnauthorizedException('User not found');
    
    const merchant = user.merchants && user.merchants.length > 0 ? user.merchants[0] : null;
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      merchantId: merchant ? merchant.id : null,
      merchantName: merchant ? merchant.name : null,
      apiKey: merchant ? merchant.apiKey : null,
      apiSecret: merchant ? '••••••••' : null, // Never reveal, even partially
    };
  }

  /**
   * Internal method: decrypt the merchant's API secret for server-side use
   * (e.g. HMAC verification in WebhookService)
   */
  decryptApiSecret(encryptedSecret: string): string {
    return decrypt(encryptedSecret);
  }

  private generateToken(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }
}
