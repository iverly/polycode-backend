import { Module } from '@nestjs/common';
import { RunnerDockerStrategy } from '@polycode/runner-docker-strategy';
import { RunnerProviderModule } from '@polycode/runner-provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RunnerProviderModule.register({
      strategy: new RunnerDockerStrategy(),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
