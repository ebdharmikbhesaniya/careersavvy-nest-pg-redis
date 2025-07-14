import { Injectable } from '@nestjs/common';
import { CommonResponse } from './common.response.dto';

@Injectable()
export class ApiService {
  // Success overloads
  success<T>(data?: T): CommonResponse<T | undefined>;
  success<T>(data: T, message: string): CommonResponse<T>;
  success<T>(data: T, message: string, code: string): CommonResponse<T>;
  success<T>(
    data: T,
    message: string,
    code: string,
    status: boolean,
  ): CommonResponse<T>;
  success<T>(
    data?: T,
    message?: string,
    code?: string,
    status?: boolean,
  ): CommonResponse<T | undefined> {
    return new CommonResponse(
      data,
      message,
      code,
      status !== undefined ? status : true,
    );
  }

  // Error overloads
  error<T>(data?: T): CommonResponse<T | undefined>;
  error<T>(data: T, message: string): CommonResponse<T>;
  error<T>(data: T, message: string, code: string): CommonResponse<T>;
  error<T>(
    data: T,
    message: string,
    code: string,
    status: boolean,
  ): CommonResponse<T>;
  error<T>(
    data?: T,
    message?: string,
    code?: string,
    status?: boolean,
  ): CommonResponse<T | undefined> {
    return new CommonResponse(
      data,
      message,
      code,
      status !== undefined ? status : false,
    );
  }
}
