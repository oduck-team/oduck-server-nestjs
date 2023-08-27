import { Test } from '@nestjs/testing';
import { LoginType, Role } from '@prisma/client';
import { MemberRepository } from '../../../src/domain/member/member.repository';
import { MemberService } from '../../../src/domain/member/member.service';
import { PrismaModule } from '../../../src/global/database/prisma/prisma.module';

describe('MemberService', () => {
  let service: MemberService;
  let repository: MemberRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [MemberService, MemberRepository],
    }).compile();

    service = module.get(MemberService);
    repository = module.get(MemberRepository);
  });

  describe('createMember', () => {
    it('회원가입 후, member를 반환.', async () => {
      // given
      const MOCK_DETAILS = {
        socialId: '123456789',
        email: 'hgd0101@gmail.com',
        type: 'google',
      };

      const MOCK_RESULT = {
        id: 1,
        loginType: LoginType.SOCIAL,
      };

      jest
        .spyOn(repository, 'createMember')
        .mockReturnValue(Promise.resolve(MOCK_RESULT));

      // when
      const member = await service.createMember('SOCIAL', MOCK_DETAILS);

      // then
      expect(member).toEqual(MOCK_RESULT);
    });
  });

  describe('signUp', () => {
    it('이름 등록 및 권한 변경 후 값 반환 X.', async () => {
      // given
      const MOCK_ID = 1;
      const MOCK_NAME = 'hgd';

      jest
        .spyOn(repository, 'findMemberProfileByName')
        .mockReturnValue(Promise.resolve(null));
      jest.spyOn(repository, 'signup').mockReturnValue(Promise.resolve());

      // when
      const result = await service.signup(MOCK_ID, MOCK_NAME);

      // then
      expect(result).toBeUndefined();
    });

    it('중복된 닉네임이 있을 경우 409 에러를 반환', async () => {
      // given
      const MOCK_ID = 1;
      const MOCK_NAME = 'hgd';

      jest
        .spyOn(repository, 'findMemberProfileByName')
        .mockReturnValue(Promise.resolve({} as any));
      jest.spyOn(repository, 'signup').mockReturnValue(Promise.resolve());

      // when
      try {
        await service.signup(MOCK_ID, MOCK_NAME);
      } catch (e) {
        // then
        expect(e.message).toEqual('already exist name');
      }
    });
  });

  describe('updateMember', () => {
    it('이름 변경 후 값 반환 X.', async () => {
      // given
      const MOCK_ID = 1;
      const MOCK_NAME = 'hgd';

      jest
        .spyOn(repository, 'findMemberProfileByName')
        .mockReturnValue(Promise.resolve(null));
      jest.spyOn(repository, 'updateName').mockReturnValue(Promise.resolve());

      // when
      const result = await service.updateName(MOCK_ID, MOCK_NAME);

      // then
      expect(result).toBeUndefined();
    });

    it('중복된 닉네임이 있을 경우 409 에러를 반환', async () => {
      // given
      const MOCK_ID = 1;
      const MOCK_NAME = 'hgd';

      jest
        .spyOn(repository, 'findMemberProfileByName')
        .mockReturnValue(Promise.resolve({} as any));
      jest.spyOn(repository, 'updateName').mockReturnValue(Promise.resolve());

      // when
      try {
        await service.updateName(MOCK_ID, MOCK_NAME);
      } catch (e) {
        // then
        expect(e.message).toEqual('already exist name');
      }
    });
  });

  describe('findMemberProfileByName', () => {
    it('닉네임으로 회원 정보를 찾을 경우 회원 정보를 반환.', async () => {
      // given
      const MOCK_NAME = 'hgd';
      const MOCK_RESULT = {
        memberId: 1,
        name: 'hgd',
        role: Role.MEMBER,
        imageUrl: null,
        point: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(repository, 'findMemberProfileByName')
        .mockReturnValue(Promise.resolve(MOCK_RESULT));

      // when
      const member = await service.findMemberProfileByName(MOCK_NAME);

      // then
      expect(member).toEqual(MOCK_RESULT);
    });

    it('이름으로 회원을 못 찾을 경우 404 에러를 반환.', async () => {
      // given
      const MOCK_NAME = 'hgd';

      jest
        .spyOn(repository, 'findMemberProfileByName')
        .mockReturnValue(Promise.resolve(null));

      // when
      try {
        await service.findMemberProfileByName(MOCK_NAME);
      } catch (e) {
        // then
        expect(e.message).toEqual('Member not found');
      }
    });
  });

  describe('existsMemberProfileByName', () => {
    it('닉네임으로 회원을 찾을 경우 409 에러를 반환.', async () => {
      // given
      const MOCK_NAME = 'hgd';

      jest
        .spyOn(repository, 'findMemberProfileByName')
        .mockReturnValue(Promise.resolve({} as any));

      // when
      try {
        await service.existsMemberProfileByName(MOCK_NAME);
      } catch (e) {
        // then
        expect(e.message).toEqual('already exist name');
      }
    });

    it('닉네임으로 회원을 못 찾을 경우 값 반환 X.', async () => {
      // given
      const MOCK_NAME = 'hgd';

      jest
        .spyOn(repository, 'findMemberProfileByName')
        .mockReturnValue(Promise.resolve(null));

      // when
      const result = await service.existsMemberProfileByName(MOCK_NAME);

      // then
      expect(result).toBeUndefined();
    });
  });

  describe('findMemberById', () => {
    it('id로 member를 찾을 경우 member를 반환.', async () => {
      // given
      const MOCK_ID = 1;
      const MOCK_RESULT = {
        id: 1,
        loginType: LoginType.SOCIAL,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(repository, 'findMemberById')
        .mockReturnValue(Promise.resolve(MOCK_RESULT));

      // when
      const member = await service.findMemberById(MOCK_ID);

      // then
      expect(member).toEqual(MOCK_RESULT);
    });
  });

  describe('findAuthSocialBySocialId', () => {
    it('socialId로 AuthSocial를 찾을 경우 AuthSocial 반환.', async () => {
      // given
      const MOCK_SOCIAL_ID = '1234';
      const MOCK_RESULT = {
        id: 1,
        memberId: 1,
        socialId: '12346789',
        email: 'hgd0101@gmail.com',
        type: 'google',
      };

      jest
        .spyOn(repository, 'findAuthSocialBySocialId')
        .mockReturnValue(Promise.resolve(MOCK_RESULT));

      // when
      const authSocial = await service.findAuthSocialBySocialId(MOCK_SOCIAL_ID);

      // then
      expect(authSocial).toEqual(MOCK_RESULT);
    });
  });
});
