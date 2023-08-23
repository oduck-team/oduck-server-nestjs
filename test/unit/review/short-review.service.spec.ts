import { AttractionElement } from '@prisma/client';
import { ShortReviewService } from '../../../src/domain/review/service/short-review.service';
import { ShortReviewRepository } from '../../../src/domain/review/repository/short-review.repository';
import { Test } from '@nestjs/testing';
import { PrismaModule } from '../../../src/global/config/prisma/prisma.module';
import { IShortReview } from '../../../src/domain/review/reviews.interface';
import {
  CreateShortReviewDto,
  ReviewPageQueryDto,
  UpdateShortReviewDto,
} from '../../../src/domain/review/dto/review-request.dto';
import { ShortReviewResponseDto } from '../../../src/domain/review/dto/review-response.dto';
import { BadRequestException } from '@nestjs/common';

describe('ShortReviewService', () => {
  let service: ShortReviewService;
  let repository: ShortReviewRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ShortReviewRepository, ShortReviewService],
    }).compile();

    service = module.get(ShortReviewService);
    repository = module.get(ShortReviewRepository);
  });

  describe('findShortReviewPageByQuery', () => {
    it('한줄 리뷰 커서 페이징 조회', async () => {
      // given
      const MOCK_RESULT: IShortReview = {
        id: 1,
        memberId: 123,
        animationId: 456,
        rating: 5,
        createdAt: new Date(),
        shortReview: {
          comment: 'This is test',
          hasSpoiler: true,
        },
      };

      const query: ReviewPageQueryDto = {
        memberId: 123,
        pageSize: 10,
        sortCondition: 'createdAt|desc',
      };

      jest
        .spyOn(service, 'findShortReviewPageByQuery')
        .mockReturnValue(
          Promise.resolve([new ShortReviewResponseDto(MOCK_RESULT)]),
        );

      // when
      const result = await service.findShortReviewPageByQuery(query);

      // then
      expect(result.length).toEqual(1);
      expect(result[0].memberId).toEqual(123);
      expect(result[0].animationId).toEqual(456);
      expect(result[0].comment).toEqual('This is test');
    });

    it('한줄 리뷰 페이징 조회 시 memberId, animationId 검증', async () => {
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
        async () => await service.findShortReviewPageByQuery(query1),
      ).rejects.toThrowError(
        new BadRequestException(
          `두 인자 중 하나만 입력 가능합니다. memberId: ${query1.memberId}, animationId: ${query1.animationId}`,
        ),
      );

      await expect(
        async () => await service.findShortReviewPageByQuery(query2),
      ).rejects.toThrowError(
        new BadRequestException(
          `두 인자 중 하나만 입력 가능합니다. memberId: ${query2.memberId}, animationId: ${query2.animationId}`,
        ),
      );
    });
  });

  describe('createShortReview', () => {
    const memberId: number = 123;
    const reviewId: number = 456;
    const dto: CreateShortReviewDto = {
      rating: 5,
      comment: 'This is test',
      hasSpoiler: false,
      attractionPoints: [AttractionElement.ACTION],
    };

    it('한줄 리뷰 작성', async () => {
      // given
      jest
        .spyOn(service, 'createShortReview')
        .mockReturnValue(Promise.resolve(reviewId));

      // when
      const result = await service.createShortReview(memberId, reviewId, dto);

      // then
      expect(result).toEqual(reviewId);
    });

    it('한줄 리뷰 작성 시 중복 처리', async () => {
      // given
      jest
        .spyOn(repository, 'isShortReviewExist')
        .mockReturnValue(Promise.resolve(true));

      // then
      await expect(
        async () => await service.createShortReview(memberId, reviewId, dto),
      ).rejects.toThrowError(
        new BadRequestException(
          `해당 애니메이션에 이미 작성한 한줄 리뷰가 존재합니다.`,
        ),
      );
    });
  });

  describe('updateShortReview', () => {
    it('한줄 리뷰 수정', async () => {
      // given
      const reviewId: number = 1;
      const dto: UpdateShortReviewDto = {
        rating: 5,
        comment: 'This is test',
        hasSpoiler: false,
      };

      jest
        .spyOn(service, 'updateShortReview')
        .mockReturnValue(Promise.resolve(reviewId));

      // when
      const result = await service.updateShortReview(reviewId, dto);

      // then
      expect(result).toEqual(reviewId);
    });
  });

  describe('deleteShortReview', () => {
    it('한줄 리뷰 삭제', async () => {
      // given
      const reviewId: number = 456;
      const msg: string = `해당 한줄 리뷰를 성공적으로 삭제하였습니다. id = ${reviewId}`;

      jest
        .spyOn(service, 'deleteShortReview')
        .mockReturnValue(Promise.resolve(msg));

      // when
      const result = await service.deleteShortReview(reviewId);

      // then
      expect(result).toEqual(msg);
    });
  });
});
