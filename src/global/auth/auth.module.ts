import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { NaverStrategy } from './strategy/naver.starategy';
import { MemberModule } from '../../domain/member/member.module';
import { AuthService } from './auth.service';
import { SessionSerializer } from './serializer';
import { KakaoStrategy } from './strategy/kakao.strategy';

@Module({
  imports: [MemberModule],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    NaverStrategy,
    KakaoStrategy,
    SessionSerializer,
    AuthService,
  ],
})
export class AuthModule {}
