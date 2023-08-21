import { Controller } from '@nestjs/common';
import { AnimationService } from './animation.service';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Animation } from '@prisma/client';
import { AnimationListDto } from './dto/animation.req.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnimationItemResDto } from './dto/animation.res.dto';

@Controller('animation')
@ApiTags('Animation')
export class AnimationController {
  constructor(private readonly service: AnimationService) {}

  @TypedRoute.Get('/')
  @ApiOperation({ summary: 'animation list' })
  async getList(
    @TypedQuery() query: AnimationListDto,
  ): Promise<AnimationItemResDto[]> {
    return this.service.getList(query);
  }

  @TypedRoute.Get('/:id')
  async show(@TypedParam('id') id: number) {
    return this.service.getOneById(id);
  }
}
