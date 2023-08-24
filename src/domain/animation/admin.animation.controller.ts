import { Controller } from '@nestjs/common';
import { AnimationService } from './animation.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Animation } from '@prisma/client';
import { AnimationReqDto, AnimationUpdateDto } from './dto/animation.req.dto';
import { AnimationItemResDto } from './dto/animation.res.dto';

@Controller('animation')
// @Roles('admin') // TODO: define roleGuard
export class AdminAnimationController {
  constructor(private readonly service: AnimationService) {}

  /**
   * @tag admin/animation
   */
  @TypedRoute.Post('/')
  async store(
    @TypedBody() body: AnimationReqDto,
  ): Promise<AnimationItemResDto> {
    return this.service.store(body);
  }

  /**
   * @tag admin/animation
   */
  @TypedRoute.Put('/:id')
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
  async destroy(@TypedParam('id') id: number): Promise<Animation> {
    return this.service.destroyById(id);
  }
}
