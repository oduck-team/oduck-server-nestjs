import { Controller } from '@nestjs/common';
import { LongReviewService } from '../service/long-review.service';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  CreateLongReviewDto,
  MemberAnimationQueryDto,
  ReviewPageQueryDto,
  UpdateLongReviewDto,
} from '../dto/review-request.dto';
import { LongReviewResponseDto } from '../dto/review-response.dto';

@Controller('/long-reviews')
export class LongReviewController {
  constructor(private readonly longReviewService: LongReviewService) {}

  /**
   * @tag long-reviews
   */
  @TypedRoute.Get()
  async getLongReviewPageByAnimation(
    @TypedQuery() query: ReviewPageQueryDto,
  ): Promise<LongReviewResponseDto[]> {
    return await this.longReviewService.findLongReviewPageByQuery(query);
  }

  /**
   * @tag long-reviews
   */
  @TypedRoute.Get('/:id')
  async getLongReviewDetail(
    @TypedParam('id') id: number,
  ): Promise<LongReviewResponseDto> {
    return await this.longReviewService.findLongReviewDetail(id);
  }

  /**
   * @tag long-reviews
   */
  @TypedRoute.Post()
  async writeLongReview(
    @TypedQuery() query: MemberAnimationQueryDto,
    @TypedBody() dto: CreateLongReviewDto,
  ): Promise<LongReviewResponseDto> {
    const { memberId, animationId } = query;
    return await this.longReviewService.createLongReview(
      Number(memberId),
      Number(animationId),
      dto,
    );
  }

  /**
   * @tag long-reviews
   */
  @TypedRoute.Put('/:id')
  async updateLongReview(
    @TypedParam('id') id: number,
    @TypedBody() dto: UpdateLongReviewDto,
  ): Promise<LongReviewResponseDto> {
    return await this.longReviewService.updateLongReview(id, dto);
  }

  /**
   * @tag long-reviews
   */
  @TypedRoute.Delete('/:id')
  async deleteLongReview(@TypedParam('id') id: number): Promise<string> {
    return await this.longReviewService.deleteLongReview(id);
  }
}
