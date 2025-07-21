import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { ProviderConfig } from './config.type';

class EnvironmentVariablesValidator {
  @IsString()
  THEIRSTACK_TOKEN: string;

  @IsString()
  THEIRSTACK_URL: string;

  @IsString()
  THEIRSTACK_PREFIX: string;
}

export default registerAs<ProviderConfig>('provider', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    theirstackToken: process.env.THEIRSTACK_TOKEN,
    theirstackUrl: process.env.THEIRSTACK_URL,
    theirstackPrefix: process.env.THEIRSTACK_PREFIX,
  };
});
