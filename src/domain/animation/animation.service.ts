import { Injectable } from '@nestjs/common';
import { AnimationRepository } from './animation.repository';
import {
  Animation,
  Genre,
  MemberProfile,
  OriginalWorker,
  Studio,
  VoiceActor,
} from '@prisma/client';
import { AnimationListDto } from './dto/animation.req.dto';
import { AnimationReqDto } from './dto/animation.req.dto';
import { AnimationItemResDto } from './dto/animation.res.dto';

@Injectable()
export class AnimationService {
  constructor(private repository: AnimationRepository) {}

  async getList(
    user: MemberProfile,
    query: AnimationListDto,
  ): Promise<AnimationItemResDto[]> {
    const items = await this.repository.getAnimations(user.role, query);
    return this.flattenRelations(items);
  }

  async getOneById(user: MemberProfile, id: number) {
    const item = await this.repository.getAnimationById(user.role, id);

    return this.flattenRelations([item])[0];
  }

  async store(body: AnimationReqDto) {
    const item = await this.repository.storeAnimation(body);
    return this.flattenRelations([item])[0];
  }

  async updateById(
    id: number,
    body: AnimationReqDto,
  ): Promise<AnimationItemResDto> {
    const item = await this.repository.updateAnimation(id, body);
    return this.flattenRelations([item])[0];
  }

  async destroyById(id: number): Promise<void> {
    return await this.repository.destroyById(Number(id));
  }

  private flattenRelations(
    items: (Animation & {
      studios: { studio: Studio }[];
      genres: { genre: Genre }[];
      voiceActors: { voiceActor: VoiceActor }[];
      originalWorkers: { originalWorker: OriginalWorker }[];
      //TODO: keyword
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

      // TODO: keyword

      return {
        ...animation,
        studios,
        genres,
        voiceActors,
        originalWorkers,
        // TODO: keyword
      };
    });
  }
}
