import { Role } from '@prisma/client';

export interface IMemerProfile {
  memberId: number;
  name: string;
  role: Role;
  imageUrl: string | null;
  point: number;
  createdAt: Date;
  updatedAt: Date;
}
