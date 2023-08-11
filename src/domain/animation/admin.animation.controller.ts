import { Controller } from '@nestjs/common';
import { AnimationService } from './animation.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Animation } from '@prisma/client';
import { AnimationCreateDto } from './model/animation.create.dto';

@Controller('animation')
// @Roles('admin') // TODO: define roleGuard
export class AdminAnimationController {
  constructor(private readonly service: AnimationService) {}

  @TypedRoute.Post('/')
  async store(@TypedBody() body: AnimationCreateDto): Promise<Animation> {
    return this.service.store(body);
  }

  @TypedRoute.Put('/:id')
  async update(
    @TypedParam('id') id: number,
    @TypedBody() body: AnimationCreateDto,
  ): Promise<Animation> {
    return this.service.updateById(id, body);
  }

  @TypedRoute.Delete('/:id')
  async destroy(@TypedParam('id') id: number): Promise<Animation> {
    return this.service.destroyById(id);
  }
}
