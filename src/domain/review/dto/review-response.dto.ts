import { IShortReview } from '../reviews.interface';

class ReviewResponseDto {
  id: number;
  memberId: number;
  animationId: number;
  createdAt: Date;

  constructor(
    id: number,
    memberId: number,
    animationId: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.memberId = memberId;
    this.animationId = animationId;
    this.createdAt = createdAt;
  }
}

export class ShortReviewResponseDto extends ReviewResponseDto {
  rating: number;
  comment?: string;
  hasSpoiler?: boolean;

  constructor(review: IShortReview) {
    super(review.id, review.memberId, review.animationId, review.createdAt);
    this.rating = review.rating;
    this.comment = review.shortReview?.comment;
    this.hasSpoiler = review.shortReview?.hasSpoiler;
  }
}
