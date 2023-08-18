import { TypedRoute } from '@nestia/core';
import { Controller, Req, Res, UseGuards } from '@nestjs/common';
import { MemberProfile } from '@prisma/client';
import { User } from '../common/decoratror/user.decorator';
import { GoogleAuthGuard } from './guard/google.auth.guard';
import { NaverAuthGuard } from './guard/naver.auth.guard';
import { KakaoAuthGuard } from './guard/kakao.auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @TypedRoute.Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin(): void {}

  @TypedRoute.Get('naver/login')
  @UseGuards(NaverAuthGuard)
  handleNaverLogin(): void {}

  @TypedRoute.Get('kakao/login')
  @UseGuards(KakaoAuthGuard)
  handleKakaoLogin(): void {}

  @TypedRoute.Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  handleGoogleCallback(): void {}

  @TypedRoute.Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  handleNaverCallback(): void {}

  @TypedRoute.Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  handleKakaoCallback(): void {}

  @TypedRoute.Delete('logout')
  handleLogout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        throw err;
      }
      res.redirect('/');
    });
  }

  @TypedRoute.Get('status')
  member(
    @User() user: MemberProfile,
  ): Omit<MemberProfile, 'id'> | { msg: string } {
    if (user) {
      return user;
    } else {
      return { msg: '로그인 상태가 아닙니다.' };
    }
  }
}
