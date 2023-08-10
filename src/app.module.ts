import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './global/auth/auth.module';
import { UsersModule } from './domain/member/members.module';
import { PassportModule } from '@nestjs/passport';

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
    AuthModule,
    PassportModule.register({ session: true }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
