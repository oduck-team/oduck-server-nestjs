import { MemberProfile, Role } from '@prisma/client';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, HttpCode, UseGuards } from '@nestjs/common';
import {
  QueryDto,
  UpdateNameDto,
  UpdateProfileDto,
} from './dto/member.req.dto';
import { MemberService } from './member.service';
import { RolesGuard } from 'src/global/auth/guard/roles.guard';
import { Roles } from 'src/global/common/decoratror/roles.decorator';
import { User } from 'src/global/common/decoratror/user.decorator';
import { MemberProfileDtoWithCount } from './dto/member.res.dto';
import { GetBookmarkListDto } from '../bookmark/dto/bookmark.res.dto';

@Controller('/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  /**
   *
   * @tag Member
   * @summary 회원 가입
   * @security cookie
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
   *
   * @tag Member
   * @summary 회원 프로필 조회
   * @security cookie
   */
  @TypedRoute.Patch('/profile')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  async handleUpdateProfile(
    @User() user: MemberProfile,
    @TypedBody() body: UpdateProfileDto,
  ): Promise<void> {
    await this.memberService.updateProfile(user.memberId, body);
  }

  /**
   *
   * @tag Member
   * @summary 회원 북마크 조회
   * @security cookie
   */
  @TypedRoute.Get('/bookmarks')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER)
  async handleGetBookmarks(
    @User() user: MemberProfile,
    @TypedQuery() query: QueryDto,
  ): Promise<GetBookmarkListDto[]> {
    return await this.memberService.getBookmarks(user.memberId, query);
  }

  /**
   *
   * @tag Member
   * @summary 회원 이름 변경
   * @security cookie
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

  /**
   *
   * @tag Member
   * @summary 회원 탈퇴
   * @security cookie
   */
  @TypedRoute.Delete('/withdrawal')
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER)
  async handleWithdrawal(@User() user: MemberProfile): Promise<void> {
    await this.memberService.withdrawal(user.memberId);
  }
}
