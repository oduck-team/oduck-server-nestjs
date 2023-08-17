import { TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { MemberProfile } from '@prisma/client';
import { User } from '../common/decoratror/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { KakaoAuthGuard } from './guards/kakao.auth.guard';

@Controller('auth')
export class AuthController {
  @TypedRoute.Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin(): void {}

  @TypedRoute.Get('naver/login')
  @UseGuards(AuthGuard('naver'))
  handleNaverLogin(): void {}

  @TypedRoute.Get('kakao/login')
  @UseGuards(KakaoAuthGuard)
  handleKakaoLogin(): void {}

  @TypedRoute.Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  handleGoogleCallback(): void {}

  @TypedRoute.Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  handleNaverCallback(): void {}

  @TypedRoute.Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  handleKakaoCallback(): void {}

  @TypedRoute.Get('status')
  member(
    @User() user: MemberProfile,
  ): Omit<MemberProfile, 'id'> | { msg: string } {
    if (user) {
      console.log(user);

      return user;
    } else {
      return { msg: '로그인 상태가 아닙니다.' };
    }
  }
}
