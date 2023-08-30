import { Prisma } from '@prisma/client';

export interface IShortReview {
  id: number;
  memberId: number;
  animationId: number;
  rating: number;
  likeCount: number;
  createdAt: Date;
  shortReview: {
    comment: string;
    hasSpoiler: boolean;
  } | null;
}

export interface ILongReview {
  id: number;
  memberId: number;
  animationId: number;
  createdAt?: Date;
  updatedAt: Date;
  imageUrls?: { imageUrl: string }[];
  longReview: {
    title: string;
    content: string;
  } | null;
}

export interface IReviewQuery {
  where: Prisma.ReviewWhereInput;
  skip?: number;
  take?: number;
  cursor?: NonNullable<any>;
  orderBy?: NonNullable<any>;
}

export type SortCondition = (typeof SORTING)[keyof typeof SORTING];

const SORTING = {
  CREATED: 'createdAt|desc',
  HIGH_RATING: 'rating|desc',
  LOW_RATING: 'rating|asc',
  // FAVORITE: 'favorite|desc',
} as const;
