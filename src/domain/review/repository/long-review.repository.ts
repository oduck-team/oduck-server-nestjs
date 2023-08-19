import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../global/config/prisma/prisma.service';
import { ILongReview, IReviewQuery, SortCondition } from '../reviews.interface';
import { LongReviewImage, Prisma, Review, ReviewType } from '@prisma/client';

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
    return await this.prisma.$transaction(async (prisma) => {
      const longReview = await prisma.review
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
            type: ReviewType.LONG,
            deletedAt: null,
          },
        })
        .catch((e) => {
          console.log(e);
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

      const imageUrls = await prisma.longReviewImage.findMany({
        select: { imageUrl: true },
        where: { longReviewId: longReview!.id },
      });

      return { ...longReview!, imageUrls };
    });
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

    const review = await this.prisma.$transaction(async (prisma) => {
      const longReview = await prisma.review.update({
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

      await Promise.all(
        imageUrls.map(async (imageUrl) => {
          await prisma.longReviewImage.deleteMany({
            where: { longReviewId: longReview.id },
          });

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

  async softDeleteLongReview(id: number): Promise<number> {
    const longReview = await this.findLongReviewById(id);
    const longReviewId = await this.prisma.review
      .update({
        where: { id: longReview!.id },
        data: { deletedAt: new Date() },
      })
      .then((review) => review.id);

    await this.prisma.longReviewImage.deleteMany({
      where: { longReviewId },
    });

    return longReviewId;
  }

  private async findLongReviewById(id: number): Promise<Review | void> {
    return await this.prisma.review
      .findUniqueOrThrow({
        where: {
          id,
          type: ReviewType.LONG,
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
