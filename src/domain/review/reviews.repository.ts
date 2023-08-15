import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  AttractionElement,
  LongReviewImage,
  Prisma,
  Review,
  ReviewType,
} from '@prisma/client';
import {
  ILongReview,
  IReviewQuery,
  IShortReview,
  SortCondition,
} from './reviews.interface';
import { PrismaService } from '../../global/config/prisma/prisma.service';

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

  async insertShortReview(
    memberId: number,
    animationId: number,
    rating: number,
    comment: string,
    hasSpoiler: boolean,
    attractionPoints: AttractionElement[],
  ): Promise<Review> {
    const shortReview = await this.prisma.review.create({
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
          reviewId: shortReview.id,
          attractionElement,
        },
      });
    });

    await Promise.all(promises);
    return shortReview;
  }

  async softDeleteShortReview(id: number): Promise<number> {
    const review: Review | void = await this.prisma.review
      .findUniqueOrThrow({
        where: {
          id,
          deletedAt: null,
        },
      })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code == 'P2001') {
            throw new NotFoundException(
              `해당 리뷰를 찾을 수 없습니다. id: ${id}`,
            );
          }
        } else {
          throw new InternalServerErrorException(e);
        }
      });

    const deletedReview = await this.prisma.review.update({
      where: { id: review!.id },
      data: { deletedAt: new Date() },
    });

    return deletedReview.id;
  }
}

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
    const longReview: ILongReview | void = await this.prisma.review
      .findUniqueOrThrow({
        select: {
          id: true,
          memberId: true,
          animationId: true,
          createdAt: true,
          updatedAt: true,
          longReview: {
            select: {
              title: true,
              content: true,
            },
          },
        },
        where: {
          id,
          deletedAt: null,
        },
      })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code == 'P2001') {
            throw new NotFoundException(
              `해당 리뷰를 찾을 수 없습니다. id: ${id}`,
            );
          }
        } else {
          throw new InternalServerErrorException(e);
        }
      });

    const images = await this.prisma.longReviewImage.findMany({
      select: { imageUrl: true },
      where: { longReviewId: longReview!.id },
    });

    return { ...longReview!, imageUrls: images };
  }

  async insertLongReview(
    memberId: number,
    animationId: number,
    rating: number,
    title: string,
    content: string,
    imageUrls: string[],
  ): Promise<ILongReview> {
    const longReview = await this.prisma.review.create({
      data: {
        memberId,
        animationId,
        type: 'LONG',
        rating,
        longReview: {
          create: {
            title,
            content,
          },
        },
      },
    });

    const images: LongReviewImage[] = [];
    const promises = imageUrls.map(async (imageUrl) => {
      const image = await this.prisma.longReviewImage.create({
        data: {
          longReviewId: longReview.id,
          imageUrl,
        },
      });
      images.push(image);
    });

    await Promise.all(promises);

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

  async updateLongReview(
    id: number,
    rating: number,
    title: string,
    content: string,
    imageUrls: string[],
  ): Promise<ILongReview> {
    const review = await this.findLongReviewById(id);
    await this.prisma.review.update({
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
      where: { id: review!.id },
    });

    const images: LongReviewImage[] = [];
    const promises = imageUrls.map(async (imageUrl) => {
      const image = await this.prisma.longReviewImage.update({
        data: { imageUrl },
        where: { longReviewId: review!.id },
      });
      images.push(image);
    });

    await Promise.all(promises);

    const urls: { imageUrl: string }[] = [];
    images.map((image) => {
      urls.push({ imageUrl: image.imageUrl });
    });

    return {
      id: review!.id,
      memberId: review!.memberId,
      animationId: review!.animationId,
      createdAt: review!.createdAt,
      updatedAt: review!.updatedAt,
      imageUrls: urls,
      longReview: {
        title,
        content,
      },
    };
  }

  async softDeleteLongReview(id: number): Promise<number> {
    const review = await this.findLongReviewById(id);
    const deletedReview = await this.prisma.review.update({
      data: { deletedAt: new Date() },
      where: { id: review!.id },
    });

    await this.prisma.longReviewImage.deleteMany({
      where: { longReviewId: deletedReview.id },
    });

    return deletedReview.id;
  }

  private async findLongReviewById(id: number): Promise<Review | void> {
    return await this.prisma.review
      .findUniqueOrThrow({
        where: {
          id,
          deletedAt: null,
        },
      })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code == 'P2001') {
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
