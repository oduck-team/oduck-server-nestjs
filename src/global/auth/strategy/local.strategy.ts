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

  async validate(email: string, password: string) {
    const member: IAuthPassword = {
      email,
      password,
    };

    return (await this.authService.validateMemberByPassword(member)) || null;
  }
}
