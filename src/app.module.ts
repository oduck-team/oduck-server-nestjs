import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './global/auth/auth.module';
import { MemberModule } from './domain/member/member.module';
import { PassportModule } from '@nestjs/passport';
import { AnimationModule } from './domain/animation/animation.module';
import { StudioModule } from './domain/studio/studio.module';
import { ReviewsModule } from './domain/review/reviews.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaModule } from './global/database/prisma/prisma.module';
import { HttpExceptionFilter } from './global/common/filter/http-exception.filter';
import { PrismaExceptionFilter } from './global/common/filter/prisma-exception.filter';
import { BookmarkModule } from './domain/bookmark/bookmark.module';

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
    PassportModule.register({ session: true }),
    AuthModule,
    MemberModule,
    AnimationModule,
    StudioModule,
    ReviewsModule,
    BookmarkModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
  ],
})
export class AppModule {}
