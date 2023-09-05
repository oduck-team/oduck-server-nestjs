import { IMemberProfileWithCount } from '../interface/member.interface';

export interface MemberProfileDtoWithCount extends IMemberProfileWithCount {
  /**
   *
   * @nullable
   * @session
   *
   **/
  isMine?: boolean;
}
