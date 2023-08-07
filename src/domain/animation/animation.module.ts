import { Module } from '@nestjs/common';
import { AnimationController } from './animation.controller';
import { AnimationService } from './animation.service';
import {AnimationRepository} from "./animation.repository";
import {PrismaModule} from "../../global/database/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AnimationController],
  providers: [AnimationService, AnimationRepository],
  exports: [AnimationService],
})
export class AnimationModule {}
