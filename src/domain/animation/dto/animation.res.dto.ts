import { AnimationBaseDto } from './animation.req.dto';
import { Studio } from '@prisma/client';

export interface AnimationItemResDto extends Partial<AnimationBaseDto> {
  studios: { studio: Studio }[];
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
