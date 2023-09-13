import { Controller, UseGuards } from '@nestjs/common';
import { GenreService } from './genre.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { GenreCreateDto } from './dto/genre.create.dto';
import { Genre, Role } from '@prisma/client';
import { RolesGuard } from '../../global/auth/guard/roles.guard';
import { Roles } from '../../global/common/decoratror/roles.decorator';

@Controller('studio')
export class AdminGenreController {
  constructor(private readonly service: GenreService) {}

  /**
   * @tag admin/studio
   */
  @TypedRoute.Post('/')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async store(@TypedBody() body: GenreCreateDto): Promise<Genre> {
    return this.service.store(body);
  }
}
