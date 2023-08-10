import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Logger } from '@nestjs/common';
import { TestDto } from './dto/test.dto';

@Controller('/members')
export class UsersController {
  @TypedRoute.Post()
  createMember(@TypedBody() body: TestDto) {
    Logger.error('hello', 'world');
    Logger.warn('hello', 'world');
    Logger.log('hello', 'world');
    Logger.debug('hello', 'world');
    return `Hello World! ${body.age}`;
  }
}
