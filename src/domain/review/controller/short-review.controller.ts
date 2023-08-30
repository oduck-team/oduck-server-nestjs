import { Controller, UseGuards } from '@nestjs/common';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { ShortReviewService } from '../service/short-review.service';
import {
  AnimationIdQueryDto,
  CreateShortReviewDto,
  ReviewPageQueryDto,
  UpdateShortReviewDto,
} from '../dto/review-request.dto';
import { ShortReviewResponseDto } from '../dto/review-response.dto';
import { RolesGuard } from '../../../global/auth/guard/roles.guard';
import { Roles } from '../../../global/common/decoratror/roles.decorator';
import { MemberProfile, Role } from '@prisma/client';
import { User } from '../../../global/common/decoratror/user.decorator';

@Controller('/short-reviews')
export class ShortReviewController {
  constructor(private readonly shortReviewService: ShortReviewService) {}

  /**
   * @tag Short Review
   */
  @TypedRoute.Get()
  async getShortReviews(
    @TypedQuery() query: ReviewPageQueryDto,
  ): Promise<ShortReviewResponseDto[]> {
    return await this.shortReviewService.findShortReviewPageByQuery(query);
  }

  /**
   * @tag Short Review
   */
  @TypedRoute.Post()
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async writeShortReview(
    @User() user: MemberProfile,
    @TypedQuery() query: AnimationIdQueryDto,
    @TypedBody() dto: CreateShortReviewDto,
  ): Promise<number> {
    const { animationId } = query;
    return await this.shortReviewService.createShortReview(
      Number(user.id),
      Number(animationId),
      dto,
    );
  }

  /**
   * @tag Short Review
   */
  @TypedRoute.Patch('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async updateShortReview(
    @TypedParam('id') id: number,
    @TypedBody() dto: UpdateShortReviewDto,
  ): Promise<number> {
    return await this.shortReviewService.updateShortReview(id, dto);
  }

  /**
   * @tag Short Review
   */
  @TypedRoute.Patch('/:id/like')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async likesOnShortReview(
    @User() user: MemberProfile,
    @TypedParam('id') reviewId: number,
  ): Promise<boolean> {
    return await this.shortReviewService.addLikesInReview(user.id, reviewId);
  }

  /**
   * @tag Short Review
   */
  @TypedRoute.Patch('/:id/unlike')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async unlikesOnShortReview(
    @User() user: MemberProfile,
    @TypedParam('id') reviewId: number,
  ): Promise<boolean> {
    return await this.shortReviewService.subjectLikesInReview(
      user.id,
      reviewId,
    );
  }

  /**
   * @tag Short Review
   */
  @TypedRoute.Delete('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async deleteShortReview(@TypedParam('id') id: number): Promise<string> {
    return await this.shortReviewService.deleteShortReview(id);
  }
}
