import { Injectable } from '@nestjs/common';
import {
  IMemberProfile,
  IReviewQuery,
  IShortReview,
  SortCondition,
} from '../reviews.interface';
import {
  AttractionElement,
  Prisma,
  ReviewLike,
  ReviewType,
} from '@prisma/client';
import { PrismaService } from '../../../global/database/prisma/prisma.service';

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

    const shortReviews: IShortReview[] = await this.prisma.review.findMany({
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

    // 한 애니의 한줄 리뷰 목록 조회 시 작성자의 이름, 이미지 조회
    if (!memberId) {
      const shortReviewsWithMember: IShortReview[] = [];
      for (const shortReview of shortReviews) {
        const memberProfile: IMemberProfile =
          await this.prisma.memberProfile.findUniqueOrThrow({
            select: {
              name: true,
              imageUrl: true,
            },
            where: { id: shortReview.memberId },
          });
        shortReviewsWithMember.push({ ...shortReview, ...memberProfile });
      }
      return shortReviewsWithMember;
    }
    return shortReviews;
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

  async createShortReviewLikes(memberId, reviewId) {
    const shortReview = await this.findShortReviewById(reviewId);

    await this.prisma.$transaction(async (prisma) => {
      await prisma.reviewLike.create({
        data: {
          memberId,
          reviewId: shortReview!.id,
        },
      });

      await prisma.review.update({
        where: { id: shortReview!.id },
        data: { likeCount: shortReview!.likeCount + 1 },
      });
    });
  }

  async deleteShortReviewLikes(reviewLike: ReviewLike) {
    const shortReview = await this.findShortReviewById(reviewLike.reviewId);

    await this.prisma.$transaction(async (prisma) => {
      await prisma.reviewLike.delete({
        where: { id: reviewLike.id },
      });

      await prisma.review.update({
        where: { id: reviewLike.reviewId },
        data: { likeCount: shortReview!.likeCount - 1 },
      });
    });
  }

  async existShortReviewLikes(memberId: number, reviewId: number) {
    return await this.prisma.reviewLike.findFirst({
      where: {
        memberId,
        reviewId,
      },
    });
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
    return this.prisma.review.findUniqueOrThrow({
      include: { shortReview: true },
      where: {
        id,
        type: ReviewType.SHORT,
        deletedAt: null,
      },
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
