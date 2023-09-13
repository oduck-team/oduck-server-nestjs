import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { GenreRepository } from './genre.repository';
import { AdminGenreController } from './admin.genre.controller';

@Module({
  controllers: [GenreController, AdminGenreController],
  providers: [GenreService, GenreRepository],
})
export class GenreModule {}
