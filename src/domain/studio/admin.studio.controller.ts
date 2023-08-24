import { Controller } from '@nestjs/common';
import { StudioService } from './studio.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { StudioCreateDto } from './dto/studio.create.dto';
import { Studio } from '@prisma/client';

@Controller('studio')
export class AdminStudioController {
  constructor(private readonly service: StudioService) {}

  /**
   * @tag admin/studio
   */
  @TypedRoute.Post('/')
  async store(@TypedBody() body: StudioCreateDto): Promise<Studio> {
    return this.service.store(body);
  }
}
