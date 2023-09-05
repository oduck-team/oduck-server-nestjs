import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { MemberProfile } from '@prisma/client';
import { RolesGuard } from 'src/global/auth/guard/roles.guard';
import { Roles } from 'src/global/common/decoratror/roles.decorator';
import { User } from 'src/global/common/decoratror/user.decorator';
import { BookmarkService } from './bookmark.service';
import { CreateDto } from './dto/bookmark.req.dto';

@Controller('/bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  /**
   *
   * @tag Bookmark
   * @summary 북마크 생성
   * @security cookie
   */
  @TypedRoute.Post('/')
  @UseGuards(RolesGuard)
  @Roles('MEMBER')
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
   * @security cookie
   */
  @TypedRoute.Delete('/:id')
  @UseGuards(RolesGuard)
  @Roles('MEMBER')
  async handleDeleteBookmark(
    @User() user: MemberProfile,
    @TypedParam('id') id: number,
  ) {
    await this.bookmarkService.deleteBookmark(user.memberId, id);
  }
}
