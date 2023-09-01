import { Controller, UseGuards } from '@nestjs/common';
import { AnimationService } from './animation.service';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { AnimationListDto } from './dto/animation.req.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AnimationItemResDto } from './dto/animation.res.dto';
import { RolesGuard } from '../../global/auth/guard/roles.guard';
import { Roles } from '../../global/common/decoratror/roles.decorator';
import { Role } from '@prisma/client';

@Controller('animation')
export class AnimationController {
  constructor(private readonly service: AnimationService) {}

  /**
   * @tag animation
   */
  @TypedRoute.Get('/')
  @ApiOperation({ summary: 'animation list' })
  // @UseGuards(RolesGuard)
  // @Roles(Role.MEMBER, Role.ADMIN)
  async getList(
    @TypedQuery() query: AnimationListDto,
  ): Promise<AnimationItemResDto[]> {
    return this.service.getList(query);
  }

  /**
   * @tag animation
   */
  @TypedRoute.Get('/:id')
  // @UseGuards(RolesGuard)
  // @Roles(Role.MEMBER, Role.ADMIN)
  async show(@TypedParam('id') id: number): Promise<AnimationItemResDto> {
    return this.service.getOneById(id);
  }
}
