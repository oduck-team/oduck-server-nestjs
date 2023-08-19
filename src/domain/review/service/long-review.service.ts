import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateLongReviewDto,
  ReviewPageQueryDto,
  UpdateLongReviewDto,
} from '../dto/review-request.dto';
import { LongReviewResponseDto } from '../dto/review-response.dto';
import { LongReviewRepository } from '../repository/long-review.repository';

@Injectable()
export class LongReviewService {
  constructor(private readonly longReviewRepository: LongReviewRepository) {}

  // TODO: 장문 리뷰 리스트 조회 시 content 길이 제한?
  async findLongReviewPageByQuery(
    query: ReviewPageQueryDto,
  ): Promise<LongReviewResponseDto[]> {
    const { memberId, animationId, lastId, pageSize, sortCondition } = query;
    this.checkOnlyOneEnterOfTwoParams(memberId, animationId);
    const longReviews = await this.longReviewRepository.selectLongReviewPage(
      memberId,
      animationId,
      lastId,
      pageSize,
      sortCondition,
    );

    const longReviewDtoList: LongReviewResponseDto[] = [];
    longReviews.forEach((longReview) => {
      const longReviewResponseDto = new LongReviewResponseDto(longReview);
      longReviewDtoList.push(longReviewResponseDto);
    });

    return longReviewDtoList;
  }

  async findLongReviewDetail(id: number): Promise<LongReviewResponseDto> {
    const longReview = await this.longReviewRepository.selectLongReviewById(id);
    return new LongReviewResponseDto(longReview);
  }

  async createLongReview(
    memberId: number,
    animationId: number,
    dto: CreateLongReviewDto,
  ): Promise<LongReviewResponseDto> {
    const { rating, title, content, imageUrls } = dto;
    const longReview = await this.longReviewRepository.insertLongReview(
      memberId,
      animationId,
      rating,
      title,
      content,
      imageUrls,
    );

    return new LongReviewResponseDto(longReview);
  }

  // TODO: 장문 리뷰 수정 가능 항목 리스트?
  async updateLongReview(
    id: number,
    dto: UpdateLongReviewDto,
  ): Promise<LongReviewResponseDto> {
    const { rating, title, content, imageUrls } = dto;
    const longReview = await this.longReviewRepository.updateLongReview(
      id,
      rating,
      title,
      content,
      imageUrls,
    );

    return new LongReviewResponseDto(longReview);
  }

  async deleteLongReview(id: number): Promise<string> {
    const reviewId = await this.longReviewRepository.softDeleteLongReview(id);
    return `해당 장문 리뷰를 성공적으로 삭제하였습니다. id = ${reviewId}`;
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
