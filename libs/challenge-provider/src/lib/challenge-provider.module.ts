import { Module as NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exercise, ExerciseSchema } from './models/exercise.model';
import { Module, ModuleSchema } from './models/module.model';
import { ExerciseProviderService } from './services/exercise.service';
import { ExerciseController } from './controllers/exercise.controller';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { ModuleProviderService } from './services/module.service';
import { ModuleController } from './controllers/module.controller';
import { CourseController } from './controllers/course.controller';
import { CourseProviderService } from './services/course.service';
import { Course, CourseSchema } from './models/course.model';

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
      { name: Module.name, schema: ModuleSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
    AuthConsumerModule,
  ],
  controllers: [ExerciseController, ModuleController, CourseController],
  providers: [
    ExerciseProviderService,
    ModuleProviderService,
    CourseProviderService,
  ],
  exports: [],
})
export class ChallengeProviderModule {}
