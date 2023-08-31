import { Injectable, Logger } from '@nestjs/common';
import { LoginType, Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { IAuthSocial, IMemerProfile } from './interface/member.interface';
import { PrismaService } from '../../global/database/prisma/prisma.service';

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createMember(
    loginType: LoginType,
    details: IAuthSocial,
  ): Promise<{ id: number; loginType: LoginType }> {
    const member = await this.prisma.member.create({
      data: {
        loginType,
        authSocial: { create: { ...details } },
        memberProfile: {
          create: {
            role: Role.GUEST,
            name: randomUUID(),
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

  async signup(id: number, name: string): Promise<void> {
    await this.prisma.memberProfile.update({
      where: {
        memberId: id,
      },
      data: {
        name,
        role: Role.MEMBER,
      },
    });
  }

  async findMemberById(id: number) {
    const member = await this.prisma.member.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    return member;
  }

  async findAuthSocialBySocialId(socialId: string) {
    const authSocial = await this.prisma.authSocial.findUnique({
      where: {
        socialId,
      },
    });

    return authSocial;
  }

  async findMemberProfile(memberId: number) {
    const memberProfile = await this.prisma.memberProfile.findUnique({
      select: {
        memberId: true,
        name: true,
        info: true,
        role: true,
        point: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        memberId,
        member: {
          deletedAt: null,
        },
      },
    });

    return memberProfile;
  }

  async findMemberProfileByName(name: string) {
    const memberProfile = await this.prisma.memberProfile.findFirst({
      select: {
        memberId: true,
        name: true,
        info: true,
        role: true,
        point: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        name,
        member: {
          deletedAt: null,
        },
      },
    });

    return memberProfile;
  }

  async getMemberReviewNLikeCounts(memberId: number) {
    const counts = await this.prisma.member.findUnique({
      select: {
        _count: {
          select: {
            reviews: true,
            reviewLikes: true,
          },
        },
      },
      where: {
        id: memberId,
      },
    });

    return counts;
  }

  async updateProfile(
    id: number,
    profileData: Pick<IMemerProfile, 'info' | 'name'>,
  ): Promise<void> {
    await this.prisma.memberProfile.update({
      where: {
        memberId: id,
      },
      data: {
        name: profileData.name,
        info: profileData.info,
      },
    });
  }

  async withdrawal(id: number): Promise<void> {
    await this.prisma.member.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
