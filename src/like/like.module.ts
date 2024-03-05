import { Module } from '@nestjs/common';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth/graphql-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    LikeResolver,
    LikeService,
    PrismaService,
    GraphqlAuthGuard,
    ConfigService,
    JwtService
  ],
})
export class LikeModule {}
