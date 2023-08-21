import { MemberProfile } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { IMemerProfile } from './member.interface';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

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
}
