import { Injectable, NotFoundException } from '@nestjs/common';
import { AnimationRepository } from './animation.repository';
import {
  Animation,
  Genre,
  OriginalWorker,
  Season,
  Studio,
  VoiceActor,
} from '@prisma/client';
import { AnimationListDto } from './dto/animation.req.dto';
import { AnimationReqDto, AnimationUpdateDto } from './dto/animation.req.dto';
import { AnimationItemResDto } from './dto/animation.res.dto';

@Injectable()
export class AnimationService {
  constructor(private repository: AnimationRepository) {}

  async getList(query: AnimationListDto): Promise<AnimationItemResDto[]> {
    const items = await this.repository.getAnimations(query);
    return this.flattenStudios(items);
  }

  async getOneById(id: number) {
    const item = await this.repository.getAnimationById(id);

    if (!item) throw new NotFoundException();

    return this.flattenStudios([item])[0];
  }

  async store(body: AnimationReqDto) {
    const item = await this.repository.storeAnimation(body);
    return this.flattenStudios([item])[0];
  }

  async updateById(id: number, body: AnimationUpdateDto): Promise<Animation> {
    return await this.repository.updateAnimation(id, body);
  }

  async destroyById(id: number): Promise<Animation> {
    return await this.repository.destroyById(Number(id));
  }

  private flattenStudios(
    items: (Animation & {
      studios: { studio: Studio }[];
      seasons: Season[];
      genres: { genre: Genre }[];
      voiceActors: { voiceActor: VoiceActor }[];
      originalWorkers: { originalWorker: OriginalWorker }[];
    })[],
  ) {
    return items.map((animation) => {
      const studios = animation.studios.map((studio) => {
        return studio.studio;
      });

      const genres = animation.genres.map((genre) => {
        return genre.genre;
      });

      const voiceActors = animation.voiceActors.map((vActor) => {
        return vActor.voiceActor;
      });

      const originalWorkers = animation.originalWorkers.map((oWorker) => {
        return oWorker.originalWorker;
      });

      return {
        ...animation,
        studios,
        genres,
        voiceActors,
        originalWorkers,
      };
    });
  }
}
