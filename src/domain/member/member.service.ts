import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { IMemerProfile, IAuthSocial } from './interface/member.interface';
import { LoginType } from '@prisma/client';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async createMember(loginType: LoginType, details: IAuthSocial) {
    return await this.memberRepository.createMember(loginType, details);
  }

  async signup(id: number, name: string) {
    await this.memberRepository.signup(id, name);
  }

  async updateName(id: number, name: string): Promise<void> {
    await this.getMemberProfileByName(name);
    await this.memberRepository.updateName(id, name);
  }

  async getMemberProfileByName(name: string): Promise<IMemerProfile> {
    const memberProfile = await this.memberRepository.findMemberProfileByName(
      name,
    );

    return memberProfile;
  }

  async findMemberById(id: number) {
    return await this.memberRepository.findMemberById(id);
  }

  async findAuthSocialBySocialId(socialId: string) {
    return await this.memberRepository.findAuthSocialBySocialId(socialId);
  }
}
