import { BroadcastType, Rating, Status } from '@prisma/client';

export interface AnimationCreateDto {
  /**
   * @default 바키
   * */
  name: string;

  /**
   * @default 아부지 싸움 잘하시네요?
   * */
  plot: string;

  /**
   * @default OVA
   * */
  broadcastType: BroadcastType;

  /**
   * @default 1
   * */
  episodeNumber: number;

  /**
   * @default ADULT
   * */
  rating: Rating;

  /**
   * @default 싸움
   * */
  primaryKeyword: string;

  /**
   * @default ONGOING
   * */
  status: Status;

  /**
   * @default true
   * */
  isReleased: boolean;

  /**
   * @default https://placehold.co/600x400
   * */
  imageUrl: string;

  //========  relation studio
  /**
   * @default 가이낙스
   * */
  studioName: string;
}
