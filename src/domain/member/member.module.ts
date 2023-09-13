import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberRepository } from './member.repository';
import { PrismaModule } from '../../global/database/prisma/prisma.module';
import { BookmarkModule } from '../bookmark/bookmark.module';

@Module({
  imports: [PrismaModule, BookmarkModule],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberService, MemberRepository],
})
export class MemberModule {}
