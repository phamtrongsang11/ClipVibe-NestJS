import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterDto, LoginDto } from '../auth/dto';
import { GraphqlAuthGuard } from '../auth/graphql-auth/graphql-auth.guard';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Response, Request } from 'express';
import { LoginResponse, RegisterResponse } from 'src/auth/types';
import { UserService } from './user.service';
import { User } from './user.model';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as FileUpload from 'graphql-upload/graphqlUploadExpress.js';
import { GraphQLErrorFilter } from 'src/filters.ts/custom-exception.filter';

@Resolver()
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseFilters(GraphQLErrorFilter)
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException({
        confirmPassword: 'Password and confirm password are not the same.',
      });
    }

    const { user } = await this.authService.register(registerDto, context.res);
    return { user };
  }

  @UseFilters(GraphQLErrorFilter)
  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(loginDto, context.res);
  }

  @Mutation(() => String)
  async logout(@Context() context: { res: Response }) {
    return this.authService.logout(context.res);
  }

  @Mutation(() => String)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    try {
      return this.authService.refreshToken(context.req, context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => User)
  async getUserById(
    @Context()
    context: {
      req: Request;
    },
  ) {
    return this.userService.getUserById(context.req.user.sub);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async updateUserProfile(
    @Context()
    context: { req: Request },
    @Args('fullname', { type: () => String, nullable: true }) fullname?: string,
    @Args('bio', { type: () => String, nullable: true }) bio?: string,
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image?: GraphQLUpload,
  ) {
    let imageUrl;
    if (image) {
      imageUrl = await this.storeImageAndGetURL(image);
    }
    return this.userService.updateProfile(context.req.user.sub, {
      fullname,
      bio,
      image: imageUrl,
    });
  }

  private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
    const { createReadStream, filename } = await file;
    const fileData = await file;
    console.log('fileData!', fileData);

    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(process.cwd(), 'public', uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/${uniqueFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));
    return imageUrl;
  }
}
