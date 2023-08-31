import { LongReviewRepository } from '../../../src/domain/review/repository/long-review.repository';
import { Test } from '@nestjs/testing';
import { ILongReview } from '../../../src/domain/review/reviews.interface';
import { PrismaModule } from '../../../src/global/database/prisma/prisma.module';

describe('LongReviewRepository', () => {
  let repository: LongReviewRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [LongReviewRepository],
    }).compile();

    repository = module.get(LongReviewRepository);
  });

  const MOCK_RESULT: ILongReview = {
    id: 1,
    memberId: 1,
    animationId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrls: [{ imageUrl: 'test.jpg' }],
    longReview: {
      title: 'Test',
      content: 'This is test!',
    },
  };

  describe('selectLongReviewPage', () => {
    it('장문 리뷰 페이지 조회', async () => {
      // given
      jest
        .spyOn(repository, 'selectLongReviewPage')
        .mockReturnValue(Promise.resolve([MOCK_RESULT]));

      // when
      const result = await repository.selectLongReviewPage();

      // then
      expect(result[0].id).toEqual(1);
      expect(result[0].longReview?.title).toEqual('Test');
    });
  });

  describe('selectLongReviewById', () => {
    it('장문 리뷰 상세 조회', async () => {
      // given
      const reviewId: number = 1;

      jest
        .spyOn(repository, 'selectLongReviewById')
        .mockReturnValue(Promise.resolve(MOCK_RESULT));

      // when
      const result = await repository.selectLongReviewById(reviewId);

      // then
      expect(result.id).toEqual(reviewId);
      expect(result.longReview?.title).toEqual('Test');
    });
  });

  describe('insertLongReview', () => {
    it('장문 리뷰 저장', async () => {
      // given
      const memberId: number = 123;
      const animationId: number = 456;
      const title: string = 'Insert Test';
      const content: string = 'This is inserted!';
      const imageUrls: string[] = ['insert.jpg'];
      const INSERT_RESULT: ILongReview = {
        id: 1,
        memberId,
        animationId,
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrls: [{ imageUrl: imageUrls[0] }],
        longReview: {
          title,
          content,
        },
      };

      jest
        .spyOn(repository, 'insertLongReview')
        .mockReturnValue(Promise.resolve(INSERT_RESULT));

      // when
      const result = await repository.insertLongReview(
        memberId,
        animationId,
        5,
        title,
        content,
        imageUrls,
      );

      // then
      expect(result.memberId).toEqual(memberId);
      expect(result.animationId).toEqual(animationId);
      expect(result.longReview?.title).toEqual(title);
      expect(result.longReview?.content).toEqual(content);
      expect(result.imageUrls![0].imageUrl).toEqual(imageUrls[0]);
    });
  });

  describe('updateLongReview', () => {
    it('장문 리뷰 수정', async () => {
      // given
      const reviewId: number = 456;
      const title: string = 'Update Test';
      const content: string = 'This is updated!';
      const imageUrls: string[] = ['update.jpg'];

      const updatedField: Partial<ILongReview> = {
        longReview: {
          title,
          content,
        },
        imageUrls: [{ imageUrl: imageUrls[0] }],
      };

      const UPDATE_RESULT: ILongReview = {
        ...MOCK_RESULT,
        ...updatedField,
      };

      jest
        .spyOn(repository, 'updateLongReview')
        .mockReturnValue(Promise.resolve(UPDATE_RESULT));

      // when
      const result = await repository.updateLongReview(
        reviewId,
        3,
        title,
        content,
        imageUrls,
      );

      // then
      expect(result.longReview?.title).toEqual(title);
      expect(result.longReview?.content).toEqual(content);
      expect(result.imageUrls![0].imageUrl).toEqual(imageUrls[0]);
    });
  });

  describe('softDeleteLongReview', () => {
    it('장문 리뷰 삭제', async () => {
      // given
      const reviewId: number = 123;

      jest
        .spyOn(repository, 'softDeleteLongReview')
        .mockReturnValue(Promise.resolve(reviewId));

      // when
      const result = await repository.softDeleteLongReview(reviewId);

      // then
      expect(result).toEqual(reviewId);
    });
  });
});
