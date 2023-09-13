import { GenreType } from '@prisma/client';

export interface GenreCreateDto {
  /**
   * @default GenreType
   * */
  type: GenreType;
}
