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
import { BookmarkService } from '../bookmark/bookmark.service';

@Controller('/members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly bookmarkService: BookmarkService,
  ) {}

  /**
   *
   * @tag Member
   * @summary 회원 가입
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
   *
   * @tag Member
   * @summary 회원 프로필 조회
   * @security apiCookie
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
   * @tag Bookmark
   * @summary 회원 북마크 조회
   * @security apiCookie
   * @description
   * 최초 조회시 lastId를 보내지 않는다.
   * lastId는 이전 조회의 마지막 id를 보내준다.
   * @example 처음 10개 조회
   * /members/bookmarks?size=10
   * @example 11번째부터 10개 조회
   * /members/bookmarks?size=10&lastId=10
   */
  @TypedRoute.Get('/bookmarks')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER)
  async handleGetBookmarks(
    @User() user: MemberProfile,
    @TypedQuery() query: QueryDto,
  ) {
    return await this.bookmarkService.findBookmarks(user.memberId, query);
  }

  /**
   *
   * @tag Member
   * @summary 회원 프로필 조회
   * @security apiCookie
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
   * @security apiCookie
   */
  @TypedRoute.Delete('/withdrawal')
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER)
  async handleWithdrawal(@User() user: MemberProfile): Promise<void> {
    await this.memberService.withdrawal(user.memberId);
  }
}
