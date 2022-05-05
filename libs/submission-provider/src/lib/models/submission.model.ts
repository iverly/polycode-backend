import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { WorkloadResult } from '@polycode/runner';

export enum SubmissionType {
  EXERCISE = 'exercise',
}

export type SubmissionDocument = Submission & Document;

@Schema({
  autoIndex: true,
  autoCreate: true,
  collection: 'polycode_submission',
})
export class Submission {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, type: String })
  type: SubmissionType;

  @Prop({ required: true })
  targetId: string;

  @Prop({ required: true })
  userId: string;

  @Prop(
    raw({
      success: { type: Boolean },
      output: {
        stdout: { type: String },
        stderr: { type: String },
      },
    })
  )
  execution: WorkloadResult;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
