import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { IAuthSocial } from './interface/member.interface';
import { LoginType, MemberProfile } from '@prisma/client';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async createMember(loginType: LoginType, details: IAuthSocial) {
    return await this.memberRepository.createMember(loginType, details);
  }

  async signup(id: number, name: string) {
    await this.existsMemberProfileByName(name);
    await this.memberRepository.signup(id, name);
  }

  async updateName(id: number, name: string): Promise<void> {
    await this.existsMemberProfileByName(name);

    await this.memberRepository.updateName(id, name);
  }

  async findMemberProfileByName(
    name: string,
  ): Promise<Omit<MemberProfile, 'id'>> {
    const memberProfile = await this.memberRepository.findMemberProfileByName(
      name,
    );

    if (!memberProfile) {
      throw new NotFoundException('Member not found');
    }

    return memberProfile!;
  }

  async existsMemberProfileByName(name: string) {
    const memberProfile = await this.memberRepository.findMemberProfileByName(
      name,
    );
    if (memberProfile) {
      throw new ConflictException('already exist name');
    }
  }

  async findMemberById(id: number) {
    return await this.memberRepository.findMemberById(id);
  }

  async findAuthSocialBySocialId(socialId: string) {
    return await this.memberRepository.findAuthSocialBySocialId(socialId);
  }
}
