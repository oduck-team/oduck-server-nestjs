import { Injectable } from '@nestjs/common';
import {AnimationRepository} from "./animation.repository";
import {Animation} from "@prisma/client";

@Injectable()
export class AnimationService {
    constructor(private repository: AnimationRepository) {}

    async getAnimations(): Promise<Animation[]> {
        return await this.repository.getAnimations({});
    }
}
