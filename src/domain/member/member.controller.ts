import { MemberProfile, Role } from '@prisma/client';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { UpdateNameDto } from './dto/RequestMember.dto';
import { MemberService } from './member.service';
import { RolesGuard } from 'src/global/auth/guard/roles.guard';
import { Roles } from 'src/global/common/decoratror/roles.decorator';
import { User } from 'src/global/common/decoratror/user.decorator';
import { MemberProfileDto } from './dto/ResponseMember.dto';

@Controller('/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  /**
   * @tag Member
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
  @TypedRoute.Patch('/name')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async handleUpdateName(
    @User() user: MemberProfile,
    @TypedBody() body: UpdateNameDto,
  ): Promise<void> {
    await this.memberService.updateName(user.memberId, body.name);
  }

  /**
   * @tag Member
   */
  @TypedRoute.Get(':name')
  async handleGetProfile(
    @User() user: MemberProfile,
    @TypedParam('name') name: string,
  ): Promise<MemberProfileDto> {
    if (user?.name !== name) {
      return await this.memberService.findMemberProfileByName(name);
    }

    return {
      ...user,
      isMine: true,
    };
  }
}
