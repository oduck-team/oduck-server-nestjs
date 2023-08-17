import { Module } from '@nestjs/common';
import { AnimationController } from './animation.controller';
import { AnimationService } from './animation.service';
import { AnimationRepository } from './animation.repository';
import { PrismaModule } from '../../global/database/prisma/prisma.module';
import { AdminAnimationController } from './admin.animation.controller';
import { AnimationRelModule } from './animation.rel.module';

@Module({
  imports: [AnimationRelModule],
  controllers: [AnimationController, AdminAnimationController],
  providers: [AnimationService, AnimationRepository],
  exports: [AnimationService],
})
export class AnimationModule {}
