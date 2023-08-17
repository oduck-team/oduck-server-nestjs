import { Injectable } from '@nestjs/common';
import { StudioCreateDto } from './model/studio.create.dto';
import { StudioRepository } from './studio.repository';

@Injectable()
export class StudioService {
  constructor(private readonly repository: StudioRepository) {}
  async store(body: StudioCreateDto) {
    return this.repository.store(body);
  }
}
