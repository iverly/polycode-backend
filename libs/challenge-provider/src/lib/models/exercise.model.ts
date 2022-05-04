import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  statement: string;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
