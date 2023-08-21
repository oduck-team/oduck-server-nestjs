import { MemberProfile } from '@prisma/client';

export interface MemberProfileDto extends Omit<MemberProfile, 'id'> {
  /**
   *
   * @nullable
   * @session
   *
   **/
  isMine?: boolean;
}
