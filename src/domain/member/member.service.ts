import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MemberRepository } from './member.repository';
import {
  IAuthPassword,
  IAuthSocial,
  IMemberProfileWithCount,
  IMemerProfile,
} from './interface/member.interface';
import { LoginType } from '@prisma/client';
import { hashPassword } from 'src/global/utils/bcrypt';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async createOAuthMember(loginType: LoginType, details: IAuthSocial) {
    return await this.memberRepository.createOAuthMember(loginType, details);
  }

  async createLocalMember(details: IAuthPassword) {
    const member = await this.findAuthPasswordByLoginId(details.loginId);

    if (member) {
      throw new ConflictException('already exist loginId');
    }

    const password = await hashPassword(details.password);

    return await this.memberRepository.createLocalMember({
      ...details,
      password,
    });
  }

  async signup(id: number, name: string) {
    await this.existsMemberProfileByName(name);
    await this.memberRepository.signup(id, name);
  }

  async updateProfile(
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

  async findAuthPasswordByLoginId(loginId: string) {
    return await this.memberRepository.findAuthPasswordByLoginId(loginId);
  }

  async withdrawal(id: number): Promise<void> {
    await this.memberRepository.withdrawal(id);
  }
}
