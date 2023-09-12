import { Controller, UseGuards } from '@nestjs/common';
import { LongReviewService } from '../service/long-review.service';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  AnimationIdQueryDto,
  CreateLongReviewDto,
  ReviewPageQueryDto,
  UpdateLongReviewDto,
} from '../dto/review-request.dto';
import { LongReviewResponseDto } from '../dto/review-response.dto';
import { Roles } from '../../../global/common/decoratror/roles.decorator';
import { MemberProfile, Role } from '@prisma/client';
import { RolesGuard } from '../../../global/auth/guard/roles.guard';
import { User } from '../../../global/common/decoratror/user.decorator';

@Controller('/long-reviews')
export class LongReviewController {
  constructor(private readonly longReviewService: LongReviewService) {}

  /**
   * @tag Long Review
   */
  @TypedRoute.Get()
  async getLongReviewPageByAnimation(
    @TypedQuery() query: ReviewPageQueryDto,
  ): Promise<LongReviewResponseDto[]> {
    return await this.longReviewService.findLongReviewPageByQuery(query);
  }

  /**
   * @tag Long Review
   */
  @TypedRoute.Get('/:id')
  async getLongReviewDetail(
    @TypedParam('id') id: number,
  ): Promise<LongReviewResponseDto> {
    return await this.longReviewService.findLongReviewDetail(id);
  }

  /**
   * @tag Long Review
   */
  @TypedRoute.Post()
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async writeLongReview(
    @User() user: MemberProfile,
    @TypedQuery() query: AnimationIdQueryDto,
    @TypedBody() dto: CreateLongReviewDto,
  ): Promise<LongReviewResponseDto> {
    const { animationId } = query;
    return await this.longReviewService.createLongReview(
      Number(user.id),
      Number(animationId),
      dto,
    );
  }

  /**
   * @tag Long Review
   */
  @TypedRoute.Put('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async updateLongReview(
    @TypedParam('id') id: number,
    @TypedBody() dto: UpdateLongReviewDto,
  ): Promise<LongReviewResponseDto> {
    return await this.longReviewService.updateLongReview(id, dto);
  }

  /**
   * @tag Long Review
   */
  @TypedRoute.Delete('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async deleteLongReview(@TypedParam('id') id: number): Promise<string> {
    return await this.longReviewService.deleteLongReview(id);
  }
}
