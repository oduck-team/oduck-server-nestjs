import { Test, TestingModule } from '@nestjs/testing';
import { LoginType, Role } from '@prisma/client';
import { MemberRepository } from '../../../src/domain/member/member.repository';
import { PrismaModule } from '../../../src/global/database/prisma/prisma.module';

describe('MemberRepository', () => {
  let repository: MemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [MemberRepository],
    }).compile();

    repository = module.get(MemberRepository);
  });

  describe('createMember', () => {
    it('회원 가입 후 member가 반환 됨.', async () => {
      // given
      const MOCK_LOGINTYPE = LoginType.SOCIAL;
      const MOCK_DETEAILS = {
        socialId: '123456789',
        email: 'hgd0101@gmail.com',
        type: 'google',
      };

      const MOCK_MEMBER = {
        id: 1,
        loginType: LoginType.SOCIAL,
      };

      jest
        .spyOn(repository, 'createMember')
        .mockReturnValue(Promise.resolve(MOCK_MEMBER));

      // when
      const result = await repository.createMember(
        MOCK_LOGINTYPE,
        MOCK_DETEAILS,
      );

      // then
      expect(result).toEqual(MOCK_MEMBER);
    });
  });

  describe('singUp', () => {
    it('이름 변경 및 권한 변경 후 값 반환 X.', async () => {
      // given
      const MOCK_ID = 1;
      const MOCK_NAME = 'hgd';

      jest.spyOn(repository, 'signup').mockReturnValue(Promise.resolve());

      // when
      const result = await repository.signup(MOCK_ID, MOCK_NAME);

      // then
      expect(result).toBeUndefined();
    });
  });

  describe('findMemberById', () => {
    it('id로 member를 찾아 반환.', async () => {
      // given
      const MOCK_ID = 1;

      const MOCK_MEMBER = {
        id: 1,
        loginType: LoginType.SOCIAL,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(repository, 'findMemberById')
        .mockReturnValue(Promise.resolve(MOCK_MEMBER));

      // when
      const result = await repository.findMemberById(MOCK_ID);

      // then
      expect(result).toEqual(MOCK_MEMBER);
    });

    it('id로 member를 못 찾을 경우 null 반환.', async () => {
      // given
      const MOCK_ID = 1;

      jest
        .spyOn(repository, 'findMemberById')
        .mockReturnValue(Promise.resolve(null));

      // when
      const result = await repository.findMemberById(MOCK_ID);

      // then
      expect(result).toBeNull();
    });
  });

  describe('findAuthSocialBySocialId', () => {
    it('socialId로 authSocial을 찾아 반환.', async () => {
      // given
      const MOCK_SOCIALID = '123456789';

      const MOCK_AUTHSOCIAL = {
        id: 1,
        memberId: 1,
        socialId: '123456789',
        email: 'hgd0101@gmail.com',
        type: 'google',
      };

      jest
        .spyOn(repository, 'findAuthSocialBySocialId')
        .mockReturnValue(Promise.resolve(MOCK_AUTHSOCIAL));

      // when
      const result = await repository.findAuthSocialBySocialId(MOCK_SOCIALID);

      // then
      expect(result).toEqual(MOCK_AUTHSOCIAL);
    });

    it('socialId로 authSocial을 못 찾을 경우 null 반환.', async () => {
      // given
      const MOCK_SOCIALID = '123456789';

      jest
        .spyOn(repository, 'findAuthSocialBySocialId')
        .mockReturnValue(Promise.resolve(null));

      // when
      const result = await repository.findAuthSocialBySocialId(MOCK_SOCIALID);

      // then
      expect(result).toBeNull();
    });
  });

  describe('findMemberProfile', () => {
    it('memberId로 memberProfile을 찾아 반환.', async () => {
      // given
      const MOCK_MEMBERID = 1;

      const MOCK_MEMBER_PROFILE = {
        memberId: 1,
        name: 'hgd',
        role: Role.MEMBER,
        point: 0,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findMemberProfile')
        .mockReturnValue(Promise.resolve(MOCK_MEMBER_PROFILE));

      // when
      const result = await repository.findMemberProfile(MOCK_MEMBERID);

      // then
      expect(result).toEqual(MOCK_MEMBER_PROFILE);
    });

    it('memberId로 memberProfile을 못 찾을 경우 null 반환.', async () => {
      // given
      const MOCK_MEMBERID = 1;

      jest
        .spyOn(repository, 'findMemberProfile')
        .mockReturnValue(Promise.resolve(null));

      // when
      const result = await repository.findMemberProfile(MOCK_MEMBERID);

      // then
      expect(result).toBeNull();
    });
  });

  describe('findMemberProfileByName', () => {
    it('name으로 memberProfile을 찾아 반환.', async () => {
      // given
      const MOCK_NAME = 'hgd';

      const MOCK_MEMBER_PROFILE = {
        memberId: 1,
        name: 'hgd',
        role: Role.MEMBER,
        point: 0,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findMemberProfileByName')
        .mockReturnValue(Promise.resolve(MOCK_MEMBER_PROFILE));

      // when
      const result = await repository.findMemberProfileByName(MOCK_NAME);

      // then
      expect(result).toEqual(MOCK_MEMBER_PROFILE);
    });

    it('name으로 memberProfile을 못 찾을 경우 null 반환.', async () => {
      // given
      const MOCK_NAME = 'hgd';

      jest
        .spyOn(repository, 'findMemberProfileByName')
        .mockReturnValue(Promise.resolve(null));

      // when
      const result = await repository.findMemberProfileByName(MOCK_NAME);

      // then
      expect(result).toBeNull();
    });
  });

  describe('updateName', () => {
    it('이름 변경 후 값 반환 X.', async () => {
      // given
      const MOCK_ID = 1;
      const MOCK_NAME = 'hgd';

      jest.spyOn(repository, 'updateName').mockReturnValue(Promise.resolve());

      // when
      const result = await repository.updateName(MOCK_ID, MOCK_NAME);

      // then
      expect(result).toBeUndefined();
    });
  });
});
