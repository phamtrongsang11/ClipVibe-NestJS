import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [
    CommentResolver,
    CommentService,
    PrismaService,
    JwtService,
    ConfigService,
  ],
})
export class CommentModule {}
