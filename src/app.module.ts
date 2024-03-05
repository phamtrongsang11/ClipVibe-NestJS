import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { UserResolver } from './user/user.resolver';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommentService } from './comment/comment.service';
import { CommentResolver } from './comment/comment.resolver';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // This points to the 'public' folder where your static files are located
      serveRoot: '/', // This means files will be available under 'http://localhost:3001/files/'
    }),
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot({}),
    PostModule,
    LikeModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserResolver,
    UserService,
    AuthService,
    PrismaService,
    JwtService,
    CommentService,
    CommentResolver,
  ],
})
export class AppModule {}
