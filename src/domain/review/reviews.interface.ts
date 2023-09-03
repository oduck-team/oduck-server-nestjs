import { Prisma } from '@prisma/client';

export interface IShortReview extends Omit<IReview, 'updatedAt' | 'imageUrls'> {
  shortReview: {
    comment: string;
    hasSpoiler: boolean;
  } | null;
}

export interface ILongReview extends Omit<IReview, 'rating' | 'likeCount'> {
  longReview: {
    title: string;
    content: string;
  } | null;
}

export interface IMemberProfile {
  name: string;
  imageUrl: string | null;
}

export interface IReviewQuery {
  where: Prisma.ReviewWhereInput;
  skip?: number;
  take?: number;
  cursor?: NonNullable<any>;
  orderBy?: NonNullable<any>;
}

export type SortCondition = (typeof SORTING)[keyof typeof SORTING];

interface IReview {
  id: number;
  memberId: number;
  animationId: number;
  rating: number;
  likeCount: number;
  createdAt?: Date;
  updatedAt: Date;
  imageUrls?: { imageUrl: string }[];
  memberProfile?: IMemberProfile;
}

const SORTING = {
  CREATED: 'createdAt|desc',
  HIGH_RATING: 'rating|desc',
  LOW_RATING: 'rating|asc',
  FAVORITE: 'likeCount|desc',
} as const;
