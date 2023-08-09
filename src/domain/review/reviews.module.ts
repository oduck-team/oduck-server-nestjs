import { Module } from '@nestjs/common';
import { ShortReviewController } from './controller/short-review.controller';
import { ShortReviewService } from './service/short-review.service';
import { ShortReviewRepository } from './repo/short-review.repository';

@Module({
  imports: [],
  controllers: [ShortReviewController],
  providers: [ShortReviewRepository, ShortReviewService],
  exports: [],
})
export class ReviewsModule {}
