import { Controller } from '@nestjs/common';
import { LongReviewService } from '../service/long-review.service';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  CreateLongReviewDto,
  MemberAnimationQueryDto,
  ReviewPageQueryDto,
  UpdateLongReviewDto,
} from '../dto/review-request.dto';
import { ILongReview } from '../reviews.interface';

@Controller('/api/long-reviews')
export class LongReviewController {
  constructor(private readonly longReviewService: LongReviewService) {}

  @TypedRoute.Get()
  async getLongReviewPageByAnimation(
    @TypedQuery() query: ReviewPageQueryDto,
  ): Promise<ILongReview[]> {
    return await this.longReviewService.findLongReviewPageByQuery(query);
  }

  @TypedRoute.Get('/:id')
  async getLongReviewDetail(
    @TypedParam('id') id: number,
  ): Promise<ILongReview> {
    return await this.longReviewService.findLongReviewDetail(id);
  }

  @TypedRoute.Post()
  async writeLongReview(
    @TypedQuery() query: MemberAnimationQueryDto,
    @TypedBody() dto: CreateLongReviewDto,
  ): Promise<ILongReview> {
    const { memberId, animationId } = query;
    return await this.longReviewService.createLongReview(
      Number(memberId),
      Number(animationId),
      dto,
    );
  }

  @TypedRoute.Put('/:id')
  async updateLongReview(
    @TypedParam('id') id: number,
    @TypedBody() dto: UpdateLongReviewDto,
  ): Promise<ILongReview> {
    return await this.longReviewService.updateLongReview(id, dto);
  }

  @TypedRoute.Patch('/:id')
  async deleteLongReview(@TypedParam('id') id: number): Promise<string> {
    return await this.longReviewService.deleteLongReview(id);
  }
}
