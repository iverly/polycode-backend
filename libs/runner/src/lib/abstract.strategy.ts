import { AbstractRunner } from './abstract.runner';
import { Workload, WorkloadResult } from './runner';

export abstract class AbstractRunnerStrategy {
  private _runner: AbstractRunner | undefined = undefined;
  abstract init(): Promise<void>;

  /**
   * If the runner is not initialized, throw an error. Otherwise, run the workload.
   * @param {Workload} workload - Workload - The workload to run.
   * @returns A promise that resolves to a WorkloadResult.
   */
  run(workload: Workload): Promise<WorkloadResult> {
    if (!this._runner) {
      throw new Error('Runner is not initialized');
    }

    return this._runner.run(workload);
  }

  /**
   * This function sets the runner property to the value of the runner parameter.
   * @param {AbstractRunner} runner - The runner that will be used to run the test.
   */
  setRunner(runner: AbstractRunner): void {
    this._runner = runner;
  }
}
