import { Controller, UseGuards } from '@nestjs/common';
import { StudioService } from './studio.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { StudioCreateDto } from './dto/studio.create.dto';
import { Role, Studio } from '@prisma/client';
import { RolesGuard } from '../../global/auth/guard/roles.guard';
import { Roles } from '../../global/common/decoratror/roles.decorator';

@Controller('studio')
export class AdminStudioController {
  constructor(private readonly service: StudioService) {}

  /**
   * @tag admin/studio
   */
  @TypedRoute.Post('/')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async store(@TypedBody() body: StudioCreateDto): Promise<Studio> {
    return this.service.store(body);
  }
}
