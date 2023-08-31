import { Module } from '@nestjs/common';
import { ShortReviewController } from './controller/short-review.controller';
import { ShortReviewService } from './service/short-review.service';
import { LongReviewService } from './service/long-review.service';
import { LongReviewController } from './controller/long-review.controller';
import { ShortReviewRepository } from './repository/short-review.repository';
import { LongReviewRepository } from './repository/long-review.repository';
import { PrismaModule } from '../../global/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShortReviewController, LongReviewController],
  providers: [
    ShortReviewRepository,
    LongReviewRepository,
    ShortReviewService,
    LongReviewService,
  ],
  exports: [ShortReviewService, LongReviewService],
})
export class ReviewsModule {}
