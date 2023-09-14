import { Injectable } from '@nestjs/common';
import { LoginType } from '@prisma/client';
import { MemberService } from '../../domain/member/member.service';
import {
  IAuthPassword,
  IAuthSocial,
} from 'src/domain/member/interface/member.interface';

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

    return await this.memberService.createOAuthMember(
      LoginType.SOCIAL,
      details,
    );
  }

  async validateUserByPassword(details: IAuthPassword) {
    const member = await this.memberService.findAuthPasswordByLoginId(
      details.loginId,
    );

    if (member && member.password === details.password) {
      return await this.memberService.findMemberById(member.memberId);
    }
  }
}
