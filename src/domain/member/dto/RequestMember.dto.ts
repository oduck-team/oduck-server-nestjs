import { MemberProfile } from '@prisma/client';

export interface UpdateNameDto extends Pick<MemberProfile, 'name'> {
  /**
   * @minLength 2
   * @maxLength 10
   */
  name: string;
}
