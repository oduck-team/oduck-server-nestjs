import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MemberRepository } from './member.repository';
import {
  IAuthSocial,
  IMemberProfileWithCount,
  IMemerProfile,
} from './interface/member.interface';
import { LoginType } from '@prisma/client';

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

  async updateProflie(
    id: number,
    updateProfile: Pick<IMemerProfile, 'info' | 'name'>,
  ): Promise<void> {
    await this.existsMemberProfileByName(updateProfile.name);

    await this.memberRepository.updateProfile(id, updateProfile);
  }

  async findMemberProfileByName(
    name: string,
  ): Promise<IMemberProfileWithCount> {
    const memberProfile = await this.memberRepository.findMemberProfileByName(
      name,
    );

    if (!memberProfile) {
      throw new NotFoundException('Member not found');
    }

    const counts = await this.memberRepository.getMemberReviewNLikeCounts(
      memberProfile.memberId,
    );

    const result = {
      ...memberProfile,
      reviews: counts!._count.reviews,
      reviewLikes: counts!._count.reviewLikes,
    };

    return result;
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
