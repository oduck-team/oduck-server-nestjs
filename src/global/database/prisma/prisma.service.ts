import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      // log: ['error', 'info', 'query', 'warn'],
      log: ['error'],
      // log: ['query'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.$on('query' as never, (event) => {
      console.log(event);
    });
  }
}
