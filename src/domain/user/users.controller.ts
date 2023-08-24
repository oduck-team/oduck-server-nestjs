import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Logger } from '@nestjs/common';
import { TestDto } from './dto/create-user.dto';

@Controller('/users')
export class UsersController {
  @TypedRoute.Post()
  createUser(@TypedBody() body: TestDto) {
    Logger.error('hello', 'world');
    Logger.warn('hello', 'world');
    Logger.log('hello', 'world');
    Logger.debug('hello', 'world');
    return `Hello World! ${body.age}`;
  }
}
