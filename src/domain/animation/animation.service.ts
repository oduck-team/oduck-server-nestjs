import { Injectable } from '@nestjs/common';
import { AnimationRepository } from './animation.repository';
import { Animation } from '@prisma/client';
import { IList } from './model/animation.list.dto';

@Injectable()
export class AnimationService {
  constructor(private repository: AnimationRepository) {}

  async getAnimations(query: IList): Promise<Animation[]> {
    return this.repository.getAnimations(query);
  }

  async getAnimationById(id: number): Promise<Animation> {
    return this.repository.getAnimationById(id);
  }
}
