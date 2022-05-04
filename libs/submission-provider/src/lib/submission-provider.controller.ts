import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExerciseSubmissionDto } from './dtos/exercise.dto';
import { SubmissionProviderService } from './submission-provider.service';

@Controller('submission')
@ApiTags('Submission')
export class SubmissionProviderController {
  constructor(private submissionProviderService: SubmissionProviderService) {}

  @Post('exercise')
  submitExercise(@Body() exerciseSubmissionDto: ExerciseSubmissionDto) {
    return this.submissionProviderService.submitExercise(exerciseSubmissionDto);
  }
}
