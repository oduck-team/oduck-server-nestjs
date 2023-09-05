import { Animation } from '@prisma/client';

export interface IBookmark {
  id: number;
  memberId: number;
  animation: Animation;
  createdAt: Date;
}
