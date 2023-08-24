import { Controller } from '@nestjs/common';
import { AnimationService } from './animation.service';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { AnimationListDto } from './dto/animation.req.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AnimationItemResDto } from './dto/animation.res.dto';

@Controller('animation')
export class AnimationController {
  constructor(private readonly service: AnimationService) {}

  /**
   * @tag animation
   */
  @TypedRoute.Get('/')
  @ApiOperation({ summary: 'animation list' })
  async getList(
    @TypedQuery() query: AnimationListDto,
  ): Promise<AnimationItemResDto[]> {
    return this.service.getList(query);
  }

  /**
   * @tag animation
   */
  @TypedRoute.Get('/:id')
  async show(@TypedParam('id') id: number) {
    return this.service.getOneById(id);
  }
}
