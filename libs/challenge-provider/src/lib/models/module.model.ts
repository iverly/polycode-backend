import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Exercise } from './exercise.model';
import { Course } from './course.model';

export type ModuleDocument = Module & Document;

@Schema({
  autoIndex: true,
  autoCreate: true,
  collection: 'polycode_challenge_module',
})
export class Module {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }] })
  exercises: Exercise[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course?: Course;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
