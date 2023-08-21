import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LoginType, Role } from '@prisma/client';
import prisma from '../../global/libs/prisma';
import { randomUUID } from 'crypto';
import { IMemerProfile } from './member.interface';

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
    await prisma.memberProfile.update({
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
    return await prisma.member.findUnique({
      where: {
        id,
      },
    });
  }

  async findMemberBySocialId(socialId: string) {
    const member = await prisma.authSocial.findUnique({
      where: {
        socialId,
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
        point: true,
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

  async findMemberProfileByName(name: string): Promise<IMemerProfile> {
    try {
      const member = await prisma.memberProfile.findFirstOrThrow({
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

      return member;
    } catch (e) {
      throw new NotFoundException('Member not found');
    }
  }

  async updateName(id: number, name: string): Promise<void> {
    await prisma.memberProfile.update({
      where: {
        memberId: id,
      },
      data: {
        name,
      },
    });
  }
}
