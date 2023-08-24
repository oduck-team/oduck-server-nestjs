import { MemberRepository } from './../../domain/member/member.repository';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Member } from '@prisma/client';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly memberRepository: MemberRepository) {
    super();
  }
  serializeUser(member: Member, done: Function) {
    done(null, member);
  }

  async deserializeUser(payload: any, done: Function) {
    const memberProfile = await this.memberRepository.findMemberProfile(
      payload.id,
    );

    return memberProfile ? done(null, memberProfile) : done(null, null);
  }
}
