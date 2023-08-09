import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ShortReviewResponseDto } from '../dto/review-response.dto';
import { IShortReview } from '../reviews.interface';

@Injectable()
export class ShortReviewRepository extends PrismaClient {
  async selectShortReviewPage(
    animationId: number,
    lastId?: number,
    pageSize?: number,
    sortKey?: string,
    sortDir?: string,
  ): Promise<ShortReviewResponseDto[]> {
    const prismaQuery: {
      where: Prisma.ReviewWhereInput;
      skip: number;
      take: number;
      cursor: NonNullable<any>;
      orderBy: NonNullable<unknown>;
    } = {
      where: Prisma.validator<Prisma.ReviewWhereInput>()({ animationId }),
      skip: lastId ? 1 : 0,
      take: pageSize ?? 20,
      cursor: lastId && { id: lastId },
      orderBy: {
        [sortKey ?? 'createdAt']: sortDir ?? 'desc',
      },
    };

    const shortReviews: IShortReview[] = await this.review.findMany({
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

    const shortReviewDtoList: ShortReviewResponseDto[] = [];
    shortReviews.forEach((shortReview) => {
      const shortReviewResponseDto = new ShortReviewResponseDto(shortReview);
      shortReviewDtoList.push(shortReviewResponseDto);
    });

    return shortReviewDtoList;
  }
}
