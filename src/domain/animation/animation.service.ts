import { Injectable } from '@nestjs/common';
import { AnimationRepository } from './animation.repository';
import { Animation } from '@prisma/client';
import { AnimationListDto } from './dto/animation.req.dto';
import { AnimationReqDto, AnimationUpdateDto } from './dto/animation.req.dto';
import { AnimationItemResDto } from './dto/animation.res.dto';

@Injectable()
export class AnimationService {
  constructor(private repository: AnimationRepository) {}

  async getList(query: AnimationListDto): Promise<AnimationItemResDto[]> {
    return this.repository.getAnimations(query);
  }

  async getOneById(id: number) {
    return this.repository.getAnimationById(id);
  }

  async store(body: AnimationReqDto) {
    return this.repository.storeAnimation(body);
  }

  async updateById(id: number, body: AnimationUpdateDto): Promise<Animation> {
    return await this.repository.updateAnimation(id, body);
  }

  async destroyById(id: number): Promise<Animation> {
    return await this.repository.destroyById(Number(id));
  }
}
