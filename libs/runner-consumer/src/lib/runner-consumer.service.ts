import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Workload, WorkloadResult } from '@polycode/runner';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class RunnerConsumerService {
  constructor(private httpService: HttpService) {}

  async run(workload: Workload): Promise<AxiosResponse<WorkloadResult>> {
    return firstValueFrom(
      this.httpService.post<WorkloadResult>(
        `${process.env.RUNNER_API_URL}/run`,
        workload
      )
    );
  }
}
