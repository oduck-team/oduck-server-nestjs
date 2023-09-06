import { AnimationBaseDto } from 'src/domain/animation/dto/animation.req.dto';

export interface GetBookmarkListDto {
  id: number;
  memberId: number;
  animation: AnimationBaseDto;
  createdAt: Date;
}
