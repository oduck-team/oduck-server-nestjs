import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/database/prisma/prisma.service';
import { GenreCreateDto } from './dto/genre.create.dto';
import { Genre } from '@prisma/client';

@Injectable()
export class GenreRepository {
  constructor(private prisma: PrismaService) {}

  async store(body: GenreCreateDto, prisma: PrismaService = this.prisma) {
    return prisma.genre.create({
      data: body,
    });
  }

  async firstOrCreate(name: string, prisma: PrismaService = this.prisma) {}
}
