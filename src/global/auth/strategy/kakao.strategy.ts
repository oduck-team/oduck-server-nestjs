import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['account_email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const member = {
      accessToken,
      refreshToken,
      socialInfo: {
        type: profile.provider,
        email: profile._json.kakao_account.email,
        socialId: profile.id.toString(),
      },
    };

    return (await this.authService.validateMember(member.socialInfo)) || null;
  }
}
