import { Controller, UseGuards } from '@nestjs/common';
import { AnimationService } from './animation.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Animation, Role } from '@prisma/client';
import { AnimationReqDto, AnimationUpdateDto } from './dto/animation.req.dto';
import { AnimationItemResDto } from './dto/animation.res.dto';
import { Roles } from '../../global/common/decoratror/roles.decorator';
import { RolesGuard } from '../../global/auth/guard/roles.guard';

@Controller('/animation')
export class AdminAnimationController {
  constructor(private readonly service: AnimationService) {}

  /**
   * @tag admin/animation
   * @enum season.quarter: [1, 2, 3, 4]
   */
  @TypedRoute.Post('/')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  async store(
    @TypedBody() body: AnimationReqDto,
  ): Promise<AnimationItemResDto> {
    return this.service.store(body);
  }

  /**
   * @tag admin/animation
   */
  @TypedRoute.Put('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @TypedParam('id') id: number,
    @TypedBody() body: AnimationUpdateDto,
  ): Promise<Animation> {
    return this.service.updateById(id, body);
  }

  /**
   * @tag admin/animation
   */
  @TypedRoute.Delete('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async destroy(@TypedParam('id') id: number): Promise<Animation> {
    return this.service.destroyById(id);
  }
}
