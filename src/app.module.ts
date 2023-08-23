import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './domain/user/users.module';
import { AnimationModule } from './domain/animation/animation.module';
import { StudioModule } from './domain/studio/studio.module';
import { PrismaModule } from './global/database/prisma/prisma.module';
import { ReviewsModule } from './domain/review/reviews.module';

@Module({
  imports: [
    // 환경 변수 모듈
    ConfigModule.forRoot({
      // 글로벌 적용
      isGlobal: true,
      // 환경에 따른 환경 변수 적용
      envFilePath:
        process.env.NODE_ENV === 'prod'
          ? '.env.prod'
          : process.env.NODE_ENV === 'dev'
          ? '.env.dev'
          : '.env.local',
    }),
    PrismaModule,
    UsersModule,
    AnimationModule,
    StudioModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
