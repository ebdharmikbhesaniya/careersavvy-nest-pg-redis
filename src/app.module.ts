import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AuthModule } from './app/auth/auth.module';
import { JobsModule } from './app/jobs/jobs.module';
import { UserModule } from './app/user/user.module';
import { JwtConfigModule } from './config/jwt-config/jwt-config.module';
import appConfig from './config/variables/app.config';
import fileConfig from './config/variables/file.config';
import jwtConfig from './config/variables/jwt.config';
import pgDatabaseConfig from './config/variables/pgDatabase.config';
import providerConfig from './config/variables/provider.config';
import redisDatabaseConfig from './config/variables/redisDatabase.config';
import { TypeOrmConfigService } from './db/pg/typeormConfig.service';
import { RedisModule } from './db/redis/redis.module';
import { ApiModule } from './exception/api.module';
import { FilesModule } from './files/files.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { HttpGlobalModule } from './shared/http-global.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        pgDatabaseConfig,
        jwtConfig,
        redisDatabaseConfig,
        fileConfig,
        providerConfig,
      ],
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) =>
        new DataSource(options).initialize(),
    }),

    RedisModule.forRoot(),
    HttpGlobalModule,
    JwtConfigModule,
    FilesModule,
    UserModule,
    AuthModule,
    ApiModule,
    JobsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users');
  }
}
