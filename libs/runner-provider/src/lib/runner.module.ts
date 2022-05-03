import { DynamicModule } from '@nestjs/common';
import { RunnerProviderController } from './runner.controller';
import { RunnerProviderService } from './runner.service';
import { AbstractRunnerStrategy } from '@polycode/runner';
import {
  RUNNER_MODULE_INIT_PROVIDER,
  RUNNER_MODULE_OPTIONS_PROVIDER,
} from './runner.constants';

export interface RunnerProviderOptions {
  strategy: AbstractRunnerStrategy;
}

export class RunnerProviderModule {
  static register(options: RunnerProviderOptions): DynamicModule {
    return {
      module: RunnerProviderModule,
      controllers: [RunnerProviderController],
      providers: [
        {
          provide: RUNNER_MODULE_OPTIONS_PROVIDER,
          useValue: options,
        },
        {
          provide: RUNNER_MODULE_INIT_PROVIDER,
          useFactory: async () => {
            return await options.strategy.init();
          },
        },
        RunnerProviderService,
      ],
      exports: [RunnerProviderService],
    };
  }
}
