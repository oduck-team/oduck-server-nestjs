import {Controller} from '@nestjs/common';
import {AnimationService} from "./animation.service";
import {TypedRoute} from "@nestia/core";
import {Animation} from "@prisma/client";

@Controller('animation')
export class AnimationController {
    constructor(private readonly service: AnimationService) {}

    @TypedRoute.Get("/")
    getList(): Promise<Animation[]> {
        return this.service.getAnimations();
    }
}
