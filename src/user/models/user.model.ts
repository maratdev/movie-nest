import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MovieModel } from '../../movie/models/movie.model';

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: true,
})
export class UserModel extends Document {
  @Prop({
    lowercase: true,
    maxlength: 50,
  })
  username: string;

  @Prop({
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({
    default: [],
    type: Types.ObjectId,
    ref: 'MovieSchema',
  })
  favorites?: MovieModel[];

  @Prop({
    required: true,
    default: false,
  })
  role: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
