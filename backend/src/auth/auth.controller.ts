import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { execFile } from 'child_process';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  companyName?: string;
}


@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password, Role.USER, {
      firstName: body.firstName,
      lastName: body.lastName,
      companyName: body.companyName,
    });
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.authService.getUserProfile(req.user.userId || req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin-stats')
  getAdminStats() {
    return { message: 'You have accessed a protected admin route!' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('sweep-fees')
  async sweepFees() {
    execFile('npx', ['ts-node', 'scripts/fee-sweeper.ts'], { cwd: process.cwd() }, (err, stdout, stderr) => {
       if (err) console.error('Sweep Error:', stderr);
       else console.log('Sweep Output:', stdout);
    });
    return { message: 'Sweeping sequence initiated in the background' };
  }
}
