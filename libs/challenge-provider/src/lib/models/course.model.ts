import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Exercise } from './exercise.model';
import { Module } from './module.model';

export type CourseDocument = Course & Document;

@Schema({
  autoIndex: true,
  autoCreate: true,
  collection: 'polycode_challenge_course',
})
export class Course {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }] })
  modules: Module[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }] })
  exercises: Exercise[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
