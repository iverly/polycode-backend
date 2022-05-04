import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Exercise } from './exercise.model';

export type ModuleDocument = Module & Document;

@Schema({
  autoIndex: true,
  autoCreate: true,
  collection: 'challenge_module',
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
}

export const ModuleSchema = SchemaFactory.createForClass(Module);