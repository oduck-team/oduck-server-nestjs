import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/database/prisma/prisma.service';
import { AnimationListDto } from './dto/animation.req.dto';
import { AnimationReqDto, AnimationUpdateDto } from './dto/animation.req.dto';
import { Sort } from '../../global/common/types/sort';

@Injectable()
export class AnimationRepository {
  constructor(private prisma: PrismaService) {}

  private makeCommonIncludeQuery() {
    return {
      studios: {
        select: {
          studio: true,
        },
      },
      genres: {
        select: {
          genre: true,
        },
      },
      voiceActors: {
        select: {
          voiceActor: true,
        },
      },
      originalWorkers: {
        select: {
          originalWorker: true,
        },
      },
      seasons: true,
    };
  }

  async getAnimations(params: AnimationListDto) {
    const search = {
      OR: [
        { name: { contains: params.search ?? '' } },
        { plot: { contains: params.search ?? '' } },
        { primaryKeyword: { contains: params.search ?? '' } },
      ],
      status: params.status ?? {},
    };

    return this.prisma.animation.findMany({
      skip: params.lastId ? 1 : 0,
      take: params.pageSize ?? 20,
      orderBy: {
        [params.sortBy ?? 'createdAt']: params.sortOrder ?? Sort.DESC,
      },
      where: search,
      include: this.makeCommonIncludeQuery(),
    });
  }

  async getAnimationById(id: number) {
    return this.prisma.animation.findFirst({
      where: { id },
      include: this.makeCommonIncludeQuery(),
    });
  }

  async storeAnimation(body: AnimationReqDto) {
    // TODO: modify to keywords.... transaction
    const {
      studioNames,
      genres,
      voiceActors,
      originalWorkers,
      seasons,
      ...animationBody
    } = body;

    return this.prisma.animation.create({
      data: {
        ...animationBody,
        studios: {
          create: studioNames.map((s) => ({
            studio: {
              connectOrCreate: {
                where: { name: s },
                create: { name: s },
              },
            },
          })),
        },
        genres: {
          create: genres.map((g) => ({
            genre: {
              connectOrCreate: {
                where: { type: g },
                create: { type: g },
              },
            },
          })),
        },
        voiceActors: {
          create: voiceActors.map((v) => ({
            voiceActor: {
              connectOrCreate: {
                where: { name: v },
                create: { name: v },
              },
            },
          })),
        },
        originalWorkers: {
          create: originalWorkers.map((o) => ({
            originalWorker: {
              connectOrCreate: {
                where: { name: o },
                create: { name: o },
              },
            },
          })),
        },
        seasons: {
          create: seasons.map((s) => ({
            year: s.year,
            quarter: s.quarter,
          })),
        },
        // TODO: other relations
        // TODO: other relations
        // TODO: other relations
      },
      include: this.makeCommonIncludeQuery(),
    });
  }

  async updateAnimation(id: number, body: AnimationUpdateDto) {
    return this.prisma.animation.update({
      where: { id },
      data: body,
    });
  }

  async destroyById(id: number) {
    return this.prisma.animation.delete({ where: { id } });
  }
}
