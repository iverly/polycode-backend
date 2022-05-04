import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiRoute } from '@polycode/docs';
import { CourseProviderService } from '../services/course.service';

@Controller('course')
@ApiTags('Course')
export class CourseController {
  constructor(private readonly courseService: CourseProviderService) {}

  @Get()
  @ApiRoute({
    operation: {
      summary: 'Get all courses',
      description: 'Get all courses',
    },
    response: {
      status: 200,
      description: 'Returns the course information',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'name', 'description'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            modules: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'name', 'description'],
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                  },
                  name: {
                    type: 'string',
                  },
                  description: {
                    type: 'string',
                  },
                  exercises: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          format: 'uuid',
                        },
                        name: {
                          type: 'string',
                        },
                        statement: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
            exercises: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'name', 'statement'],
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                  },
                  name: {
                    type: 'string',
                  },
                  statement: {
                    type: 'string',
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
    const courses = await this.courseService.getAll();
    return courses.map((course) => ({
      id: course.id,
      name: course.name,
      description: course.description,
      modules: course.modules.map((module) => ({
        id: module.id,
        name: module.name,
        description: module.description,
        exercises: module.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          statement: exercise.statement,
        })),
      })),
      exercises: course.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        statement: exercise.statement,
      })),
    }));
  }

  @Get(':id')
  @ApiRoute({
    operation: {
      summary: 'Get a course by id',
      description: 'Get a course by id',
    },
    response: {
      status: 200,
      description: 'Returns the course information',
      schema: {
        type: 'object',
        required: ['id', 'name', 'description', 'modules', 'exercises'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          modules: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'name', 'description', 'exercises'],
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                name: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                },
                exercises: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['id', 'name', 'statement'],
                    properties: {
                      id: {
                        type: 'string',
                        format: 'uuid',
                      },
                      name: {
                        type: 'string',
                      },
                      statement: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
          exercises: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                name: {
                  type: 'string',
                },
                statement: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async getId(@Param('id', ParseUUIDPipe) id: string) {
    const course = await this.courseService.getById(id);
    return {
      id: course.id,
      name: course.name,
      description: course.description,
      modules: course.modules.map((module) => ({
        id: module.id,
        name: module.name,
        description: module.description,
        exercises: module.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          statement: exercise.statement,
        })),
      })),
      exercises: course.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        statement: exercise.statement,
      })),
    };
  }
}
