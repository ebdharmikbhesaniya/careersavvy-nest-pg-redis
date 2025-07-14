import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AllConfigType } from 'src/config/variables/config.type';

@Injectable()
export class RedisProvider {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  getClient(): Redis {
    return new Redis({
      host: this.configService.get('redisDatabase.host', { infer: true }),
      port: this.configService.get('redisDatabase.port', { infer: true }),
      // password: this.configService.get('redisDatabase.password', { infer: true }),
    });
  }
}
