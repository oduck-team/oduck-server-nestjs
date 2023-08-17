import { Module } from '@nestjs/common';
import { StudioModule } from '../studio/studio.module';
import { StudioRepository } from '../studio/studio.repository';

@Module({
  imports: [StudioModule],
  providers: [StudioRepository],
  exports: [StudioRepository],
})
export class AnimationRelModule {}
