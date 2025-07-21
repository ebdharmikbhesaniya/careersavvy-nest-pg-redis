import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AllConfigType } from 'src/config/variables/config.type';
import { REDIS_CLIENT } from 'src/global/constants/redis';
import { RedisService } from './redis.service';

@Global()
@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return new Redis({
              host: configService.get('redisDatabase.host', { infer: true }),
              port: configService.get('redisDatabase.port', { infer: true }),
            });
          },
          inject: [ConfigService],
        },
        RedisService,
      ],
      exports: [REDIS_CLIENT, RedisService],
    };
  }
}
