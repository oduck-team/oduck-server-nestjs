import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/database/prisma/prisma.service';
import { AnimationListDto } from './dto/animation.req.dto';
import { AnimationReqDto, AnimationUpdateDto } from './dto/animation.req.dto';
import { AnimationItemResDto } from './dto/animation.res.dto';

@Injectable()
export class AnimationRepository {
  constructor(private prisma: PrismaService) {}

  async getAnimations(
    params: AnimationListDto,
  ): Promise<AnimationItemResDto[]> {
    return this.prisma.animation.findMany({
      skip: ((params.page ?? 1) - 1) * (params.length ?? 20),
      take: params.length ?? 20,
      // 정렬은 키와 정방향, 역방향 여부
      //TODO:
      // cursor: ?,
      orderBy: {
        [params.sortKey ?? 'createdAt']: params.sort ?? 'desc',
      },
      where: {
        OR: params.search
          ? [
              { name: { contains: params.search } },
              { plot: { contains: params.search } },
              { primaryKeyword: { contains: params.search } },
            ]
          : [],
      },
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

  async storeAnimation(body: AnimationReqDto): Promise<AnimationItemResDto> {
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
