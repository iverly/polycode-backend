import { Module } from '@nestjs/common';
import { RunnerDockerStrategy } from '@polycode/runner-docker-strategy';
import { RunnerProviderModule } from '@polycode/runner-provider';
import { ConfigModule } from '@nestjs/config';
import { Language } from '@polycode/runner';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RunnerProviderModule.register({
      strategy: new RunnerDockerStrategy({
        images: [
          {
            language: Language.JAVA,
            image: 'polycode/java-runner:latest',
          },
          {
            language: Language.JAVASCRIPT,
            image: 'polycode/javascript-runner:latest',
          },
          {
            language: Language.PYTHON,
            image: 'polycode/python-runner:latest',
          },
          {
            language: Language.RUST,
            image: 'polycode/rust-runner:latest',
          },
        ],
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
