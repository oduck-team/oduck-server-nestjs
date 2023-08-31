import { AttractionElement } from '@prisma/client';
import { ShortReviewRepository } from '../../../src/domain/review/repository/short-review.repository';
import { Test } from '@nestjs/testing';
import { IShortReview } from '../../../src/domain/review/reviews.interface';
import { PrismaModule } from '../../../src/global/database/prisma/prisma.module';

describe('ShortReviewRepository', () => {
  let repository: ShortReviewRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ShortReviewRepository],
    }).compile();

    repository = module.get(ShortReviewRepository);
  });

  describe('selectShortReviewPage', () => {
    it('한줄 리뷰 페이지 조회', async () => {
      // given
      const MOCK_RESULT: IShortReview = {
        id: 1,
        memberId: 1,
        animationId: 1,
        rating: 5,
        createdAt: new Date(),
        shortReview: {
          comment: 'This is test',
          hasSpoiler: true,
        },
      };

      jest
        .spyOn(repository, 'selectShortReviewPage')
        .mockReturnValue(Promise.resolve([MOCK_RESULT]));

      // when
      const result = await repository.selectShortReviewPage();

      // then
      expect(result[0].id).toEqual(1);
      expect(result[0].shortReview?.comment).toEqual('This is test');
    });
  });

  describe('isShortReviewExist', () => {
    it('한줄 리뷰 중복 확인', async () => {
      // given
      const memberId: number = 123;
      const animationId: number = 456;

      jest
        .spyOn(repository, 'isShortReviewExist')
        .mockReturnValueOnce(Promise.resolve(false));

      jest
        .spyOn(repository, 'isShortReviewExist')
        .mockReturnValueOnce(Promise.resolve(true));

      // when
      const result1 = await repository.isShortReviewExist(
        memberId,
        animationId,
      );

      const result2 = await repository.isShortReviewExist(
        memberId,
        animationId,
      );

      // then
      expect(result1).toEqual(false);
      expect(result2).toEqual(true);
    });
  });

  describe('insertShortReview', () => {
    it('한줄 리뷰 저장', async () => {
      // given
      jest
        .spyOn(repository, 'insertShortReview')
        .mockReturnValue(Promise.resolve(123));

      // when
      const result = await repository.insertShortReview(
        1,
        1,
        5,
        'This is test',
        false,
        [AttractionElement.ACTION],
      );

      // then
      expect(result).toEqual(123);
    });
  });

  describe('updateShortReview', () => {
    it('한줄 리뷰 수정', async () => {
      // given
      const reviewId: number = 123;

      jest
        .spyOn(repository, 'updateShortReview')
        .mockReturnValue(Promise.resolve(reviewId));

      // when
      const result = await repository.updateShortReview(
        reviewId,
        3,
        'update review',
        true,
      );

      // then
      expect(result).toEqual(reviewId);
    });
  });

  describe('softDeleteShortReview', () => {
    it('한줄 리뷰 삭제', async () => {
      // given
      const reviewId: number = 123;

      jest
        .spyOn(repository, 'softDeleteShortReview')
        .mockReturnValue(Promise.resolve(reviewId));

      // when
      const result = await repository.softDeleteShortReview(reviewId);

      // then
      expect(result).toEqual(reviewId);
    });
  });
});
