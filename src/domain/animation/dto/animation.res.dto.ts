import { AnimationBaseDto } from './animation.req.dto';
import {
  Genre,
  OriginalWorker,
  Season,
  Studio,
  VoiceActor,
} from '@prisma/client';

export interface AnimationItemResDto extends Partial<AnimationBaseDto> {
  studios: Studio[];
  seasons: Season[];
  genres: Genre[];
  voiceActors: VoiceActor[];
  originalWorkers: OriginalWorker[];
  // TODO: add keywords
}

export interface AnimationListResDto {
  items: AnimationItemResDto[];
  cursor: string;
  page: number;
  size: number;
  nextPage: number;
  lastPage: number;
  total: number;
}
