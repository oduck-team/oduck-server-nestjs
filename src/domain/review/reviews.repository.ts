import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { IShortReview } from './reviews.interface';

@Injectable()
export class ShortReviewRepository extends PrismaClient {
  async selectShortReviewPage(
    animationId: number,
    lastId?: number,
    pageSize?: number,
    sortKey?: string,
    sortDir?: string,
  ): Promise<IShortReview[]> {
    const prismaQuery: {
      where: {
        reviewId: Prisma.ReviewWhereInput;
        deletedAt: Date | null;
      };
      skip: number;
      take: number;
      cursor: NonNullable<any>;
      orderBy: NonNullable<unknown>;
    } = {
      where: {
        reviewId: Prisma.validator<Prisma.ReviewWhereInput>()({ animationId }),
        deletedAt: null,
      },
      skip: lastId ? 1 : 0,
      take: pageSize ?? 20,
      cursor: lastId && { id: lastId },
      orderBy: {
        [sortKey ?? 'createdAt']: sortDir ?? 'desc',
      },
    };

    return this.review.findMany({
      select: {
        id: true,
        memberId: true,
        animationId: true,
        rating: true,
        createdAt: true,
        shortReview: {
          select: {
            comment: true,
            hasSpoiler: true,
          },
        },
      },
      ...prismaQuery,
    });
  }
}
