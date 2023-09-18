import { Strategy } from 'passport-naver';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const member = {
      accessToken,
      refreshToken,
      socialInfo: {
        email: profile.emails[0].value,
        socialId: profile.id,
        type: profile.provider,
      },
    };

    return (await this.authService.validateMember(member.socialInfo)) || null;
  }
}
