import { Controller, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { ShortReviewService } from '../service/short-review.service';
import {
  CreateShortReviewDto,
  ReviewPageQueryDto,
} from '../dto/review-request.dto';
import { ShortReviewResponseDto } from '../dto/review-response.dto';

@Controller('/api/short-reviews')
export class ShortReviewController {
  constructor(private readonly shortReviewService: ShortReviewService) {}

  @TypedRoute.Get()
  async getShortReviewsByAnimation(
    @Query('animationId', ParseIntPipe) animationId: number,
    @TypedQuery() query: ReviewPageQueryDto,
  ): Promise<ShortReviewResponseDto[]> {
    return await this.shortReviewService.findShortReviewPage(
      animationId,
      query,
    );
  }

  @TypedRoute.Post()
  async writeShortReview(
    @Query('memberId', ParseIntPipe) memberId: number,
    @Query('animationId', ParseIntPipe) animationId: number,
    @TypedBody() dto: CreateShortReviewDto,
  ): Promise<number> {
    return await this.shortReviewService.createShortReview(
      memberId,
      animationId,
      dto,
    );
  }

  @TypedRoute.Patch('/:id/delete')
  async deleteShortReview(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.shortReviewService.deleteShortReview(id);
  }
}
