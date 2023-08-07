import { Injectable } from '@nestjs/common';
import {AnimationRepository} from "./animation.repository";
import {Animation} from "@prisma/client";
import {IAnimation} from "./model/animation.list.dto";

@Injectable()
export class AnimationService {
    constructor(private repository: AnimationRepository) {}

    async getAnimations(query: IAnimation.IList): Promise<Animation[]> {
        return this.repository.getAnimations(query);
    }
}
