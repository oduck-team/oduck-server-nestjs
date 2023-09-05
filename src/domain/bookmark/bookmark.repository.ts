import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaService } from 'src/global/database/prisma/prisma.service';

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
      skip: query.lastId ? 1 : 0,
      take: query.size,
      cursor: query.lastId && { id: query.lastId },
      include: {
        animation: true,
      },
      where: {
        memberId,
      },
      orderBy: {
        id: 'desc',
      },
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
