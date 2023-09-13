import { Controller } from '@nestjs/common';
import { GenreService } from './genre.service';

@Controller('studios')
export class GenreController {
  constructor(private readonly service: GenreService) {}
}
