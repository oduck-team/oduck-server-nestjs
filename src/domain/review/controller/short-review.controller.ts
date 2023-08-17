import { Controller } from '@nestjs/common';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { ShortReviewService } from '../service/short-review.service';
import {
  CreateShortReviewDto,
  MemberAnimationQueryDto,
  ReviewPageQueryDto,
} from '../dto/review-request.dto';
import { ShortReviewResponseDto } from '../dto/review-response.dto';

@Controller('/api/short-reviews')
export class ShortReviewController {
  constructor(private readonly shortReviewService: ShortReviewService) {}

  @TypedRoute.Get()
  async getShortReviews(
    @TypedQuery() query: ReviewPageQueryDto,
  ): Promise<ShortReviewResponseDto[]> {
    return await this.shortReviewService.findShortReviewPageByQuery(query);
  }

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

  @TypedRoute.Delete('/:id')
  async deleteShortReview(@TypedParam('id') id: number): Promise<string> {
    return await this.shortReviewService.deleteShortReview(id);
  }
}
