import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Language } from '@polycode/runner';

export type ExerciseDocument = Exercise & Document;

@Schema({
  autoIndex: true,
  autoCreate: true,
  collection: 'challenge_exercise',
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
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
