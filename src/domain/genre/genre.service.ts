import { Injectable } from '@nestjs/common';
import { GenreCreateDto } from './dto/genre.create.dto';
import { GenreRepository } from './genre.repository';

@Injectable()
export class GenreService {
  constructor(private readonly repository: GenreRepository) {}
  async store(body: GenreCreateDto) {
    return this.repository.store(body);
  }
}
