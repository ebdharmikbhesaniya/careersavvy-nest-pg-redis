/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { registerAs } from '@nestjs/config';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { RedisDatabaseConfig } from './config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  REDIS_HOST: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  REDIS_PORT: number;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  @IsOptional()
  REDIS_TTL: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  REDIS_PASSWORD: string;
}

export default registerAs<RedisDatabaseConfig>('redisDatabase', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD,
    ttl: process.env.REDIS_TTL,
  };
});
