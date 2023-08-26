import { HttpStatus } from '@nestjs/common';

export class ApiResponse {
  private success: boolean;
  private status: HttpStatus;
  private result: Result;

  private constructor(success: boolean, status: HttpStatus, result: Result) {
    this.success = success;
    this.status = status;
    this.result = result;
  }

  static ok<T>(status: HttpStatus, data: T): ApiResponse {
    return new ApiResponse(true, status, new Success(data));
  }

  static fail(status: HttpStatus, errMsg: string): ApiResponse {
    return new ApiResponse(false, status, new Failure(new Date(), errMsg));
  }
}

interface Result {}

class Success<T> implements Result {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

class Failure implements Result {
  timestamp: Date;
  errMsg: string;

  constructor(timestamp: Date, errMsg: string) {
    this.timestamp = timestamp;
    this.errMsg = errMsg;
  }
}
