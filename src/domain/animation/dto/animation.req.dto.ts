import { BroadcastType, Rating, Status } from '@prisma/client';

export interface AnimationListDto {
  /**
   * @default 20
   * */
  pageSize?: number;

  /**
   * @description 직전 페이지 마지막 ID / empty '' 면 처음부터
   * */
  lastId?: number;

  /**
   * @default createdAt
   * */
  sortBy?: string;

  /**
   * @default desc
   * @enum Sort
   * */
  sortOrder?: string;

  /**
   * @default 바키
   * */
  search?: string;
}

export interface AnimationRelationDto {
  /**
   * @default 가이낙스
   * */
  studioNames: string[];
}

export interface AnimationBaseDto {
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
}

export interface AnimationReqDto
  extends AnimationBaseDto,
    AnimationRelationDto {}

export type AnimationUpdateDto = Partial<AnimationBaseDto>;
