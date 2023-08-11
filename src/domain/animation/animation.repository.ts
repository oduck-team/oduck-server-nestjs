import { Injectable } from '@nestjs/common';
import { Prisma, Animation } from '@prisma/client';
import { PrismaService } from '../../global/database/prisma/prisma.service';
import { IList } from './model/animation.list.dto';
import { AnimationCreateDto } from './model/animation.create.dto';

@Injectable()
export class AnimationRepository {
  constructor(private prisma: PrismaService) {}

  async getAnimations(params: IList): Promise<Animation[]> {
    const prismaQuery: {
      skip: number;
      take: number;
      ['where']?: Prisma.AnimationWhereInput;
      orderBy: NonNullable<unknown>;
    } = {
      skip: ((params.page ?? 1) - 1) * (params.length ?? 20),
      take: params.length ?? 20,
      // 정렬은 키와 정방향, 역방향 여부
      orderBy: {
        [params.sortKey ?? 'createdAt']: params.sort ?? 'desc',
      },
    };

    // search 키 없으면 전체
    if (params.search) {
      prismaQuery.where = Prisma.validator<Prisma.AnimationWhereInput>()({
        OR: [
          { name: { contains: params.search } },
          { plot: { contains: params.search } },
          { primaryKeyword: { contains: params.search } },
        ],
      });
    }

    return this.prisma.animation.findMany(prismaQuery);
  }

  async getAnimationById(id: number): Promise<Animation> {
    return this.prisma.animation.findFirstOrThrow({
      where: { id },
    });
  }

  async storeAnimation(body: AnimationCreateDto) {
    // TODO: modify to store voice_actor, studio.... transaction
    return this.prisma.animation.create({
      data: body,
    });
  }

  async updateAnimation(id: number, body: AnimationCreateDto) {
    // TODO: modify to store voice_actor, studio.... transaction
    return this.prisma.animation.update({
      where: { id },
      data: body,
    });
  }

  async destroyById(id: number) {
    return this.prisma.animation.delete({ where: { id } });
  }
}
