import { Course } from './course.type';
import { Exercise } from './exercise.type';

export interface Module {
  id: string;
  name: string;
  description: string;
  exercises?: Exercise[];
  course?: Course;
}
