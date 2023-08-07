import { UserModule } from './domain/user/user.module';
import { Module } from '@nestjs/common';
import {AnimationModule} from "./domain/animation/animation.module";

@Module({
  imports: [UserModule, AnimationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
