import { AttractionElement } from '@prisma/client';
import { ICommentTag } from 'typia/lib/metadata/ICommentTag';
import typia from 'typia';

export const checkCommentTag = typia.createIs<ICommentTag>();

interface CreateReviewDto {
  /**
   * @type int
   * @minimum 0
   * @maximum 5
   */
  readonly rating: number;
}

export interface CreateShortReviewDto extends CreateReviewDto {
  /**
   * @minLength 10
   * @maxLength 100
   */
  readonly comment: string;

  readonly hasSpoiler: boolean;

  /**
   * @minItems 0
   * @maxItems 6
   */
  readonly attractionPoints: AttractionElement[];
}

export interface ReviewPageQueryDto {
  readonly lastId?: number;
  readonly pageSize?: number;
  readonly sortKey?: string;
  readonly sortDir?: string;
}
