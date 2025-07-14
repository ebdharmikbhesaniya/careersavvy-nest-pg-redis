import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { AllConfigType } from '../variables/config.type';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get('jwt.secret', { infer: true }),
      signOptions: {
        expiresIn:
          this.configService.get('jwt.expires', { infer: true }) || '1h',
      },
    };
  }
}
