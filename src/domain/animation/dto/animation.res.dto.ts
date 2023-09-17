import { AnimationBaseDto } from './animation.req.dto';
import { Genre, OriginalWorker, Studio, VoiceActor } from '@prisma/client';

export interface AnimationItemResDto extends Partial<AnimationBaseDto> {
  id: number;
  studios: Studio[];
  genres: Genre[];
  voiceActors: VoiceActor[];
  originalWorkers: OriginalWorker[];
  // TODO: add keywords
}
