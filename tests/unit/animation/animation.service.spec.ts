import { Test, TestingModule } from '@nestjs/testing';
import { AnimationService } from '../../../src/domain/animation/animation.service';
import { AnimationRepository } from '../../../src/domain/animation/animation.repository';
import { BroadcastType, GenreType, Rating, Status } from '@prisma/client';
import { Role } from '.prisma/client';
import { PrismaModule } from '../../../src/global/database/prisma/prisma.module';

const MOCK_RESULT = {
  id: 1,
  name: '바키',
  plot: '',
  broadcastType: BroadcastType.MOV,
  episodeNumber: 1,
  rating: Rating.ADULT,
  primaryKeyword: '',
  status: Status.FINISHED,
  viewCount: 0,
  reviewCount: 0,
  isReleased: false,
  imageUrl: 'src/baki.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  studios: [
    {
      studio: {
        id: 1,
        name: '지브리스튱디오',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ],
  seasons: [
    {
      id: 1,
      createdAt: new Date(),
      animationId: 1,
      year: 2023,
      quarter: 1,
    },
  ],
  genres: [
    {
      genre: {
        id: 1,
        createdAt: new Date(),
        type: GenreType.FANTASY,
      },
    },
  ],
  voiceActors: [
    {
      voiceActor: {
        id: 1,
        name: '누구누구',
        createdAt: new Date(),
      },
    },
  ],
  originalWorkers: [
    {
      originalWorker: {
        id: 1,
        name: '데즈카 오사무',
        createdAt: new Date(),
      },
    },
  ],
};

const MockUser = {
  id: 1,
  memberId: 1,
  name: 'asd',
  info: null,
  role: Role.ADMIN,
  imageUrl: null,
  point: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AnimationService', () => {
  let service: AnimationService;
  let repository: AnimationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AnimationService, AnimationRepository],
    }).compile();

    repository = module.get<AnimationRepository>(AnimationRepository);
    service = module.get<AnimationService>(AnimationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAnimations', () => {
    it('should return all animations', async () => {
      jest.spyOn(repository, 'getAnimations').mockResolvedValue([MOCK_RESULT]);

      const result = await (async () => await service.getList(MockUser, {}))();

      expect(result[0].name).toContain('바키');
    });
  });

  describe('getAnimation by id', () => {
    it('should return an animation', async () => {
      jest.spyOn(repository, 'getAnimationById').mockResolvedValue(MOCK_RESULT);

      const result = await (async () =>
        await service.getOneById(MockUser, 1))();

      expect(result.name).toContain('바키');
    });
  });
});
