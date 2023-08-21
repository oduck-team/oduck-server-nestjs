import { MemberService } from './member.service';
import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberRepository } from './member.repository';

@Module({
  imports: [],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberRepository],
})
export class MemberModule {}
