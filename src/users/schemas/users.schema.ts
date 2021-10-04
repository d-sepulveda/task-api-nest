import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true,})
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  tokens: [
    {
      token: String;
    },
  ];

  @Prop({ type: Date, required: true, default: Date.now() })
  createAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
