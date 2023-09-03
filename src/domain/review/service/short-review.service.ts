import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateShortReviewDto,
  ReviewPageQueryDto,
  UpdateShortReviewDto,
} from '../dto/review-request.dto';
import { ShortReviewResponseDto } from '../dto/review-response.dto';
import { ShortReviewRepository } from '../repository/short-review.repository';

@Injectable()
export class ShortReviewService {
  constructor(private readonly shortReviewRepository: ShortReviewRepository) {}

  async findShortReviewPageByQuery(
    query: ReviewPageQueryDto,
  ): Promise<ShortReviewResponseDto[]> {
    const { memberId, animationId, lastId, pageSize, sortCondition } = query;
    this.checkOnlyOneEnterOfTwoParams(memberId, animationId);
    const shortReviews = await this.shortReviewRepository.selectShortReviewPage(
      memberId,
      animationId,
      lastId,
      pageSize,
      sortCondition,
    );

    let shortReviewDtoList: ShortReviewResponseDto[] = [];
    shortReviews.forEach((shortReview) => {
      const shortReviewResponseDto = new ShortReviewResponseDto(
        shortReview,
        shortReview.memberProfile,
      );
      shortReviewDtoList.push(shortReviewResponseDto);
    });

    return shortReviewDtoList;
  }

  async createShortReview(
    memberId: number,
    animationId: number,
    dto: CreateShortReviewDto,
  ): Promise<number> {
    const { rating, comment, hasSpoiler, attractionPoints } = dto;
    const exist = await this.shortReviewRepository.isShortReviewExist(
      memberId,
      animationId,
    );

    if (exist) {
      throw new BadRequestException(
        `해당 애니메이션에 이미 작성한 한줄 리뷰가 존재합니다.`,
      );
    }
    return await this.shortReviewRepository.insertShortReview(
      memberId,
      animationId,
      rating,
      comment,
      hasSpoiler,
      attractionPoints,
    );
  }

  async updateShortReview(
    id: number,
    dto: UpdateShortReviewDto,
  ): Promise<number> {
    const { rating, comment, hasSpoiler } = dto;
    return await this.shortReviewRepository.updateShortReview(
      id,
      rating,
      comment,
      hasSpoiler,
    );
  }

  async addLikesInReview(memberId: number, reviewId: number): Promise<boolean> {
    return await this.shortReviewRepository.createShortReviewLikes(
      memberId,
      reviewId,
    );
  }

  async subjectLikesInReview(
    memberId: number,
    reviewId: number,
  ): Promise<boolean> {
    return await this.shortReviewRepository.deleteShortReviewLikes(
      memberId,
      reviewId,
    );
  }

  // TODO: soft delete 할 때, AttractionPoint 를 삭제하지 않는지??
  async deleteShortReview(id: number): Promise<string> {
    const reviewId = await this.shortReviewRepository.softDeleteShortReview(id);
    return `해당 한줄 리뷰를 성공적으로 삭제하였습니다. id = ${reviewId}`;
  }

  private checkOnlyOneEnterOfTwoParams(
    memberId: number | undefined,
    animationId: number | undefined,
  ): void {
    if ((!memberId && !animationId) || (memberId && animationId)) {
      throw new BadRequestException(
        `두 인자 중 하나만 입력 가능합니다. memberId: ${memberId}, animationId: ${animationId}`,
      );
    }
  }
}
