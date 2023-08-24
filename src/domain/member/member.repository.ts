import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoginType, Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { IMemerProfile, IAuthSocial } from './interface/member.interface';
import { PrismaService } from 'src/global/database/prisma/prisma.service';

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
    try {
      const member = await this.prisma.member.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return member;
    } catch (e) {
      throw new NotFoundException('Member not found');
    }
  }

  async findAuthSocialBySocialId(socialId: string) {
    try {
      const authSocial = await this.prisma.authSocial.findUniqueOrThrow({
        where: {
          socialId,
        },
      });

      return authSocial;
    } catch (e) {
      throw new NotFoundException('Member not found');
    }
  }

  async findMemberProfile(memberId: number) {
    try {
      const memberProfile = await this.prisma.memberProfile.findUniqueOrThrow({
        select: {
          memberId: true,
          name: true,
          role: true,
          point: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          memberId,
        },
      });

      return memberProfile;
    } catch (e) {
      throw new NotFoundException('Member not found');
    }
  }

  async findMemberProfileByName(name: string): Promise<IMemerProfile> {
    try {
      const memberProfile = await this.prisma.memberProfile.findFirstOrThrow({
        select: {
          memberId: true,
          name: true,
          role: true,
          point: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          name,
        },
      });

      return memberProfile;
    } catch (e) {
      throw new NotFoundException('Member not found');
    }
  }

  async updateName(id: number, name: string): Promise<void> {
    await this.prisma.memberProfile.update({
      where: {
        memberId: id,
      },
      data: {
        name,
      },
    });
  }
}
