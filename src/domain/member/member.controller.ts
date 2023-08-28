import { MemberProfile, Role } from '@prisma/client';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { UpdateNameDto, UpdateProfileDto } from './dto/RequestMember.dto';
import { MemberService } from './member.service';
import { RolesGuard } from 'src/global/auth/guard/roles.guard';
import { Roles } from 'src/global/common/decoratror/roles.decorator';
import { User } from 'src/global/common/decoratror/user.decorator';
import { MemberProfileDtoWithCount } from './dto/ResponseMember.dto';

@Controller('/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  /**
   * @tag Member
   * @summary 회원가입
   * @security apiCookie
   */
  @TypedRoute.Post('/signup')
  @UseGuards(RolesGuard)
  @Roles(Role.GUEST)
  async handleSignup(
    @User() user: MemberProfile,
    @TypedBody() body: UpdateNameDto,
  ) {
    await this.memberService.signup(user.memberId, body.name);
  }

  /**
   * @tag Member
   */
  @TypedRoute.Patch('/profile')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async handleUpdateProfile(
    @User() user: MemberProfile,
    @TypedBody() body: UpdateProfileDto,
  ): Promise<void> {
    await this.memberService.updateProflie(user.memberId, body);
  }

  /**
   * @tag Member
   */
  @TypedRoute.Get(':name')
  async handleGetProfile(
    @User() user: MemberProfile,
    @TypedParam('name') name: string,
  ): Promise<MemberProfileDtoWithCount> {
    const member = await this.memberService.findMemberProfileByName(name);

    if (user?.name !== name) {
      return member;
    }

    return {
      ...member,
      isMine: true,
    };
  }
}
