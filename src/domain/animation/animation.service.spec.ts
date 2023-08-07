import { Test, TestingModule } from '@nestjs/testing';
import { AnimationService } from './animation.service';
import { AnimationRepository } from "./animation.repository";
import {PrismaService} from "../../global/database/prisma/prisma.service";

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
      jest.spyOn(repository, 'getAnimations').mockResolvedValue([
        {
          "id": 1,
          "name": "바키",
          "plot": "",
          "broadcastType": "TVA",
          "episodeNumber": 1,
          "rating": "ADULT",
          "primaryKeyword": "",
          "status": "FINISHED",
          "isReleased": false,
          "viewCount": 0,
          "reviewCount": 0,
          "createdAt": new Date(),
          "updatedAt": new Date(),
          "deletedAt": null
        },
      ]);

      const result = await (async () => await service.getAnimations({}))();

      expect(result[0].name).toContain('바키')
    })
  })

  describe('getAnimation by id', () => {
    it('should return an animation', async () => {
      jest.spyOn(repository, 'getAnimationById').mockResolvedValue(
        {
          "id": 1,
          "name": "바키",
          "plot": "",
          "broadcastType": "TVA",
          "episodeNumber": 1,
          "rating": "ADULT",
          "primaryKeyword": "",
          "status": "FINISHED",
          "isReleased": false,
          "viewCount": 0,
          "reviewCount": 0,
          "createdAt": new Date(),
          "updatedAt": new Date(),
          "deletedAt": null
        },
      );

      const result = await (async () => await service.getAnimationById(1))();

      expect(result.name).toContain('바키')
    })
  })
});
