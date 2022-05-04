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
              description: 'The course id',
            },
            name: {
              type: 'string',
              description: 'The course name',
            },
            description: {
              type: 'string',
              description: 'The course description',
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
                    items: {
                      type: 'object',
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
          description: exercise.description,
          language: exercise.language,
        })),
      })),
      exercises: course.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        description: exercise.description,
        language: exercise.language,
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
            description: 'The id of the course',
          },
          name: {
            type: 'string',
            description: 'The name of the course',
          },
          description: {
            type: 'string',
            description: 'The description of the course',
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
                  description: 'The id of the module',
                },
                name: {
                  type: 'string',
                  description: 'The name of the module',
                },
                description: {
                  type: 'string',
                  description: 'The description of the module',
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
                        description: 'The id of the exercise',
                      },
                      name: {
                        type: 'string',
                        description: 'The name of the exercise',
                      },
                      description: {
                        type: 'string',
                        description: 'The description of the exercise',
                      },
                      language: {
                        type: 'string',
                        description: 'The language of the exercise',
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
                  description: 'The id of the exercise',
                },
                name: {
                  type: 'string',
                  description: 'The name of the exercise',
                },
                description: {
                  type: 'string',
                  description: 'The description of the exercise',
                },
                language: {
                  type: 'string',
                  description: 'The language of the exercise',
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
          description: exercise.description,
          language: exercise.language,
        })),
      })),
      exercises: course.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        description: exercise.description,
        language: exercise.language,
      })),
    };
  }
}
