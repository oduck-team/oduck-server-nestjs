import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Member } from '@prisma/client';
import { AuthService } from './auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }
  serializeUser(member: Member, done: Function) {
    done(null, member);
  }

  async deserializeUser(payload: any, done: Function) {
    const memberProfile = await this.authService.findMemberProfile(payload.id);

    return memberProfile ? done(null, memberProfile) : done(null, null);
  }
}
