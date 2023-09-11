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
