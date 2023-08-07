import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { TestDto } from './dto/create-user.dto';

@Controller('/users')
export class UsersController {
  @TypedRoute.Post()
  createUser(@TypedBody() body: TestDto) {
    return `Hello World! ${body.age}`;
  }
}
