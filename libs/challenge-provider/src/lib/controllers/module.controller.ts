import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiRoute } from '@polycode/docs';
import { ModuleProviderService } from '../services/module.service';

@Controller('module')
@ApiTags('Module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleProviderService) {}

  @Get()
  @ApiRoute({
    operation: {
      summary: 'Get all modules',
      description: 'Get all modules',
    },
    response: {
      status: 200,
      description: 'Returns the module information',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'name', 'statement'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The module id',
            },
            name: {
              type: 'string',
              description: 'The module name',
            },
            statement: {
              type: 'string',
              description: 'The module statement',
            },
            exercises: {
              type: 'array',
              description: 'The module exercises',
              items: {
                type: 'object',
                required: ['id', 'name'],
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
                },
              },
            },
          },
        },
      },
    },
  })
  async getAll() {
    const modules = await this.moduleService.getAll();
    return modules.map((module) => ({
      id: module.id,
      name: module.name,
      description: module.description,
      exercises: module.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
      })),
    }));
  }

  @Get(':id')
  @ApiRoute({
    operation: {
      summary: 'Get a module by id',
      description: 'Get a module by id',
    },
    response: {
      status: 200,
      description: 'Returns the module information',
      schema: {
        type: 'object',
        required: ['id', 'name', 'description'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The module id',
          },
          name: {
            type: 'string',
            description: 'The module name',
          },
          description: {
            type: 'string',
            description: 'The module description',
          },
          exercises: {
            type: 'array',
            description: 'The module exercises',
            items: {
              type: 'object',
              required: ['id', 'name'],
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
              },
            },
          },
        },
      },
    },
  })
  async getId(@Param('id', ParseUUIDPipe) id: string) {
    const module = await this.moduleService.getById(id);
    return {
      id: module.id,
      name: module.name,
      description: module.description,
      exercises: module.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
      })),
    };
  }
}
