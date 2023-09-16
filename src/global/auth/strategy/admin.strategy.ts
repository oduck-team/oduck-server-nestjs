import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { IAuthPassword } from 'src/domain/member/interface/member.interface';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'local-admin') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'loginId', passwordField: 'password' });
  }

  async validate(loginId: string, password: string) {
    const member: IAuthPassword = {
      loginId,
      password,
    };

    return (await this.authService.validateAdminByPassword(member)) || null;
  }
}
