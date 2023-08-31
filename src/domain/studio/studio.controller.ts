import { Controller } from '@nestjs/common';
import { StudioService } from './studio.service';

@Controller('studios')
export class StudioController {
  constructor(private readonly service: StudioService) {}
}
