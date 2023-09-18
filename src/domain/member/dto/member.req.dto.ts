import { IAuthPassword } from '../interface/member.interface';

export interface CreateMemberDto extends IAuthPassword {}

export interface UpdateNameDto {
  /**
   * @minLength 2
   * @maxLength 10
   * @pattern ^[가-힣A-Za-z0-9]{2,10}$
   * @example '홍길동'
   */
  name: string;
}

export interface UpdateProfileDto extends UpdateNameDto {
  /**
   * @minLength 0
   * @maxLength 100
   * @nullable
   * @default null
   * @example '안녕하세요'
   */
  info: string | null;
}

export interface QueryDto {
  /**
   * @example 1
   * @optional
   * @description 가져올 데이터의 시작 값
   */
  lastId?: number;

  /**
   * @minimum 1
   * @maximum 20
   * @default 20
   * @example 20
   * @description 한번에 가져올 데이터의 양
   */
  size: number;
}
