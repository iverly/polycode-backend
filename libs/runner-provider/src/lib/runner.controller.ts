import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RunnerProviderService } from './runner.service';
import { Workload } from '@polycode/runner';
import { ApiRoute } from '@polycode/docs';

@Controller()
@ApiTags('Runner')
export class RunnerProviderController {
  constructor(private runnerProviderService: RunnerProviderService) {}

  @Post()
  @ApiRoute({
    operation: {
      summary: 'Runs a workload',
      description: 'Runs a workload',
    },
    body: {
      schema: {
        type: 'object',
        required: ['source', 'language', 'version'],
        properties: {
          id: {
            type: 'string',
            description: 'The id of the workload',
          },
          source: {
            type: 'string',
            description: 'Source code of the workload',
          },
          compilerOptions: {
            type: 'object',
            properties: {
              language: {
                type: 'string',
                description: 'Language of the workload',
              },
              version: {
                type: 'string',
                description: 'Version of the language',
              },
            },
          },
        },
      },
    },
  })
  run(@Body() workload: Workload) {
    return this.runnerProviderService.run(workload);
  }
}
