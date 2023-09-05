import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BookmarkRepository } from './bookmark.repository';
import { IBookmark } from './interface/bookmark.interface';

@Injectable()
export class BookmarkService {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async createBookmark(memberId: number, aniId: number) {
    const bookmark = await this.bookmarkRepository.findBookmark(
      memberId,
      aniId,
    );

    if (bookmark) {
      throw new ConflictException('Already bookmarked');
    }

    await this.bookmarkRepository.createBookmark(memberId, aniId);
  }

  async findBookmarks(memberId: number, query): Promise<any> {
    return await this.bookmarkRepository.findBookmarks(memberId, query);
  }

  async deleteBookmark(memberId: number, aniId: number) {
    const bookmark = await this.bookmarkRepository.findBookmark(
      memberId,
      aniId,
    );

    if (!bookmark) {
      throw new ForbiddenException('Not bookmarked');
    }

    await this.bookmarkRepository.deleteBookmark(memberId, aniId);
  }
}
