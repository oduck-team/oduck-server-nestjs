import { BadRequestException, Injectable } from '@nestjs/common';
import { LongReviewRepository } from '../reviews.repository';
import {
  CreateLongReviewDto,
  ReviewPageQueryDto,
  UpdateLongReviewDto,
} from '../dto/review-request.dto';
import { ILongReview } from '../reviews.interface';

@Injectable()
export class LongReviewService {
  constructor(private readonly longReviewRepository: LongReviewRepository) {}

  async findLongReviewPageByQuery(
    query: ReviewPageQueryDto,
  ): Promise<ILongReview[]> {
    const { memberId, animationId, lastId, pageSize, sortCondition } = query;
    this.checkOnlyOneEnterOfTwoParams(memberId, animationId);
    return await this.longReviewRepository.selectLongReviewPage(
      memberId,
      animationId,
      lastId,
      pageSize,
      sortCondition,
    );
  }

  async findLongReviewDetail(id: number): Promise<ILongReview> {
    return await this.longReviewRepository.selectLongReviewById(id);
  }

  async createLongReview(
    memberId: number,
    animationId: number,
    dto: CreateLongReviewDto,
  ): Promise<ILongReview> {
    const { rating, title, content, imageUrls } = dto;
    return await this.longReviewRepository.insertLongReview(
      memberId,
      animationId,
      rating,
      title,
      content,
      imageUrls,
    );
  }

  // TODO: 장문 리뷰 수정 가능 항목 리스트?
  async updateLongReview(
    id: number,
    dto: UpdateLongReviewDto,
  ): Promise<ILongReview> {
    const { rating, title, content, imageUrls } = dto;
    return await this.longReviewRepository.updateLongReview(
      id,
      rating,
      title,
      content,
      imageUrls,
    );
  }

  async deleteLongReview(id: number): Promise<string> {
    const reviewId = await this.longReviewRepository.softDeleteLongReview(id);
    return `해당 장문 리뷰를 성공적으로 삭제하였습니다. id = ${reviewId}`;
  }

  private checkOnlyOneEnterOfTwoParams(
    memberId: number | undefined,
    animationId: number | undefined,
  ): void {
    if ((!memberId && !animationId) || !(memberId ?? animationId)) {
      throw new BadRequestException(
        `두 인자 중 하나만 입력 가능합니다. memberId: ${memberId}, animationId: ${animationId}`,
      );
    }
  }
}
