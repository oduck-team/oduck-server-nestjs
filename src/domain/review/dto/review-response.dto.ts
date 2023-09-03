import {
  ILongReview,
  IMemberProfile,
  IShortReview,
} from '../reviews.interface';

class ReviewResponseDto {
  id: number;
  memberId: number;
  animationId: number;
  createdAt?: Date;
  memberName?: string;
  memberImage?: string | null;

  constructor(
    review: IShortReview | ILongReview,
    memberProfile?: IMemberProfile,
  ) {
    this.id = review.id;
    this.memberId = review.memberId;
    this.animationId = review.animationId;
    this.createdAt = review.createdAt;
    if (memberProfile) {
      this.memberName = memberProfile.name;
      this.memberImage = memberProfile.imageUrl;
    }
  }
}

export class ShortReviewResponseDto extends ReviewResponseDto {
  rating: number;
  comment: string;
  hasSpoiler: boolean;

  constructor(review: IShortReview, memberProfile?: IMemberProfile) {
    super(review, memberProfile);
    this.rating = review.rating;
    this.comment = review.shortReview!.comment;
    this.hasSpoiler = review.shortReview!.hasSpoiler;
  }
}

export class LongReviewResponseDto extends ReviewResponseDto {
  title: string;
  content: string;
  imageUrls?: string[];

  constructor(review: ILongReview, memberProfile?: IMemberProfile) {
    super(review, memberProfile);
    this.title = review.longReview!.title;
    this.content = review.longReview!.content;
    this.imageUrls = review.imageUrls?.map((obj) => obj.imageUrl);
  }
}
