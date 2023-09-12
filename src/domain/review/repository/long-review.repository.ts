import { Injectable } from '@nestjs/common';
import { ILongReview, IReviewQuery, SortCondition } from '../reviews.interface';
import { LongReviewImage, Prisma, ReviewType } from '@prisma/client';
import { PrismaService } from '../../../global/database/prisma/prisma.service';

@Injectable()
export class LongReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectLongReviewPage(
    memberId?: number,
    animationId?: number,
    lastId?: number,
    pageSize?: number,
    sortCondition?: SortCondition,
  ): Promise<ILongReview[]> {
    const reviewWhere = Prisma.validator<Prisma.ReviewWhereInput>()({
      memberId: memberId ?? undefined,
      animationId: animationId ?? undefined,
      type: ReviewType.LONG,
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
        updatedAt: true,
        longReview: {
          select: {
            title: true,
            content: true,
          },
        },
      },
      ...reviewQuery,
    });
  }

  async selectLongReviewById(id: number): Promise<ILongReview> {
    const review = await this.findLongReviewById(id);
    const imageUrls = await this.prisma.longReviewImage.findMany({
      select: { imageUrl: true },
      where: { longReviewId: review!.id },
    });

    return {
      id: review!.id,
      memberId: review!.memberId,
      animationId: review!.animationId,
      createdAt: review!.createdAt,
      updatedAt: review!.updatedAt,
      imageUrls,
      longReview: {
        title: review!.longReview!.title,
        content: review!.longReview!.content,
      },
    };
  }

  async insertLongReview(
    memberId: number,
    animationId: number,
    rating: number,
    title: string,
    content: string,
    imageUrls: string[],
  ): Promise<ILongReview> {
    const images: LongReviewImage[] = [];
    const review = await this.prisma.$transaction(async (prisma) => {
      const longReview = await prisma.review.create({
        data: {
          memberId,
          animationId,
          type: ReviewType.LONG,
          rating,
          longReview: {
            create: {
              title,
              content,
            },
          },
        },
      });

      await Promise.all(
        imageUrls.map(async (imageUrl) => {
          const image = await prisma.longReviewImage.create({
            data: {
              longReviewId: longReview.id,
              imageUrl,
            },
          });

          images.push(image);
        }),
      );

      return longReview;
    });

    const urls: { imageUrl: string }[] = [];
    images.map((image) => {
      urls.push({ imageUrl: image.imageUrl });
    });

    return {
      id: review.id,
      memberId: review.memberId,
      animationId: review.animationId,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      imageUrls: urls,
      longReview: {
        title,
        content,
      },
    };
  }

  async updateLongReview(
    id: number,
    rating: number,
    title: string,
    content: string,
    imageUrls: string[],
  ): Promise<ILongReview> {
    const found = await this.findLongReviewById(id);
    const images: LongReviewImage[] = [];

    const longReview = await this.prisma.$transaction(async (prisma) => {
      const updatedReview = await prisma.review.update({
        data: {
          rating,
          longReview: {
            update: {
              data: {
                title,
                content,
              },
            },
          },
        },
        where: { id: found!.id },
      });

      await prisma.longReviewImage.deleteMany({
        where: { longReviewId: updatedReview.id },
      });

      await Promise.all(
        imageUrls.map(async (imageUrl) => {
          const image = await prisma.longReviewImage.create({
            data: {
              longReviewId: updatedReview.id,
              imageUrl,
            },
          });

          images.push(image);
        }),
      );

      return updatedReview;
    });

    const urls: { imageUrl: string }[] = [];
    images.map((image) => {
      urls.push({ imageUrl: image.imageUrl });
    });

    return {
      id: longReview.id,
      memberId: longReview.memberId,
      animationId: longReview.animationId,
      createdAt: longReview.createdAt,
      updatedAt: longReview.updatedAt,
      imageUrls: urls,
      longReview: {
        title,
        content,
      },
    };
  }

  async softDeleteLongReview(id: number): Promise<number> {
    const review = await this.findLongReviewById(id);
    return await this.prisma.$transaction(async (prisma) => {
      const longReviewId = await prisma.review
        .update({
          where: { id: review!.id },
          data: { deletedAt: new Date() },
        })
        .then((review) => review.id);

      await prisma.longReviewImage.deleteMany({
        where: { longReviewId },
      });

      return longReviewId;
    });
  }

  private async findLongReviewById(id: number) {
    return this.prisma.review.findUniqueOrThrow({
      include: { longReview: true },
      where: {
        id,
        type: ReviewType.LONG,
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
