import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/global/database/prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
