import { ILongReview, IShortReview } from '../reviews.interface';

class ReviewResponseDto {
  id: number;
  memberId: number;
  animationId: number;
  createdAt?: Date;

  constructor(
    id: number,
    memberId: number,
    animationId: number,
    createdAt?: Date,
  ) {
    this.id = id;
    this.memberId = memberId;
    this.animationId = animationId;
    this.createdAt = createdAt;
  }
}

export class ShortReviewResponseDto extends ReviewResponseDto {
  rating: number;
  comment: string;
  hasSpoiler: boolean;

  constructor(review: IShortReview) {
    super(review.id, review.memberId, review.animationId, review.createdAt);
    this.rating = review.rating;
    this.comment = review.shortReview!.comment;
    this.hasSpoiler = review.shortReview!.hasSpoiler;
  }
}

export class LongReviewResponseDto extends ReviewResponseDto {
  title: string;
  content: string;
  imageUrls?: string[];

  constructor(review: ILongReview) {
    super(review.id, review.memberId, review.animationId, review.createdAt);
    this.title = review.longReview!.title;
    this.content = review.longReview!.content;
    this.imageUrls = review.imageUrls?.map((obj) => obj.imageUrl);
  }
}
