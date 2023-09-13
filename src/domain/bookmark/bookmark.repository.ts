import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaService } from '../../global/database/prisma/prisma.service';

@Injectable()
export class BookmarkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBookmark(memberId: number, animationId: number) {
    await this.prisma.bookmark.create({
      data: {
        memberId,
        animationId,
      },
    });
  }

  async findBookmark(
    memberId: number,
    animationId: number,
  ): Promise<Bookmark | null> {
    return await this.prisma.bookmark.findFirst({
      where: {
        memberId,
        animationId,
      },
    });
  }

  async findBookmarks(memberId: number, query: any) {
    return await this.prisma.bookmark.findMany({
      select: {
        id: true,
        animation: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        createdAt: true,
      },
      where: {
        memberId,
      },
      orderBy: {
        id: 'desc',
      },
      skip: query.lastId ? 1 : 0,
      take: query.size,
      cursor: query.lastId && { id: query.lastId },
    });
  }

  async deleteBookmark(memberId: number, animationId: number) {
    await this.prisma.bookmark.deleteMany({
      where: {
        memberId,
        animationId,
      },
    });
  }
}
