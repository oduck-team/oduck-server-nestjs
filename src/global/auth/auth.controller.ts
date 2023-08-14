import { TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './googleGuard';
import { MemberProfile } from '@prisma/client';
import { User } from '../common/decoratror/user.decorator';

@Controller('auth')
export class AuthController {
  @TypedRoute.Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin(): void {}

  @TypedRoute.Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  handleGoogleCallback(): void {}

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
