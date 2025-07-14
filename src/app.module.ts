import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { JwtConfigModule } from './config/jwt-config/jwt-config.module';
import jwtConfig from './config/variables/jwt.config';
import pgDatabaseConfig from './config/variables/pgDatabase.config';
import redisDatabaseConfig from './config/variables/redisDatabase.config';
import { TypeOrmConfigService } from './db/pg/typeormConfig.service';
import { RedisModule } from './db/redis/redis.module';
import { ApiModule } from './exception/api.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [pgDatabaseConfig, jwtConfig, redisDatabaseConfig],
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) =>
        new DataSource(options).initialize(),
    }),

    RedisModule.forRoot(),
    JwtConfigModule,
    UserModule,
    AuthModule,
    ApiModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users');
  }
}
