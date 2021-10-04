import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Users } from '../../users/schemas/users.schema';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  done: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  userId: string;

  @Prop({ type: Date, required: true, default: Date.now() })
  createAt: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task);
