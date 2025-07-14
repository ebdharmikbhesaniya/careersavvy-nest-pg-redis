import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { JwtConfig } from './config.type';

class EnvironmentVariablesValidator {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  REFRESH_SECRET: string;

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;
}

export default registerAs<JwtConfig>('jwt', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.REFRESH_SECRET,
    refreshExpires: process.env.REFRESH_TOKEN_EXPIRES_IN,
  };
});
