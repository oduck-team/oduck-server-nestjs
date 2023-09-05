import { AuthSocial, MemberProfile, Role } from '@prisma/client';

export interface IMemerProfile extends Omit<MemberProfile, 'id'> {
  memberId: number;
  name: string;
  info: string | null;
  role: Role;
  imageUrl: string | null;
  point: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthSocial extends Omit<AuthSocial, 'id' | 'memberId'> {
  email: string;
  socialId: string;
  type: string;
}

export interface IMemberProfileWithCount extends Omit<MemberProfile, 'id'> {
  reviews: number;
  reviewLikes: number;
}
