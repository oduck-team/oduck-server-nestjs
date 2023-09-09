import { AnimationBaseDto } from './animation.req.dto';
import { Genre, Season, Studio } from '@prisma/client';

export interface AnimationItemResDto extends Partial<AnimationBaseDto> {
  studios: Studio[];
  seasons: Season[];
  genres: Genre[];
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
