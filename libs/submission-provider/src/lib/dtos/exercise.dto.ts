import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ExerciseSubmissionDto {
  @IsUUID(4)
  exerciseId: string;

  @IsString()
  @IsNotEmpty()
  source: string;
}
