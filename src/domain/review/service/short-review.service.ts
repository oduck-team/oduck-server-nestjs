import { Injectable } from '@nestjs/common';
import {
  CreateShortReviewDto,
  ReviewPageQueryDto,
} from '../dto/review-request.dto';
import { ShortReviewResponseDto } from '../dto/review-response.dto';
import { ShortReviewRepository } from '../reviews.repository';

@Injectable()
export class ShortReviewService {
  constructor(private readonly shortReviewRepository: ShortReviewRepository) {}

  // TODO: 좋아요 순 정렬 방식 추가
  // TODO: 작성자의 이름, 닉네임, 프로필 사진 추가
  async findShortReviewPageByQuery(
    query: ReviewPageQueryDto,
  ): Promise<ShortReviewResponseDto[]> {
    const { memberId, animationId, lastId, pageSize, sortKey, sortDir } = query;
    const shortReviews = await this.shortReviewRepository.selectShortReviewPage(
      memberId,
      animationId,
      lastId,
      pageSize,
      sortKey,
      sortDir,
    );

    const shortReviewDtoList: ShortReviewResponseDto[] = [];
    shortReviews.forEach((shortReview) => {
      const shortReviewResponseDto = new ShortReviewResponseDto(shortReview);
      shortReviewDtoList.push(shortReviewResponseDto);
    });

    return shortReviewDtoList;
  }

  // TODO: 한 사람이 같은 애니메이션에 중복으로 작성 가능한지?
  async createShortReview(
    memberId: number,
    animationId: number,
    dto: CreateShortReviewDto,
  ): Promise<number> {
    const { rating, comment, hasSpoiler, attractionPoints } = dto;
    const shortReview = await this.shortReviewRepository.insertShortReview(
      memberId,
      animationId,
      rating,
      comment,
      hasSpoiler,
      attractionPoints,
    );

    return shortReview.id;
  }

  // TODO: 한줄 리뷰 수정 가능한지?
  async updateShortReview(): Promise<any> {}

  async deleteShortReview(id: number): Promise<string> {
    const deletedShortReview =
      await this.shortReviewRepository.softDeleteShortReview(id);
    return `해당 한줄 리뷰를 성공적으로 삭제하였습니다. id = ${deletedShortReview.id}`;
  }
}
