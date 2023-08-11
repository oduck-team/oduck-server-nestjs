import { Controller } from '@nestjs/common';
import { AnimationService } from './animation.service';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Animation } from '@prisma/client';
import { IList } from './model/animation.list.dto';

@Controller('animation')
export class AnimationController {
  constructor(private readonly service: AnimationService) {}

  @TypedRoute.Get('/')
  async getList(@TypedQuery() query: IList): Promise<Animation[]> {
    return this.service.getList(query);
  }

  @TypedRoute.Get('/:id')
  async show(@TypedParam('id') id: number): Promise<Animation> {
    return this.service.getOneById(id);
  }
}
