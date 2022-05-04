import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiRoute } from '@polycode/docs';
import { ExerciseProviderService } from '../services/exercise.service';

@Controller('exercise')
@ApiTags('Exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseProviderService) {}

  @Get()
  @ApiRoute({
    operation: {
      summary: 'Get all exercises',
      description: 'Get all exercises',
    },
    response: {
      status: 200,
      description: 'Returns the exercise information',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'name', 'statement'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The exercise id',
            },
            name: {
              type: 'string',

              description: 'The exercise name',
            },
            statement: {
              type: 'string',
              description: 'The exercise statement',
            },
          },
        },
      },
    },
  })
  async getAll() {
    const exercises = await this.exerciseService.getAll();
    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      statement: exercise.statement,
    }));
  }

  @Get(':id')
  @ApiRoute({
    operation: {
      summary: 'Get an exercise by id',
      description: 'Get an exercise by id',
    },
    response: {
      status: 200,
      description: 'Returns the exercise information',
      schema: {
        type: 'object',
        required: ['id', 'name', 'statement'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The exercise id',
          },
          name: {
            type: 'string',
            description: 'The exercise name',
          },
          statement: {
            type: 'string',
            description: 'The exercise statement',
          },
        },
      },
    },
  })
  async getId(@Param('id', ParseUUIDPipe) id: string) {
    const exercise = await this.exerciseService.getById(id);
    return {
      id: exercise.id,
      name: exercise.name,
      statement: exercise.statement,
    };
  }
}
