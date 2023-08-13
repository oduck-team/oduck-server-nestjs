import { LoginType } from '@prisma/client';
import { MemberRepository } from './../../domain/member/member.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async validateUser(details: {
    email: string;
    socialId: string;
    type: string;
  }) {
    const member = await this.memberRepository.findMemberByEmail(details.email);

    if (member) {
      return await this.memberRepository.findMemberById(member.memberId);
    }

    return await this.memberRepository.createMember(LoginType.SOCIAL, details);
  }
}
