import { Injectable } from '@nestjs/common';
import { AnimationRepository } from './animation.repository';
import { Animation } from '@prisma/client';
import { IList } from './model/animation.list.dto';
import { AnimationCreateDto } from './model/animation.create.dto';
import { StudioRepository } from '../studio/studio.repository';
import { PrismaService } from '../../global/database/prisma/prisma.service';

@Injectable()
export class AnimationService {
  constructor(
    private prismaService: PrismaService,
    private repository: AnimationRepository,
    private studioRepository: StudioRepository,
  ) {}

  async getList(query: IList): Promise<Animation[]> {
    return this.repository.getAnimations(query);
  }

  async getOneById(id: number): Promise<Animation> {
    return this.repository.getAnimationById(id);
  }

  async store(body: AnimationCreateDto): Promise<Animation> {
    const { studioName, ...animationBody } = body;

    return this.prismaService.$transaction(async (tx) => {
      const studio = await this.studioRepository.firstOrCreate(
        studioName,
        tx as PrismaService,
      );

      const animation = await this.repository.storeAnimation(
        animationBody as AnimationCreateDto,
        tx as PrismaService,
      );

      await tx.animationStudio.create({
        data: { animationId: animation.id, studioId: studio.id },
      });

      return animation;
    });
  }

  async updateById(id: number, body: AnimationCreateDto): Promise<Animation> {
    return await this.repository.updateAnimation(id, body);
  }

  async destroyById(id: number): Promise<Animation> {
    return await this.repository.destroyById(id);
  }
}
