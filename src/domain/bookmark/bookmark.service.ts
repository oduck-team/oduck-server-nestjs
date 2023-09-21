import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookmarkRepository } from './bookmark.repository';

@Injectable()
export class BookmarkService {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async createBookmark(memberId: number, aniId: number) {
    const bookmark = await this.existBookmark(memberId, aniId);

    if (bookmark) {
      throw new ConflictException('Already bookmarked');
    }

    await this.bookmarkRepository.createBookmark(memberId, aniId);
  }

  async findBookmark(memberId: number, aniId: number) {
    const bookmark = await this.bookmarkRepository.findBookmark(
      memberId,
      aniId,
    );

    if (!bookmark) {
      throw new NotFoundException('Not bookmarked');
    }
  }

  async existBookmark(memberId: number, aniId: number) {
    return await this.bookmarkRepository.findBookmark(memberId, aniId);
  }

  async findBookmarks(memberId: number, query) {
    return await this.bookmarkRepository.findBookmarks(memberId, query);
  }

  async deleteBookmark(memberId: number, aniId: number) {
    const bookmark = await this.existBookmark(memberId, aniId);

    if (!bookmark) {
      throw new NotFoundException('Not bookmarked');
    }

    await this.bookmarkRepository.deleteBookmark(memberId, aniId);
  }
}
