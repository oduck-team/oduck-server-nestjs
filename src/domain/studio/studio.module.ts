import { Module } from '@nestjs/common';
import { StudioController } from './studio.controller';
import { StudioService } from './studio.service';
import { StudioRepository } from './studio.repository';
import { AdminStudioController } from './admin.studio.controller';

@Module({
  controllers: [StudioController, AdminStudioController],
  providers: [StudioService, StudioRepository],
})
export class StudioModule {}
