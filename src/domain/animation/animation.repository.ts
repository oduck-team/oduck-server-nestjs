import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/database/prisma/prisma.service';
import { AnimationListDto } from './dto/animation.req.dto';
import { AnimationReqDto, AnimationUpdateDto } from './dto/animation.req.dto';
import { AnimationItemResDto } from './dto/animation.res.dto';
import { Sort } from '../../global/common/types/sort';

@Injectable()
export class AnimationRepository {
  constructor(private prisma: PrismaService) {}

  async getAnimations(params: AnimationListDto) {
    const search = params.search
      ? {
          OR: [
            { name: { contains: params.search } },
            { plot: { contains: params.search } },
            { primaryKeyword: { contains: params.search } },
          ],
        }
      : {};

    return this.prisma.animation.findMany({
      skip: params.lastId ? 1 : 0,
      take: params.pageSize ?? 20,
      orderBy: {
        [params.sortBy ?? 'createdAt']: params.sortOrder ?? Sort.DESC,
      },
      where: search,
      include: {
        studios: {
          select: {
            studio: true,
          },
        },
      },
    });
  }

  async getAnimationById(id: number) {
    return this.prisma.animation.findFirst({
      where: { id },
      include: { studios: { select: { studio: true } } },
    });
  }

  async storeAnimation(body: AnimationReqDto) {
    // TODO: modify to store voice_actor, studio.... transaction
    const { studioNames, ...animationBody } = body;

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
        // TODO: other relations
        // TODO: other relations
        // TODO: other relations
      },
      include: {
        studios: {
          select: {
            studio: true,
          },
        },
        // TODO: other relations
        // TODO: other relations
        // TODO: other relations
        // TODO: other relations
      },
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
