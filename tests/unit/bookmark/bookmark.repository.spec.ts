import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkRepository } from '../../../src/domain/bookmark/bookmark.repository';
import { PrismaModule } from '../../../src/global/database/prisma/prisma.module';

describe('BookmarkRepository', () => {
  let repository: BookmarkRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [BookmarkRepository],
    }).compile();

    repository = module.get(BookmarkRepository);
  });

  describe('createBookmark', () => {
    it('북마크 생성 후 값 반환 X.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_ID = 1;

      jest
        .spyOn(repository, 'createBookmark')
        .mockReturnValue(Promise.resolve());

      // when
      const result = await repository.createBookmark(MOCK_MEMBERID, MOCK_ID);

      // then
      expect(result).toBeUndefined();
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
      const result = await repository.findBookmark(MOCK_MEMBERID, MOCK_ID);

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
      const result = await repository.findBookmark(MOCK_MEMBERID, MOCK_ID);

      // then
      expect(result).toBeDefined();
      expect(result).toEqual(MOCK_BOOKMARK);
    });
  });

  describe('findBookmarks', () => {
    it('북마크 조회 후 값 반환 X.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_QUERY = {};
      const MOCK_BOOKMARKS = [];

      jest
        .spyOn(repository, 'findBookmarks')
        .mockReturnValue(Promise.resolve(MOCK_BOOKMARKS));

      // when
      const result = await repository.findBookmarks(MOCK_MEMBERID, MOCK_QUERY);

      // then
      expect(result).toEqual(MOCK_BOOKMARKS);
    });

    it('북마크 조회 후 값 반환 O.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_QUERY = {};
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
            id: 1,
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
      const result = await repository.findBookmarks(MOCK_MEMBERID, MOCK_QUERY);

      // then
      expect(result).toBeDefined();
      expect(result).toEqual(MOCK_BOOKMARKS);
    });
  });

  describe('deleteBookmark', () => {
    it('북마크 제거 후 값 반환 X.', async () => {
      // given
      const MOCK_MEMBERID = 1;
      const MOCK_ID = 1;

      jest
        .spyOn(repository, 'deleteBookmark')
        .mockReturnValue(Promise.resolve());

      // when
      const result = await repository.deleteBookmark(MOCK_MEMBERID, MOCK_ID);

      // then
      expect(result).toBeUndefined();
    });
  });
});
