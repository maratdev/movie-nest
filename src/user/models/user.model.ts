import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: true,
})
export class UserModel extends Document {
  @Prop({
    required: true,
    lowercase: true,
    maxlength: 50,
  })
  username: string;

  @Prop({
    required: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: [],
  })
  favorites: string[];

  @Prop({
    required: true,
    default: false,
  })
  role: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
