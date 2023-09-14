import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { NaverStrategy } from './strategy/naver.starategy';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { MemberModule } from '../../domain/member/member.module';
import { SessionSerializer } from './serializer';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [MemberModule],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    NaverStrategy,
    KakaoStrategy,
    LocalStrategy,
    SessionSerializer,
    AuthService,
  ],
})
export class AuthModule {}
