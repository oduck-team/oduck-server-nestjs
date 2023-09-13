import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkRepository } from '../../../src/domain/bookmark/bookmark.repository';
import { PrismaModule } from '../../../src/global/database/prisma/prisma.module';
import { BookmarkService } from '../../../src/domain/bookmark/bookmark.service';

describe('BookmarkService', () => {
  let service: BookmarkService;
  let repository: BookmarkRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [BookmarkService, BookmarkRepository],
    }).compile();

    repository = module.get(BookmarkRepository);
    service = module.get(BookmarkService);
  });

  describe('createBookmark', () => {
    it('북마크 생성 후 값 반환 X.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_ID = 1;

      jest
        .spyOn(repository, 'findBookmark')
        .mockReturnValue(Promise.resolve(null));

      jest
        .spyOn(repository, 'createBookmark')
        .mockReturnValue(Promise.resolve());

      // when
      const result = await service.createBookmark(MOCK_MEMBERID, MOCK_ID);

      // then
      expect(result).toBeUndefined();
    });

    it('이미 북마크 했을 경우 예외 발생.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_ID = 1;

      jest
        .spyOn(repository, 'findBookmark')
        .mockReturnValue(Promise.resolve({} as any));

      // when
      const result = service.createBookmark(MOCK_MEMBERID, MOCK_ID);

      // then
      await expect(result).rejects.toThrowError('Already bookmarked');
    });
  });

  describe('findBookmark', () => {
    it('북마크 조회 후 값 반환 X.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_ID = 1;

      jest
        .spyOn(repository, 'findBookmark')
        .mockReturnValue(Promise.resolve(null));

      // when
      const result = await service.findBookmark(MOCK_MEMBERID, MOCK_ID);

      // then
      expect(result).toBeNull();
    });

    it('북마크 조회 후 값 반환 O.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_ID = 1;

      const MOCK_BOOKMARK = {
        id: 1,
        memberId: 1,
        animationId: 1,
        createdAt: new Date(),
      };

      jest
        .spyOn(repository, 'findBookmark')
        .mockReturnValue(Promise.resolve(MOCK_BOOKMARK));

      // when
      const result = await service.findBookmark(MOCK_MEMBERID, MOCK_ID);

      // then
      expect(result).toEqual(MOCK_BOOKMARK);
    });
  });

  describe('findBookmarks', () => {
    it('북마크 조회 후 값 반환 O.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_QUERY = { lastId: 1, size: 1 };

      const MOCK_BOOKMARKS = [
        {
          id: 1,
          memberId: 1,
          animation: {
            id: 1,
            name: 'name',
            imageUrl: 'thumbnail',
          },
          createdAt: new Date(),
        },
        {
          id: 2,
          memberId: 1,
          animation: {
            id: 2,
            name: 'name',
            imageUrl: 'thumbnail',
          },
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(repository, 'findBookmarks')
        .mockReturnValue(Promise.resolve(MOCK_BOOKMARKS));

      // when
      const result = await service.findBookmarks(MOCK_MEMBERID, MOCK_QUERY);

      // then
      expect(result).toEqual(MOCK_BOOKMARKS);
    });

    it('북마크 조회 후 값 반환 X.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_QUERY = {};

      const MOCK_BOOKMARKS = [];

      jest
        .spyOn(repository, 'findBookmarks')
        .mockReturnValue(Promise.resolve(MOCK_BOOKMARKS));

      // when
      const result = await service.findBookmarks(MOCK_MEMBERID, MOCK_QUERY);

      // then
      expect(result).toEqual(MOCK_BOOKMARKS);
    });
  });

  describe('deleteBookmark', () => {
    it('북마크 삭제 후 값 반환 X.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_ID = 1;

      jest
        .spyOn(repository, 'findBookmark')
        .mockReturnValue(Promise.resolve({} as any));

      jest
        .spyOn(repository, 'deleteBookmark')
        .mockReturnValue(Promise.resolve());

      // when
      const result = await service.deleteBookmark(MOCK_MEMBERID, MOCK_ID);

      // then
      expect(result).toBeUndefined();
    });

    it('북마크가 없을 시 예외 반환.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_ID = 1;

      jest
        .spyOn(repository, 'findBookmark')
        .mockReturnValue(Promise.resolve(null));

      // when
      const result = service.deleteBookmark(MOCK_MEMBERID, MOCK_ID);

      // then
      await expect(result).rejects.toThrowError('Not bookmarked');
    });
  });
});
