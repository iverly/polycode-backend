import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Workload } from '@polycode/runner';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RunnerConsumerService {
  constructor(private httpService: HttpService) {}

  async run(workload: Workload) {
    return firstValueFrom(
      this.httpService.post(`${process.env.RUNNER_API_URL}/run`, workload)
    );
  }
}
