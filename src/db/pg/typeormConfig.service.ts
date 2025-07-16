import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Resume } from 'src/app/resume/entities/resume.entity';
import { UserEntity } from 'src/app/user/entities/user.entity';
import { AllConfigType } from 'src/config/variables/config.type';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('pgDatabase.type', { infer: true }),
      url: this.configService.get('pgDatabase.url', { infer: true }),
      host: this.configService.get('pgDatabase.host', { infer: true }),
      port: this.configService.get('pgDatabase.port', { infer: true }),
      username: this.configService.get('pgDatabase.username', { infer: true }),
      password: this.configService.get('pgDatabase.password', { infer: true }),
      database: this.configService.get('pgDatabase.name', { infer: true }),
      synchronize: this.configService.get('pgDatabase.synchronize', {
        infer: true,
      }),
      dropSchema: false,
      keepConnectionAlive: true,
      logging:
        this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
      entities: [UserEntity, Resume],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('pgDatabase.maxConnections', {
          infer: true,
        }),
        ssl: this.configService.get('pgDatabase.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: this.configService.get(
                'pgDatabase.rejectUnauthorized',
                { infer: true },
              ),
              ca:
                this.configService.get('pgDatabase.ca', { infer: true }) ??
                undefined,
              key:
                this.configService.get('pgDatabase.key', { infer: true }) ??
                undefined,
              cert:
                this.configService.get('pgDatabase.cert', { infer: true }) ??
                undefined,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
