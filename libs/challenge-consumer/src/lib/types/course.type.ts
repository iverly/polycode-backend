import { Exercise } from './exercise.type';
import { Module } from './module.type';

export interface Course {
  id: string;
  name: string;
  description: string;
  modules?: Module[];
  exercises?: Exercise[];
}
