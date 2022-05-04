import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RunnerConsumerService } from './runner-consumer.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    HttpModule.register({
      timeout: 2 * 60 * 1000,
    }),
  ],
  controllers: [],
  providers: [RunnerConsumerService],
  exports: [RunnerConsumerService],
})
export class RunnerConsumerModule {}
