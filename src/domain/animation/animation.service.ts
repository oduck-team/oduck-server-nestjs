import { Injectable } from '@nestjs/common';
import { AnimationRepository } from './animation.repository';
import { Animation } from '@prisma/client';
import { IList } from './model/animation.list.dto';
import { AnimationCreateDto } from './model/animation.create.dto';

@Injectable()
export class AnimationService {
  constructor(private repository: AnimationRepository) {}

  async getList(query: IList): Promise<Animation[]> {
    return this.repository.getAnimations(query);
  }

  async getOneById(id: number): Promise<Animation> {
    return this.repository.getAnimationById(id);
  }

  async store(body: AnimationCreateDto): Promise<Animation> {
    return this.repository.storeAnimation(body);
  }

  async updateById(id: number, body: AnimationCreateDto): Promise<Animation> {
    return await this.repository.updateAnimation(id, body);
  }

  async destroyById(id: number): Promise<Animation> {
    return await this.repository.destroyById(id);
  }
}
