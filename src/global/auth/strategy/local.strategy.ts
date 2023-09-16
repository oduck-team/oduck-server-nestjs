import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { IAuthPassword } from 'src/domain/member/interface/member.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'loginId', passwordField: 'password' });
  }

  async validate(loginId: string, password: string) {
    const member: IAuthPassword = {
      loginId,
      password,
    };

    return (await this.authService.validateMemberByPassword(member)) || null;
  }
}
