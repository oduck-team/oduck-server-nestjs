import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Review } from '@prisma/client';
import {
  CreateShortReviewDto,
  ReviewPageQueryDto,
} from '../dto/review-request.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ShortReviewResponseDto } from '../dto/review-response.dto';
import { ShortReviewRepository } from '../repo/short-review.repository';

@Injectable()
export class ShortReviewService {
  constructor(private readonly shortReviewRepository: ShortReviewRepository) {}

  async findShortReviewPage(
    animationId: number,
    query: ReviewPageQueryDto,
  ): Promise<ShortReviewResponseDto[]> {
    const { lastId, pageSize, sortKey, sortDir } = query;
    return await this.shortReviewRepository.selectShortReviewPage(
      animationId,
      lastId,
      pageSize,
      sortKey,
      sortDir,
    );
  }

  async createShortReview(
    memberId: number,
    animationId: number,
    dto: CreateShortReviewDto,
  ): Promise<number> {
    const review = await this.shortReviewRepository.review.create({
      data: {
        memberId,
        animationId,
        type: 'SHORT',
        rating: dto.rating,
        shortReview: {
          create: {
            comment: dto.comment,
            hasSpoiler: dto.hasSpoiler,
          },
        },
      },
    });

    const promises = dto.attractionPoints.map(async (attractionElement) => {
      await this.shortReviewRepository.attractionPoint.create({
        data: {
          reviewId: review.id,
          attractionElement,
        },
      });
    });

    await Promise.all(promises);
    return review.id;
  }

  // TODO: 한줄 리뷰 수정 가능한지?
  async updateShortReview(): Promise<any> {}

  async deleteShortReview(id: number): Promise<string> {
    const review = await this.findShortReviewById(id);
    await this.shortReviewRepository.review.update({
      where: { id: review.id },
      data: { deletedAt: new Date() },
    });

    return `해당 리뷰를 성공적으로 삭제하였습니다. id = ${id}`;
  }

  private async findShortReviewById(id: number): Promise<Review> {
    return await this.shortReviewRepository.review
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
