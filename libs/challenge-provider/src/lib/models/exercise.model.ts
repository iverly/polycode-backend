import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Language } from '@polycode/runner';
import { Module } from './module.model';
import * as mongoose from 'mongoose';
import { Course } from './course.model';

export type ExerciseDocument = Exercise & Document;

@Schema({
  autoIndex: true,
  autoCreate: true,
  collection: 'polycode_challenge_exercise',
})
export class Exercise {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  statement: string;

  @Prop({ required: true, type: String })
  language: Language;

  @Prop({ required: true })
  defaultSource: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module' })
  module?: Module;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course?: Course;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
