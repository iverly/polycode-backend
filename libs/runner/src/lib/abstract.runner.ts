import { Workload, WorkloadResult } from './runner';

export abstract class AbstractRunner {
  abstract run(workload: Workload): Promise<WorkloadResult>;
}
