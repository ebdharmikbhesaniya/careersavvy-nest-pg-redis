/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CommonResponse } from './common.response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() ?? 406;
    const message = exception.response.errors ?? exception.message;

    console.log('exception', exception);

    const errorData: CommonResponse<null> = {
      status: false,
      code: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: null,
    };
    response.status(status).json(errorData);
  }
}
// https://stackoverflow.com/questions/58993405/how-can-i-handle-typeorm-error-in-nestjs
