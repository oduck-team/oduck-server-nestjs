import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../global/database/prisma/prisma.service';
import { AnimationListDto } from './dto/animation.req.dto';
import { AnimationReqDto } from './dto/animation.req.dto';
import { Sort } from '../../global/common/types/sort';
import { Role } from '@prisma/client';

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
      // TODO: keywords
      seasons: true,
    };
  }

  private makeCommonBodyQuery(body: AnimationReqDto, id?: number) {
    const {
      studioNames,
      genres,
      voiceActors,
      originalWorkers,
      seasons,
      ...animationBody
    } = body;

    return {
      ...animationBody,

      studios: {
        deleteMany: id ? { animationId: id } : undefined,
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
        deleteMany: id ? { animationId: id } : undefined,
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
        deleteMany: id ? { animationId: id } : undefined,
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
        deleteMany: id ? { animationId: id } : undefined,
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
        deleteMany: id ? { animationId: id } : undefined,
        create: seasons.map((s) => ({
          year: s.year,
          quarter: s.quarter,
        })),
      },
      // TODO: keywords
    };
  }

  async getAnimations(role: Role, params: AnimationListDto) {
    const search = {
      OR: [
        { name: { contains: params.search ?? '' } },
        { plot: { contains: params.search ?? '' } },
        { primaryKeyword: { contains: params.search ?? '' } },
      ],
      status: params.status ?? {},
      isReleased: role === Role.ADMIN ? {} : true,
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

  async getAnimationById(role: Role, id: number) {
    return this.prisma.animation.findFirstOrThrow({
      where: {
        id,
        isReleased: role === Role.ADMIN ? {} : true,
      },
      include: this.makeCommonIncludeQuery(),
    });
  }

  async storeAnimation(body: AnimationReqDto) {
    return this.prisma.animation.create({
      data: this.makeCommonBodyQuery(body),
      include: this.makeCommonIncludeQuery(),
    });
  }

  async updateAnimation(id: number, body: AnimationReqDto) {
    return this.prisma.$transaction(async (tx) => {
      return tx.animation.update({
        where: { id },
        data: this.makeCommonBodyQuery(body, id),
        include: this.makeCommonIncludeQuery(),
      });
    });
  }

  async destroyById(id: number) {
    return this.prisma.animation.delete({ where: { id } });
  }
}
