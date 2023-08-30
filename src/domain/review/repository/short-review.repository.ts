import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../global/config/prisma/prisma.service';
import {
  IReviewQuery,
  IShortReview,
  SortCondition,
} from '../reviews.interface';
import { AttractionElement, Prisma, ReviewType } from '@prisma/client';

@Injectable()
export class ShortReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectShortReviewPage(
    memberId?: number,
    animationId?: number,
    lastId?: number,
    pageSize?: number,
    sortCondition?: SortCondition,
  ): Promise<IShortReview[]> {
    const reviewWhere = Prisma.validator<Prisma.ReviewWhereInput>()({
      memberId: memberId ?? undefined,
      animationId: animationId ?? undefined,
      type: ReviewType.SHORT,
      deletedAt: null,
    });

    const reviewQuery = getReviewQuery(
      reviewWhere,
      lastId,
      pageSize,
      sortCondition,
    );

    return this.prisma.review.findMany({
      select: {
        id: true,
        memberId: true,
        animationId: true,
        rating: true,
        likeCount: true,
        createdAt: true,
        shortReview: {
          select: {
            comment: true,
            hasSpoiler: true,
          },
        },
      },
      ...reviewQuery,
    });
  }

  async isShortReviewExist(
    memberId: number,
    animationId: number,
  ): Promise<boolean> {
    return await this.prisma.review
      .findFirst({
        where: {
          memberId,
          animationId,
          type: ReviewType.SHORT,
          deletedAt: null,
        },
      })
      .then((shortReview) => Boolean(shortReview));
  }

  async insertShortReview(
    memberId: number,
    animationId: number,
    rating: number,
    comment: string,
    hasSpoiler: boolean,
    attractionPoints: AttractionElement[],
  ): Promise<number> {
    return await this.prisma.$transaction(async (prisma) => {
      const shortReviewId = await prisma.review
        .create({
          data: {
            memberId,
            animationId,
            type: ReviewType.SHORT,
            rating,
            shortReview: {
              create: {
                comment,
                hasSpoiler,
              },
            },
          },
        })
        .then((shortReview) => shortReview.id);

      await Promise.all(
        attractionPoints.map((attractionElement) => {
          prisma.attractionPoint.create({
            data: {
              reviewId: shortReviewId,
              attractionElement,
            },
          });
        }),
      );

      return shortReviewId;
    });
  }

  async updateShortReview(
    id: number,
    rating: number,
    comment: string,
    hasSpoiler: boolean,
  ): Promise<number> {
    const review = await this.findShortReviewById(id);
    return await this.prisma.review
      .update({
        where: { id: review!.id },
        data: {
          rating,
          shortReview: {
            update: {
              comment,
              hasSpoiler,
            },
          },
        },
      })
      .then((shortReview) => shortReview.id);
  }

  async createShortReviewLikes(
    memberId: number,
    reviewId: number,
  ): Promise<boolean> {
    const shortReview = await this.findShortReviewById(reviewId);
    this.prisma.reviewLike
      .create({
        data: {
          memberId,
          reviewId: shortReview!.id,
        },
      })
      .then((reviewLike) => {
        this.prisma.review.update({
          where: { id: reviewLike.reviewId },
          data: { likeCount: shortReview!.likeCount + 1 },
        });
      });

    return true;
  }

  async deleteShortReviewLikes(
    memberId: number,
    reviewId: number,
  ): Promise<boolean> {
    const shortReview = await this.findShortReviewById(reviewId);
    this.prisma.reviewLike
      .findFirstOrThrow({
        where: {
          memberId,
          reviewId: shortReview!.id,
        },
      })
      .then((reviewLike) => {
        this.prisma.$transaction(async (prisma) => {
          prisma.review.update({
            where: { id: reviewLike.reviewId },
            data: { likeCount: shortReview!.likeCount - 1 },
          });
          prisma.reviewLike.delete({
            where: { id: reviewLike.id },
          });
        });
      });

    return true;
  }

  async softDeleteShortReview(id: number): Promise<number> {
    const review = await this.findShortReviewById(id);
    return await this.prisma.review
      .update({
        where: { id: review!.id },
        data: { deletedAt: new Date() },
      })
      .then((review) => review.id);
  }

  private async findShortReviewById(id: number) {
    return await this.prisma.review
      .findUniqueOrThrow({
        include: { shortReview: true },
        where: {
          id,
          type: ReviewType.SHORT,
          deletedAt: null,
        },
      })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code == 'P2025') {
            throw new NotFoundException(
              `해당 리뷰를 찾을 수 없습니다. id: ${id}`,
            );
          }
        } else {
          throw new InternalServerErrorException(e);
        }
      });
  }
}

const getReviewQuery = (
  reviewWhere: Prisma.ReviewWhereInput,
  lastId?: number,
  pageSize?: number,
  sortCondition?: SortCondition,
): IReviewQuery => ({
  where: reviewWhere,
  skip: lastId ? 1 : 0,
  take: pageSize ?? 20,
  cursor: lastId && { id: lastId },
  orderBy: {
    [sortCondition?.split('|')[0] ?? 'createdAt']:
      sortCondition?.split('|')[1] ?? 'desc',
  },
});
