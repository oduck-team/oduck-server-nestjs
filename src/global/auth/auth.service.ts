import { Injectable } from '@nestjs/common';
import { LoginType } from '@prisma/client';
import { MemberService } from '../../domain/member/member.service';
import { IAuthSocial } from 'src/domain/member/interface/member.interface';

@Injectable()
export class AuthService {
  constructor(private readonly memberService: MemberService) {}

  async validateUser(details: IAuthSocial) {
    const member = await this.memberService.findAuthSocialBySocialId(
      details.socialId,
    );

    if (member) {
      return await this.memberService.findMemberById(member.memberId);
    }

    return await this.memberService.createMember(LoginType.SOCIAL, details);
  }
}
