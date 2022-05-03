import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Workload, WorkloadResult } from '@polycode/runner';
import { RUNNER_MODULE_OPTIONS_PROVIDER } from './runner.constants';
import { RunnerProviderOptions } from './runner.module';

@Injectable()
export class RunnerProviderService {
  private logger: Logger = new Logger(RunnerProviderService.name);

  constructor(
    @Inject(RUNNER_MODULE_OPTIONS_PROVIDER)
    private options: RunnerProviderOptions
  ) {}

  /**
   * It runs the workload using the strategy that was passed in the constructor
   * @param {Workload} workload - Workload - This is the workload object that was passed to the run()
   * method.
   * @returns A promise of a WorkloadResult
   */
  run(workload: Workload): Promise<WorkloadResult> {
    try {
      return this.options.strategy.run(workload);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
