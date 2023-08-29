import { TypedRoute } from '@nestia/core';
import {
  Controller,
  InternalServerErrorException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MemberProfile, Role } from '@prisma/client';
import { User } from '../common/decoratror/user.decorator';
import { GoogleAuthGuard } from './guard/google.auth.guard';
import { NaverAuthGuard } from './guard/naver.auth.guard';
import { KakaoAuthGuard } from './guard/kakao.auth.guard';
import { Request, Response } from 'express';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from '../common/decoratror/roles.decorator';

@Controller('auth')
export class AuthController {
  /**
   * @tag Auth
   */
  @TypedRoute.Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin(): void {}

  /**
   * @tag Auth
   */
  @TypedRoute.Get('naver/login')
  @UseGuards(NaverAuthGuard)
  handleNaverLogin(): void {}

  /**
   * @tag Auth
   */
  @TypedRoute.Get('kakao/login')
  @UseGuards(KakaoAuthGuard)
  handleKakaoLogin(): void {}

  /**
   * @tag Auth
   */
  @TypedRoute.Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  handleGoogleCallback(@Res() res: Response) {
    res.status(302).redirect(process.env.CLIENT_URL!);
  }

  /**
   * @tag Auth
   */
  @TypedRoute.Get('kakao/callback')
  @UseGuards(GoogleAuthGuard)
  handleKakaoCallback(@Res() res: Response) {
    res.status(302).redirect(process.env.CLIENT_URL!);
  }

  /**
   * @tag Auth
   */
  @TypedRoute.Get('naver/callback')
  @UseGuards(GoogleAuthGuard)
  handleNaverCallback(@Res() res: Response) {
    res.status(302).redirect(process.env.CLIENT_URL!);
  }

  /**
   * @tag Auth
   */
  @TypedRoute.Delete('logout')
  @UseGuards(RolesGuard)
  @Roles(Role.MEMBER, Role.ADMIN)
  handleLogout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        throw new InternalServerErrorException('Failed to logout');
      }

      res.status(302).redirect('http://localhost:5173/');
    });
  }

  /**
   * @tag Auth
   */
  @TypedRoute.Get('status')
  @UseGuards(RolesGuard)
  @Roles(Role.GUEST, Role.MEMBER, Role.ADMIN)
  handleStatus(@User() user: MemberProfile): Omit<MemberProfile, 'id'> {
    return user;
  }
}
