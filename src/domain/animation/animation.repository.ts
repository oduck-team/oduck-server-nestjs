import { Injectable } from '@nestjs/common';
import {Prisma, Animation} from "@prisma/client";
import {PrismaService} from "src/global/database/prisma/prisma.service";

@Injectable()
export class AnimationRepository {
    constructor(private prisma: PrismaService) {}

    async getAnimations(params: {
        skip?: number;
        take?: number;
        // cursor?: Prisma.AnimationWhereUniqueInput;
        where?: Prisma.AnimationWhereInput;
        orderBy?: Prisma.AnimationOrderByWithRelationInput;
    }): Promise<Animation[]> {
        const { skip, take, where, orderBy } = params;
        return this.prisma.animation.findMany({ skip, take, where, orderBy });
    }
}