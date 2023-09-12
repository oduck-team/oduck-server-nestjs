import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkRepository } from './bookmark.repository';
import { BookmarkController } from './bookmark.controller';

@Module({
  imports: [],
  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarkRepository],
  exports: [BookmarkService],
})
export class BookmarkModule {}
