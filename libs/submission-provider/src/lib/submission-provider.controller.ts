import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authorize, UserSubmissionAuthorize } from '@polycode/auth-consumer';
import { ExerciseSubmissionDto } from './dtos/exercise.dto';
import { SubmissionProviderService } from './submission-provider.service';
import { ApiRouteAuthenticated } from '@polycode/docs';

@Controller('submission')
@ApiTags('Submission')
export class SubmissionProviderController {
  constructor(private submissionProviderService: SubmissionProviderService) {}

  @Post('exercise')
  @Authorize(UserSubmissionAuthorize)
  @ApiRouteAuthenticated({
    operation: {
      summary: 'Submit an exercise',
      description: 'Submit an exercise',
    },
    response: {
      status: 200,
      description: 'Exercise submitted successfully',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The exercise submission id',
          },
          execution: {
            type: 'object',
            description: 'The exercise execution',
            properties: {
              success: {
                type: 'boolean',
                description: 'Whether the exercise was executed successfully',
              },
              output: {
                type: 'object',
                description: 'The exercise execution output',
                properties: {
                  stdout: {
                    type: 'string',
                    description: 'The exercise execution output stdout',
                  },
                  stderr: {
                    type: 'string',
                    description: 'The exercise execution output stderr',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  submitExercise(@Body() exerciseSubmissionDto: ExerciseSubmissionDto) {
    return this.submissionProviderService.submitExercise(exerciseSubmissionDto);
  }
}
