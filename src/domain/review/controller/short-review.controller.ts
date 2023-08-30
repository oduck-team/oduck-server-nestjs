import { Controller } from '@nestjs/common';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { ShortReviewService } from '../service/short-review.service';
import {
  CreateShortReviewDto,
  MemberAnimationQueryDto,
  ReviewPageQueryDto,
  UpdateShortReviewDto,
} from '../dto/review-request.dto';
import { ShortReviewResponseDto } from '../dto/review-response.dto';

@Controller('/short-reviews')
export class ShortReviewController {
  constructor(private readonly shortReviewService: ShortReviewService) {}

  /**
   * @tag short-reviews
   */
  @TypedRoute.Get()
  async getShortReviews(
    @TypedQuery() query: ReviewPageQueryDto,
  ): Promise<ShortReviewResponseDto[]> {
    return await this.shortReviewService.findShortReviewPageByQuery(query);
  }

  /**
   * @tag short-reviews
   */
  @TypedRoute.Post()
  async writeShortReview(
    @TypedQuery() query: MemberAnimationQueryDto,
    @TypedBody() dto: CreateShortReviewDto,
  ): Promise<number> {
    const { memberId, animationId } = query;
    return await this.shortReviewService.createShortReview(
      Number(memberId),
      Number(animationId),
      dto,
    );
  }

  /**
   * @tag short-reviews
   */
  @TypedRoute.Patch('/:id')
  async updateShortReview(
    @TypedParam('id') id: number,
    @TypedBody() dto: UpdateShortReviewDto,
  ): Promise<number> {
    return await this.shortReviewService.updateShortReview(id, dto);
  }

  /**
   * @tag short-reviews
   */
  @TypedRoute.Delete('/:id')
  async deleteShortReview(@TypedParam('id') id: number): Promise<string> {
    return await this.shortReviewService.deleteShortReview(id);
  }
}
