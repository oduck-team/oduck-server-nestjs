import { Controller, HttpCode, UseGuards } from '@nestjs/common';
import { AnimationService } from './animation.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Animation, Role } from '@prisma/client';
import { AnimationReqDto, AnimationUpdateDto } from './dto/animation.req.dto';
import { AnimationItemResDto } from './dto/animation.res.dto';
import { Roles } from '../../global/common/decoratror/roles.decorator';
import { RolesGuard } from '../../global/auth/guard/roles.guard';
import { ApiNoContentResponse } from '@nestjs/swagger';

@Controller('/animation')
export class AdminAnimationController {
  constructor(private readonly service: AnimationService) {}

  /**
   * @tag admin/animation
   * @enum seasonQuarter: [1, 2, 3, 4]
   * @seriesGroup 시리즈인 경우 대표적인 이름. ex) [에반게리온 서, 파, Q] -> 에반게리온
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
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  async update(
    @TypedParam('id') id: number,
    @TypedBody() body: AnimationReqDto,
  ): Promise<AnimationItemResDto> {
    return this.service.updateById(id, body);
  }

  /**
   * @tag admin/animation
   */
  @TypedRoute.Delete('/:id')
  @HttpCode(204)
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN)
  async destroy(@TypedParam('id') id: number): Promise<void> {
    return this.service.destroyById(id);
  }
}
