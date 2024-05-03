import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MovieModel } from '../../movie/models/movie.model';
import { UserModel } from '../../user/models/user.model';

@Schema({
  collection: 'ratings',
  versionKey: false,
  timestamps: true,
})
export class RatingModel extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'UserSchema',
  })
  userId: UserModel;

  @Prop({
    type: Types.ObjectId,
    ref: 'MovieSchema',
  })
  movieId: MovieModel;

  @Prop()
  value: number;
}

export const RatingSchema = SchemaFactory.createForClass(RatingModel);
