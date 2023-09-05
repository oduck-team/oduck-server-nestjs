import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { BookmarkRepository } from './bookmark.repository';

@Module({
  imports: [],
  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarkRepository],
  exports: [BookmarkService, BookmarkRepository],
})
export class BookmarkModule {}
