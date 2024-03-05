import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    PostResolver,
    PostService,
    PrismaService,
    ConfigService,
    JwtService,
  ],
})
export class PostModule {}
