import { Prisma } from '@prisma/client';

export interface IShortReview {
  id: number;
  memberId: number;
  animationId: number;
  rating: number;
  createdAt: Date;
  shortReview: {
    comment: string;
    hasSpoiler: boolean;
  } | null;
}

export interface IReviewQuery {
  where: {
    reviewId: Prisma.ReviewWhereInput;
    deletedAt: Date | null;
  };
  skip?: number;
  take?: number;
  cursor?: NonNullable<any>;
  orderBy?: NonNullable<any>;
}
