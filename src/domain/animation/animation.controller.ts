import { Controller, UseGuards } from '@nestjs/common';
import { AnimationService } from './animation.service';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { AnimationListDto } from './dto/animation.req.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AnimationItemResDto } from './dto/animation.res.dto';
import { RolesGuard } from '../../global/auth/guard/roles.guard';
import { Roles } from '../../global/common/decoratror/roles.decorator';
import { MemberProfile, Role } from '@prisma/client';
import { User } from '../../global/common/decoratror/user.decorator';

@Controller('animation')
export class AnimationController {
  constructor(private readonly service: AnimationService) {}

  /**
   * @tag animation
   * @enum status: ['FINISHED', 'ONGOING', 'UPCOMING', 'UNKNOWN']
   */
  @TypedRoute.Get('/')
  @ApiOperation({ summary: 'animation list' })
  async getList(
    @User() user: MemberProfile,
    @TypedQuery() query: AnimationListDto,
  ): Promise<AnimationItemResDto[]> {
    return this.service.getList(user, query);
  }

  /**
   * @tag animation
   */
  @TypedRoute.Get('/:id')
  async show(
    @User() user: MemberProfile,
    @TypedParam('id') id: number,
  ): Promise<AnimationItemResDto> {
    return this.service.getOneById(user, id);
  }
}
