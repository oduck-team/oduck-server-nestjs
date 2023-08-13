import { Module } from '@nestjs/common';
import { ShortReviewController } from './controller/short-review.controller';
import { ShortReviewService } from './service/short-review.service';
import {
  LongReviewRepository,
  ShortReviewRepository,
} from './reviews.repository';
import { LongReviewService } from './service/long-review.service';
import { PrismaModule } from '../../global/config/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShortReviewController],
  providers: [
    ShortReviewRepository,
    LongReviewRepository,
    ShortReviewService,
    LongReviewService,
  ],
  exports: [],
})
export class ReviewsModule {}
