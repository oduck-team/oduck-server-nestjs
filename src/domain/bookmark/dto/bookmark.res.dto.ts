import { AnimationBaseDto } from 'src/domain/animation/dto/animation.req.dto';

export interface GetDto {
  id: number;
  memberId: number;
  animation: AnimationBaseDto;
  createdAt: Date;
}
