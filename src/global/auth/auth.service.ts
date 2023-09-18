import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthPassword, LoginType, Role } from '@prisma/client';
import {
  IAuthPassword,
  IAuthSocial,
} from 'src/domain/member/interface/member.interface';
import { comparePassword } from '../utils/bcrypt';
import { MemberRepository } from 'src/domain/member/member.repository';

@Injectable()
export class AuthService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async validateMember(details: IAuthSocial) {
    const memberAuth = await this.findAuthSocialBySocialId(details.socialId);

    if (memberAuth) {
      return this.findMemberById(memberAuth.memberId);
    }

    return this.createOAuthMember(details);
  }

  async validateMemberByPassword(details: IAuthPassword) {
    const memberAuth = await this.getAuthPassword(details.loginId);

    let password = details.password;

    const memberProfile = await this.findMemberProfile(memberAuth.memberId);
    if (memberProfile.role === Role.ADMIN) {
      password = await this.extractAdminPasswrd(details.password);
    }

    await this.comparePassword(password, memberAuth.password);

    return this.findMemberById(memberAuth.memberId);
  }

  async extractAdminPasswrd(password: string) {
    const inputTime = password.slice(0, 4);
    const inputPassword = password.slice(4);

    await this.compareTime(inputTime);

    return inputPassword;
  }

  private async findAuthSocialBySocialId(socialId: string) {
    const memberAuth = await this.memberRepository.findAuthSocialBySocialId(
      socialId,
    );

    return memberAuth;
  }

  private async createOAuthMember(details: IAuthSocial) {
    return await this.memberRepository.createOAuthMember(
      LoginType.SOCIAL,
      details,
    );
  }

  async findMemberProfile(memberId: number) {
    const memberProfile = await this.memberRepository.findMemberProfile(
      memberId,
    );

    if (!memberProfile) {
      throw new NotFoundException('Member not found');
    }

    return memberProfile;
  }

  private async findMemberById(memberId: number) {
    const member = await this.memberRepository.findMemberById(memberId);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  private async getAuthPassword(loginId: string): Promise<AuthPassword> {
    const memberAuth = await this.memberRepository.findAuthPasswordByLoginId(
      loginId,
    );

    if (!memberAuth) {
      throw new NotFoundException('Member not found');
    }

    return memberAuth;
  }

  private async compareTime(inputTime: string) {
    const now = new Date();

    const nowTime = ('0' + now.getHours()).slice(-2);
    const nowMinutes = ('0' + now.getMinutes()).slice(-2);

    if (inputTime !== `${nowTime}${nowMinutes}`) {
      throw new NotFoundException('Member not found');
    }
  }

  private async comparePassword(password: string, hashedPassword: string) {
    const result = await comparePassword(password, hashedPassword);

    if (!result) {
      throw new NotFoundException('Member not found');
    }
  }
}
