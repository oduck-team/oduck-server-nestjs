import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { NaverStrategy } from './strategy/naver.starategy';
import { UsersModule } from '../../domain/member/members.module';
import { AuthService } from './auth.service';
import { SessionSerializer } from './serializer';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [GoogleStrategy, NaverStrategy, SessionSerializer, AuthService],
})
export class AuthModule {}
