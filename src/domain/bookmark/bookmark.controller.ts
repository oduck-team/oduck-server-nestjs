import { Controller, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { RolesGuard } from 'src/global/auth/guard/roles.guard';
import { Roles } from 'src/global/common/decoratror/roles.decorator';
import { MemberProfile, Role } from '@prisma/client';
import { User } from 'src/global/common/decoratror/user.decorator';
import { CreateDto } from './dto/bookmark.req.dto';

@Controller('/bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  /**
   *
   * @tag Bookmark
   * @summary 북마크 생성
   * @security apiCookie
   */
  @TypedRoute.Post('/')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER)
  async handleCreateBookmark(
    @User() user: MemberProfile,
    @TypedBody() body: CreateDto,
  ) {
    await this.bookmarkService.createBookmark(user.memberId, body.id);
  }

  /**
   *
   * @tag Bookmark
   * @summary 북마크 제거
   * @security apiCookie
   */
  @TypedRoute.Delete('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER)
  async handleDeleteBookmark(
    @User() user: MemberProfile,
    @TypedParam('id') id: number,
  ) {
    await this.bookmarkService.deleteBookmark(user.memberId, id);
  }
}
