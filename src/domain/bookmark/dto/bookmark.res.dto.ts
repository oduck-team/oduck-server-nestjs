import { AnimationBaseDto } from 'src/domain/animation/dto/animation.req.dto';

export interface GetBookmarkListDto {
  id: number;
  animation: AnimationBaseDto;
  createdAt: Date;
}
