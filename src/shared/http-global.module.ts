import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/variables/config.type';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<AllConfigType>) => ({
        baseURL: `${config.get('provider.theirstackUrl', { infer: true })}${config.get('provider.theirstackPrefix', { infer: true })}`,
        headers: {
          Authorization: `Bearer ${config.get('provider.theirstackToken', { infer: true })}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 10000,
      }),
    }),
  ],
  exports: [HttpModule],
})
export class HttpGlobalModule {}
