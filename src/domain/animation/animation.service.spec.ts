import { Test, TestingModule } from '@nestjs/testing';
import { AnimationService } from './animation.service';
import { AnimationRepository } from './animation.repository';
import { PrismaService } from '../../global/database/prisma/prisma.service';
import { Animation, BroadcastType, Rating, Status } from '@prisma/client';

const MOCK_RESULT: Animation = {
  id: 1,
  name: '바키',
  plot: '',
  broadcastType: BroadcastType.MOV,
  episodeNumber: 1,
  rating: Rating.ADULT,
  primaryKeyword: '',
  status: Status.FINISHED,
  isReleased: false,
  viewCount: 0,
  reviewCount: 0,
  imageUrl: 'src/baki.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('AnimationService', () => {
  let service: AnimationService;
  let repository: AnimationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, AnimationService, AnimationRepository],
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

      const result = await (async () => await service.getList({}))();

      expect(result[0].name).toContain('바키');
    });
  });

  describe('getAnimation by id', () => {
    it('should return an animation', async () => {
      jest.spyOn(repository, 'getAnimationById').mockResolvedValue(MOCK_RESULT);

      const result = await (async () => await service.getOneById(1))();

      expect(result.name).toContain('바키');
    });
  });
});
