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
            description: {
              type: 'string',
              description: 'The exercise description',
            },
            language: {
              type: 'string',
              description: 'The exercise language',
            },
          },
        },
      },
    },
  })
  async getAll() {
    const exercises = await this.exerciseService.getAll(false);
    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      language: exercise.language,
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
          description: {
            type: 'string',
            description: 'The exercise description',
          },
          statement: {
            type: 'string',
            description: 'The exercise statement',
          },
          language: {
            type: 'string',
            description: 'The exercise language',
          },
          defaultSource: {
            type: 'string',
            description: 'The exercise default source',
          },
        },
      },
    },
  })
  async getId(@Param('id', ParseUUIDPipe) id: string) {
    const exercise = await this.exerciseService.getById(id, false);
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      statement: exercise.statement,
      language: exercise.language,
      defaultSource: exercise.defaultSource,
    };
  }
}
