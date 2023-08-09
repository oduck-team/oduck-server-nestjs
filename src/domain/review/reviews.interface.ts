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
