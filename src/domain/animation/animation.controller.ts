import {Controller} from '@nestjs/common';
import {AnimationService} from "./animation.service";
import {TypedQuery, TypedRoute} from "@nestia/core";
import {Animation} from "@prisma/client";
import {IAnimation} from "./model/animation.list.dto";

@Controller('animation')
export class AnimationController {
    constructor(private readonly service: AnimationService) {}

    @TypedRoute.Get("/")
    async getList(
        @TypedQuery() query: IAnimation.IList
    ): Promise<Animation[]> {
        return this.service.getAnimations(query);
    }
}
