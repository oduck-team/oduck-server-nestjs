import { Injectable, Logger } from '@nestjs/common';
import { Member, LoginType, Role } from '@prisma/client';
import prisma from '../../global/libs/prisma';

@Injectable()
export class MemberRepository {
  async createMember(
    loginType: LoginType,
    socialInfo: {
      email: string;
      socialId: string;
      type: string;
    },
  ): Promise<{ id: number; loginType: LoginType }> {
    const member = await prisma.member.create({
      data: {
        loginType,
        authSocial: { create: { ...socialInfo } },
        memberProfile: {
          create: {
            role: Role.GUEST,
            name: socialInfo.email.split('@')[0],
          },
        },
      },
      select: {
        id: true,
        loginType: true,
      },
    });

    Logger.log(`Member created: ${JSON.stringify(member)}`);
    return member;
  }

  async findMemberById(id: number) {
    return await prisma.member.findUnique({
      where: {
        id,
      },
    });
  }

  async findMemberByEmail(email: string) {
    const member = await prisma.authSocial.findUnique({
      where: {
        email,
      },
    });

    return member;
  }

  async findMemberProfile(memberId: number) {
    const member = await prisma.memberProfile.findUnique({
      select: {
        memberId: true,
        name: true,
        role: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        memberId,
      },
    });
    // .then(({ memberId, ...member }) => ({ id: memberId, ...member }));

    return member;
  }
}
