import { Module } from '@nestjs/common';
import { UsersController } from './members.controller';
import { MemberRepository } from './member.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [MemberRepository],
  exports: [MemberRepository],
})
export class UsersModule {}
