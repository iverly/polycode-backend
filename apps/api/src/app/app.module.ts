import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Environment } from '@polycode/env';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
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
      models: [],
      define: {
        underscored: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
