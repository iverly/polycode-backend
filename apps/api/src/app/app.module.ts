import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SequelizeModule } from '@nestjs/sequelize';
import { Environment } from '@polycode/env';
import { validate } from './env.validation';
import {
  AuthProviderModule,
  sequelizeModels as AuthSequelizeModels,
} from '@polycode/auth-provider';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { AppController } from './app.controller';
import {
  UserProviderModule,
  sequelizeModels as UserSequelizeModels,
} from '@polycode/user-provider';
import { NotificationProviderModule } from '@polycode/notification-provider';
import { NotificationConsumerModule } from '@polycode/notification-consumer';
import { NotificationCatcherModule } from '@polycode/notification-catcher';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeProviderModule } from '@polycode/challenge-provider';
import { SubmissionProviderModule } from '@polycode/submission-provider';
import { RunnerConsumerModule } from '@polycode/runner-consumer';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      logging:
        process.env.NODE_ENV === Environment.PRODUCTION ? false : console.log,
      host: process.env.AUTH_DATABASE_HOST,
      port: Number(process.env.AUTH_DATABASE_PORT),
      username: process.env.AUTH_DATABASE_USER,
      password: process.env.AUTH_DATABASE_PASSWORD,
      database: process.env.AUTH_DATABASE_NAME,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: process.env.NODE_ENV === Environment.PRODUCTION ? 50 : 2,
        min: process.env.NODE_ENV === Environment.PRODUCTION ? 20 : 2,
        idle: 5000,
      },
      models: [...AuthSequelizeModels, ...UserSequelizeModels],
      define: {
        underscored: true,
      },
      autoLoadModels: true,
    }),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL,
      },
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    NotificationProviderModule,
    NotificationConsumerModule,
    NotificationCatcherModule,
    AuthProviderModule,
    AuthConsumerModule,
    UserProviderModule,
    ChallengeProviderModule,
    SubmissionProviderModule,
    RunnerConsumerModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
