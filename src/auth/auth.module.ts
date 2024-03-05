import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AuthService, PrismaService, ConfigService, JwtService],
  exports: [JwtService, AuthService],
})
export class AuthModule {}
