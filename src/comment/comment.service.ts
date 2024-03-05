import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CommentCreateInput } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}
  async getCommnetsByPostId(postId: number): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: { user: true, post: true },
    });
  }

  async createComment(data: CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({
      data,
      include: {
        user: true,
        post: true,
      },
    });
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return new NotFoundException(
        `Comment with id ${commentId} does not exist`,
      );
    }

    if (comment.userId !== userId) {
      return new NotFoundException(
        `You don't have permission to delete this comment`,
      );
    }
    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
