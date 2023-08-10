import { LoginType, Role } from '@prisma/client';
import { MemberRepository } from './../../domain/member/member.repository';
import { Injectable, Logger } from '@nestjs/common';
import prisma from '../libs/prisma';

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

    return await prisma.$transaction(async (tx) => {
      const newMember = await tx.member.create({
        data: {
          loginType: LoginType.SOCIAL,
        },
      });

      await tx.authSocial.create({
        data: {
          ...details,
          memberId: newMember.id,
        },
      });

      await tx.memberProfile.create({
        data: {
          memberId: newMember.id,
          role: Role.GUEST,
          name: details.email.split('@')[0],
        },
      });

      Logger.log(`Member created: ${JSON.stringify(member)}`);
      return newMember;
    });
  }
}
