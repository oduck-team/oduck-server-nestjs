import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AttractionElement, Prisma, Review, ReviewType } from '@prisma/client';
import { ILongReview, IReviewQuery, IShortReview } from './reviews.interface';
import { SortKey } from './reviews.enum';
import { PrismaService } from '../../global/config/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ShortReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectShortReviewPage(
    memberId?: number,
    animationId?: number,
    lastId?: number,
    pageSize?: number,
    sortKey?: string,
    sortDir?: string,
  ): Promise<IShortReview[]> {
    const reviewWhere = Prisma.validator<Prisma.ReviewWhereInput>()({
      memberId: memberId ?? undefined,
      animationId: animationId ?? undefined,
      type: ReviewType.SHORT,
      deletedAt: null,
    });

    const prismaQuery: IReviewQuery = {
      where: reviewWhere,
      skip: lastId ? 1 : 0,
      take: pageSize ?? 20,
      cursor: lastId && { id: lastId },
      orderBy: {
        [sortKey ?? 'createdAt']: sortDir ?? 'desc',
      },
    };

    return this.prisma.review.findMany({
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

  async insertShortReview(
    memberId: number,
    animationId: number,
    rating: number,
    comment: string,
    hasSpoiler: boolean,
    attractionPoints: AttractionElement[],
  ): Promise<Review> {
    const review = await this.prisma.review.create({
      data: {
        memberId,
        animationId,
        type: 'SHORT',
        rating,
        shortReview: {
          create: {
            comment,
            hasSpoiler,
          },
        },
      },
    });

    const promises = attractionPoints.map(async (attractionElement) => {
      await this.prisma.attractionPoint.create({
        data: {
          reviewId: review.id,
          attractionElement,
        },
      });
    });

    await Promise.all(promises);
    return review;
  }

  async softDeleteShortReview(id: number): Promise<Review> {
    const review = await this.findShortReviewById(id);
    return this.prisma.review.update({
      where: { id: review.id },
      data: { deletedAt: new Date() },
    });
  }

  private async findShortReviewById(id: number): Promise<Review> {
    return await this.prisma.review
      .findUniqueOrThrow({
        where: {
          id,
          deletedAt: null,
        },
      })
      .catch((e) => {
        if (e instanceof PrismaClientKnownRequestError) {
          throw new NotFoundException({
            code: e.code,
            field: e.meta,
            message: e.message,
          });
        } else {
          throw new InternalServerErrorException(e);
        }
      });
  }
}
