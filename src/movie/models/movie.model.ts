import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GenreModel } from '../../genre/models/genre.model';
import { ActorModel } from '../../actor/models/actor.model';

export class Parameter {
  @Prop()
  year: number;

  @Prop()
  duration: number;

  @Prop()
  country: string;
}

@Schema({
  collection: 'movies',
  versionKey: false,
  timestamps: true,
})
export class MovieModel extends Document {
  @Prop()
  poster: string;

  @Prop()
  bigPoster: string;

  @Prop({ unique: true })
  title: string;

  @Prop()
  parameters: Parameter;

  @Prop({ default: 4.0 })
  rating?: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'GenreSchema',
  })
  genres: GenreModel[];

  @Prop({ default: 0 })
  countOpened?: number;

  @Prop({ unique: true })
  videoUrl: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'ActorSchema',
  })
  actors: ActorModel[];

  @Prop({ unique: true })
  slug: string;

  @Prop({ default: false })
  isSendTelegram?: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(MovieModel);
