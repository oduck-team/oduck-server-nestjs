import { Injectable } from '@nestjs/common';
import {
  Member,
  LoginType,
  AuthSocial,
  Role,
  MemberProfile,
} from '@prisma/client';
import prisma from '../../global/libs/prisma';

@Injectable()
export class MemberRepository {
  async createMember(loginType: LoginType): Promise<Member> {
    const member = await prisma.member.create({
      data: { loginType },
    });
    return member;
  }

  async createAuthSocial(
    socialInfo: {
      email: string;
      socialId: string;
      type: string;
    },
    memberId: number,
  ): Promise<AuthSocial> {
    const authSocial = await prisma.authSocial.create({
      data: {
        ...socialInfo,
        memberId: memberId,
      },
    });

    return authSocial;
  }

  async createMemberProfile(
    memberId: number,
    name: string,
  ): Promise<MemberProfile> {
    const memberProfile = await prisma.memberProfile.create({
      data: {
        memberId,
        role: Role.GUEST,
        name,
      },
    });

    return memberProfile;
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
      where: {
        memberId,
      },
    });

    return member;
  }
}
