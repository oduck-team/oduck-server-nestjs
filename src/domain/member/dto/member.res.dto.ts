import { Role } from '@prisma/client';
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

export interface MemberProfileDto {
  memberId: number;
  name: string;
  info: string | null;
  role: Role;
  imageUrl: string | null;
  point: number;
  createdAt: Date;
  updatedAt: Date;
}
