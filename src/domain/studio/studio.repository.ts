import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/database/prisma/prisma.service';
import { StudioCreateDto } from './dto/studio.create.dto';
import { Studio } from '@prisma/client';

@Injectable()
export class StudioRepository {
  constructor(private prisma: PrismaService) {}

  async store(body: StudioCreateDto, prisma: PrismaService = this.prisma) {
    return prisma.studio.create({
      data: body,
    });
  }

  async firstOrCreate(
    studioName: string,
    prisma: PrismaService = this.prisma,
  ): Promise<Studio> {
    let studio = await prisma.studio.findFirst({
      where: {
        name: studioName,
      },
    });

    if (!studio) {
      studio = await prisma.studio.create({ data: { name: studioName } });
    }

    return studio;
  }
}
