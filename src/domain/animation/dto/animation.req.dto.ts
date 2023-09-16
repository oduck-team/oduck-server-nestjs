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

  /**
   * @enum Status
   * @default ONGOING
   * */
  status?: string;
}

export interface AnimationRelationDto {
  /**
   * @default 가이낙스
   * */
  studioNames: string[];

  /**
   * @default FANTASY
   * */
  genres: string[];

  /**
   * @default 타네다 리사
   * */
  voiceActors: string[];

  /**
   * @type string[]
   * @default 데즈카 오사무
   * */
  originalWorkers: string[];

  //TODO: add keywords
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
   * @default 2023
   * */
  seasonYear: number;

  /**
   * @default 1
   * @enum [1, 2, 3, 4]
   * */
  seasonQuarter: number;

  /**
   * @default 에반게리온
   * @description 시리즈인 경우 대표적인 이름. ex) [에반게리온 서, 파, Q] -> 에반게리온
   * */
  seriesGroup: string | null;

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
