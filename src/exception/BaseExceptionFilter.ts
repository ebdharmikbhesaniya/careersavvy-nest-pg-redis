/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from './base.exception';
import { CommonResponse } from './common.response.dto';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.error.status ?? 406;
    const message = exception.error.message;
    // const query = exception.error?.query;
    // const parameters = exception.error?.parameters;
    // const length = exception.error?.length;
    // const code = exception.error?.code;

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
