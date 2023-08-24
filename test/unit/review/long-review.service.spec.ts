import { LongReviewService } from '../../../src/domain/review/service/long-review.service';
import { LongReviewRepository } from '../../../src/domain/review/repository/long-review.repository';
import { Test } from '@nestjs/testing';
import { PrismaModule } from '../../../src/global/config/prisma/prisma.module';
import { ILongReview } from '../../../src/domain/review/reviews.interface';
import {
  CreateLongReviewDto,
  ReviewPageQueryDto,
  UpdateLongReviewDto,
} from '../../../src/domain/review/dto/review-request.dto';
import { BadRequestException } from '@nestjs/common';

describe('LongReviewService', () => {
  let service: LongReviewService;
  let repository: LongReviewRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [LongReviewRepository, LongReviewService],
    }).compile();

    service = module.get(LongReviewService);
    repository = module.get(LongReviewRepository);
  });

  const MOCK_RESULT: ILongReview = {
    id: 1,
    memberId: 123,
    animationId: 456,
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrls: [{ imageUrl: 'test.jpg' }],
    longReview: {
      title: 'Test',
      content: 'This is test!',
    },
  };

  describe('findLongReviewPageByQuery', () => {
    it('장문 리뷰 커서 페이징 조회', async () => {
      // given
      const query: ReviewPageQueryDto = {
        memberId: 123,
        pageSize: 10,
        sortCondition: 'createdAt|desc',
      };

      jest
        .spyOn(repository, 'selectLongReviewPage')
        .mockReturnValue(Promise.resolve([MOCK_RESULT]));

      // when
      const result = await service.findLongReviewPageByQuery(query);

      // then
      expect(result.length).toEqual(1);
      expect(result[0].memberId).toEqual(123);
      expect(result[0].animationId).toEqual(456);
      expect(result[0].title).toEqual('Test');
      expect(result[0].imageUrls![0]).toEqual('test.jpg');
    });

    it('장문 리뷰 페이징 조회 시 memberId, animationId 검증', async () => {
      // given
      const query1: ReviewPageQueryDto = {
        memberId: 123,
        animationId: 456,
      };

      const query2: ReviewPageQueryDto = {
        memberId: undefined,
        animationId: undefined,
      };

      // then
      await expect(
        async () => await service.findLongReviewPageByQuery(query1),
      ).rejects.toThrowError(
        new BadRequestException(
          `두 인자 중 하나만 입력 가능합니다. memberId: ${query1.memberId}, animationId: ${query1.animationId}`,
        ),
      );

      await expect(
        async () => await service.findLongReviewPageByQuery(query2),
      ).rejects.toThrowError(
        new BadRequestException(
          `두 인자 중 하나만 입력 가능합니다. memberId: ${query2.memberId}, animationId: ${query2.animationId}`,
        ),
      );
    });
  });

  describe('findLongReviewDetail', () => {
    it('장문 리뷰 상세 조회', async () => {
      // given
      const reviewId: number = 1;

      jest
        .spyOn(repository, 'selectLongReviewById')
        .mockReturnValue(Promise.resolve(MOCK_RESULT));

      // when
      const result = await service.findLongReviewDetail(reviewId);

      // then
      expect(result.memberId).toEqual(123);
      expect(result.animationId).toEqual(456);
      expect(result.title).toEqual('Test');
      expect(result.imageUrls![0]).toEqual('test.jpg');
    });
  });

  describe('createLongReview', () => {
    it('장문 리뷰 작성', async () => {
      // given
      const memberId: number = 123;
      const animationId: number = 456;

      const dto: CreateLongReviewDto = {
        title: 'Test',
        content: 'This is test!',
        rating: 5,
        imageUrls: ['test.jpg'],
      };

      jest
        .spyOn(repository, 'insertLongReview')
        .mockReturnValue(Promise.resolve(MOCK_RESULT));

      // when
      const result = await service.createLongReview(memberId, animationId, dto);

      // then
      expect(result.memberId).toEqual(memberId);
      expect(result.animationId).toEqual(animationId);
      expect(result.title).toEqual('Test');
      expect(result.imageUrls![0]).toEqual('test.jpg');
    });
  });

  describe('updateLongReview', () => {
    it('장문 리뷰 수정', async () => {
      // given
      const reviewId: number = 1;

      const dto: UpdateLongReviewDto = {
        title: 'Updated Test',
        content: 'This is updated!',
        rating: 1,
        imageUrls: ['update.jpg'],
      };

      const UPDATED_RESULT: ILongReview = {
        ...MOCK_RESULT,
        ...{
          longReview: {
            title: dto.title,
            content: dto.content,
          },
        },
      };

      jest
        .spyOn(repository, 'updateLongReview')
        .mockReturnValue(Promise.resolve(UPDATED_RESULT));

      // when
      const result = await service.updateLongReview(reviewId, dto);

      // then
      expect(result.title).toEqual('Updated Test');
      expect(result.content).toEqual('This is updated!');
      expect(result.imageUrls![0]).toEqual('update.jpg');
    });
  });

  describe('deleteLongReview', () => {
    it('장문 리뷰 삭제', async () => {
      // given
      const reviewId: number = 1;
      const msg: string = `해당 장문 리뷰를 성공적으로 삭제하였습니다. id = ${reviewId}`;

      jest
        .spyOn(repository, 'softDeleteLongReview')
        .mockReturnValue(Promise.resolve(reviewId));

      // when
      const result = await service.deleteLongReview(reviewId);

      // then
      expect(result).toEqual(msg);
    });
  });
});
